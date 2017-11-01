const schema = require('./util/schema');
var newsletterDTO = {
  content: {
    type: String,
    required: true,
  },
  idHilo: {
    ref: 'Forum-hilo',
    required: true,
  },
  creationDate: {
    type: Date,
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
