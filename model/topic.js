const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Topic';
const COLLECTION_NAME = 'topics';
const topicSchema = new Schema({
    topic_name: {
        type: String,
        require: true
    },
    topic_slug: {
        type: String,
        require: true
    }
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, topicSchema);