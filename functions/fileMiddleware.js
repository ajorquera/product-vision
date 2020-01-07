const Busboy = require('busboy')
const os = require('os')
const fs = require('fs')
const path = require('path')

module.exports = function(req, res, next) {
    // See https://cloud.google.com/functions/docs/writing/http#multipart_data
    const busboy = new Busboy({
      headers: req.headers
    });
  
    const fields = {};
    const files = [];
    const fileWrites = [];
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    const tmpdir = os.tmpdir();
  
    busboy.on('field', (key, value) => {
      // You could do additional deserialization logic here, values will just be
      // strings
      fields[key] = value;
    });
  
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(tmpdir, filename);
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);
  
      fileWrites.push(new Promise((resolve, reject) => {
        file.on('end', () => writeStream.end());
        writeStream.on('finish', () => {
          fs.readFile(filepath, (err, buffer) => {
            const size = Buffer.byteLength(buffer);
            if (err) {
              return reject(err);
            }
  
            files.push({
              fieldname,
              originalname: filename,
              encoding,
              mimetype,
              buffer,
              size,
            });
  
            try {
              fs.unlinkSync(filepath);
            } catch (error) {
              return reject(error);
            }
  
            resolve();
          });
        });
        writeStream.on('error', reject);
      }));
    });
  
    busboy.on('finish', () => {
      Promise.all(fileWrites)
        .then(() => {
          req.body = fields;
          req.file = files[0];
          next();
        })
        .catch(next);
    });
    
    if(req.rawBody) {
      busboy.end(req.rawBody);
    } else {
      req.pipe(busboy);
    }
  }