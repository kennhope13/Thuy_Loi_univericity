const { Types } = require("mongoose")

const converToObject = id => new Types.ObjectId(id);

module.exports = converToObject;
