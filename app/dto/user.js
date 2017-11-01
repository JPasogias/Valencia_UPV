const schema = require('./util/schema');
var userDto = {
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  superadmin: {
    type: Boolean,
    default: false,
  },
  welcomeModal: {
    type: Boolean,
    default: true,
  },
  creationDate: {
    type: Date,
    default: new Date,
  },
  lastLogin: {
    type: Date,
    default: new Date,
  },
  personalInfo: {
    name: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    interests: {
      type: String,
      required: false,
    },
    occupation: {
      type: String,
      required: false,
    },
    aboutMe: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      default: '/images/default-profile.png',
    },
  },
};

exports.schema = {
  mongoose: schema.toMongoose(userDto),
};
