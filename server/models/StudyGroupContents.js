const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studygroupContentsSchema = mongoose.Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  studygroupId: {
    type: Schema.Types.ObjectId,
    ref: 'StudyGroup'
  },
  title: {
    type: String
  },
  content: {
    type: String
  }
}, { timestamps: true })

const StudyGroupContents = mongoose.model('StudyGroupContents', studygroupContentsSchema);

module.exports = { StudyGroupContents }
