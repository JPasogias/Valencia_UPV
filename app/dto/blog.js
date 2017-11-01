const schema = require('./util/schema');
var newsletterDTO = {
  header: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: new Date(),
  },
  publishdate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  contentmsg: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '/images/default-post.jpg',
  },
  idUser: {
    ref: 'User',
    required: true,
  }
};

exports.schema = {
  mongoose: schema.toMongoose(newsletterDTO),
};
