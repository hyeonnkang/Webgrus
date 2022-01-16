const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lectureHomeworkSchema = mongoose.Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lectureId: {
    type: Schema.Types.ObjectId,
    ref: 'Lecture'
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  link: {
    type: String
  }
}, { timestamps: true })

const LectureHomework = mongoose.model('LectureHomework', lectureHomeworkSchema);

module.exports = { LectureHomework }
