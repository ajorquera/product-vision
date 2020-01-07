const gVision = require('@google-cloud/vision');
const {set} = require('lodash');

const visionClient = new gVision.ImageAnnotatorClient();

const requestOpts = {
  image: {
    content: null,
  },
};

module.exports = (image, type='TEXT_DETECTION') => {
    const features = Array.isArray(type) ? type.map(type => ({type})) : [{type}];
    const opts = {...requestOpts, features};
    
    set(opts, 'image.content', image.buffer);

    return visionClient.annotateImage(opts).then(data => data[0]);
  }