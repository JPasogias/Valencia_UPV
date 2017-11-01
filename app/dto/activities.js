const schema = require('./util/schema');
var activityDto = {
  idUser: {
    ref: 'User',
  },
  time: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  readed: {
    type: Boolean,
    default: false,
  },
  typeGroup: {
    idGroup: {
      ref: 'Group',
    },
    groupName: {
      type: String,
    },
  },
};

exports.schema = {
  mongoose: schema.toMongoose(activityDto),
};
