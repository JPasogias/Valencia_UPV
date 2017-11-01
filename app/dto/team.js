const schema = require('./util/schema');
var teamDTO = {
  name: {
    type: String,
    required: true,
  },
  nameLowerCase: {
    type: String,
    required: true,
  },
  isMandatory: {
    type: Boolean,
    default: false,
  },
  members: [{
    _id: false,
    idUser: {
      ref: 'User',
      required: true,
    },
    joinDate: {
      type: Date,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  }, ],
  creationDate: {
    type: Date,
    default: new Date,
  },
  insignia: {
    type: String,
    default: '/images/default-team.png',
  },
  description: {
    type: String,
    required: true,
  },
};

exports.schema = {
  mongoose: schema.toMongoose(teamDTO),
};
