const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lectureContentsSchema = mongoose.Schema({
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
  }
}, { timestamps: true })

const LectureContents = mongoose.model('LectureContents', lectureContentsSchema);

module.exports = { LectureContents }
