var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
  title: {type: String, required: true},
  city: {type: String, required: true},
  address: {type: String, required: true},
  price:{type: Number, required: true, trim: true},
  room:{type: Number, required: true},
  toilet:{type: Number, required: true},
  info: {type: String},
  owner: {
    username: {type: String},
    _id: {type: ObjectId}
  },
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Post = mongoose.model('Post', schema);

module.exports = Post;

