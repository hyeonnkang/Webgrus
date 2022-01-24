const express = require('express');
const router = express.Router();
const { StudyGroupContents } = require("../models/StudyGroupContents");

const { auth } = require("../middleware/auth");

router.post('/post', (req, res) => {
  const list = new StudyGroupContents(req.body)
  list.save((err, newList) => {
    if (err) return res.json({ success: false, err })
    StudyGroupContents.find({ "_id": newList._id }).populate('writer').exec((err, List) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).json({ success: true })
    })
  })
})

router.post('/get', (req, res) => {
  StudyGroupContents.find({ "studygroupId": req.body.studygroupId }).populate('writer').exec((err, studygroupContents) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true, studygroupContents })
  })
})

router.post('/delete', (req, res) => {
  StudyGroupContents.findOne({ "_id": req.body.postId }).populate('writer').remove((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

router.post('/edit', (req, res) => {
  StudyGroupContents.updateOne({ "_id": req.body.postId }, { $set: { title: req.body.title, content: req.body.content}}).exec((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

module.exports = router;
