const express = require('express');
const router = express.Router();
const { LectureContents } = require("../models/LectureContents");

const { auth } = require("../middleware/auth");

router.post('/post', (req, res) => {
  const list = new LectureContents(req.body)
  list.save((err, newList) => {
    if (err) return res.json({ success: false, err })
    LectureContents.find({ "_id": newList._id }).populate('writer').exec((err, List) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).json({ success: true })
    })
  })
})

router.post('/get', (req, res) => {
  LectureContents.find({ "lectureId": req.body.lectureId }).populate('writer').exec((err, lectureContents) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true, lectureContents })
  })
})

router.post('/delete', (req, res) => {
  LectureContents.findOne({ "_id": req.body.postId }).populate('writer').remove((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

router.post('/edit', (req, res) => {
  LectureContents.updateOne({ _id: req.body.postId }, { $set: { title: req.body.title, content: req.body.content}}).exec((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

module.exports = router;
