const gVision = require('../gVision')

module.exports = async (req, res, next) => {
    const type = req.body.type;
    const gVisionRes = await gVision(req.file, type);
    res.json(gVisionRes);
}; 