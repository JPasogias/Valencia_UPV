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
  request: {
    userAdressee: {
      ref: 'User',
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
