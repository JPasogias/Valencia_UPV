const schema = require('./util/schema');
var newsletterDTO = {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  public: {
    type: Boolean,
    required: true,
  },
  idUser: {
    ref: 'User',
    required: true,
  },
};

exports.schema = {
  mongoose: schema.toMongoose(newsletterDTO),
};
