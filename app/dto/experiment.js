const schema = require('./util/schema');

var experimentDTO = {
  title: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: new Date(),
  },
  idUser: {
    ref: 'User',
    required: true,
  },
  chassis: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  keyword1: {
    type: String,
    required: true,
  },
  keyword2: {
    type: String,
    required: true,
  },
  keyword3: {
    type: String,
    required: true,
  },
  keyword4: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  abstractmsg: {
    type: String,
    required: true,
  },
  abstractimage: {
    type: String,
    default: '/images/default-experiment.png',
  },
  forum: {
    type: String,
    required: false,
  },
  protocolmsg: {
    type: String,
    required: true,
  },
  conditionsmsg: {
    type: String,
    required: true,
  },
  resultsmsg: {
    type: String,
    required: true,
  },
  bibliographymsg: {
    type: String,
    require: true,
  },
  reactives: [{
    _id: false,
    name: {
      type: String,
      required: true,
    },
    concentration: {
      type: Number,
      default: false,
    },
  }, ],
  equipment: [{
    _id: false,
    name: {
      type: String,
      required: false,
    },
  }, ],
  plants: {
    type: Number,
    default: 0,
  },
  replications: {
    type: Number,
    default: 0,
  },
};

exports.schema = {
  mongoose: schema.toMongoose(experimentDTO),
};
