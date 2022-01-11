const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lectureApplicationSchema = mongoose.Schema({
  LectureId: {
    type: String
  },
  ApplicantInfo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

const LectureApplication = mongoose.model('LectureApplication', lectureApplicationSchema);

module.exports = { LectureApplication }
