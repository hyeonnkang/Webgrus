const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studygroupApplicationSchema = mongoose.Schema({
  studygroupId: {
    type: String
  },
  ApplicantInfo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

const StudyGroupApplication = mongoose.model('StudyGroupApplication', studygroupApplicationSchema);

module.exports = { StudyGroupApplication }
