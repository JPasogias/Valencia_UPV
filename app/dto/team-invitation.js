const schema = require('./util/schema');
var teamInvitationDTO = {
  idTeam: {
    ref: 'Team',
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  invitation: {
    userSender: {
      ref: 'User',
    },
    userEmail: {
      type: String,
      required: true,
    },
  },
  accepted: {
    type: Boolean,
    default: false,
  },
};

exports.schema = {
  mongoose: schema.toMongoose(teamInvitationDTO),
};
