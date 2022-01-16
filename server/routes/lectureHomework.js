const express = require('express');
const router = express.Router();
const { LectureHomework } = require("../models/LectureHomework");

const { auth } = require("../middleware/auth");

router.post('/post', (req, res) => {
  const list = new LectureHomework(req.body)
  list.save((err, newList) => {
    if (err) return res.json({ success: false, err })
    LectureHomework.find({ "_id": newList._id }).populate('writer').exec((err, List) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).json({ success: true })
    })
  })
})

router.post('/get', (req, res) => {
  LectureHomework.find({ "lectureId": req.body.lectureId }).populate('writer').exec((err, lectureHomework) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true, lectureHomework })
  })
})

router.post('/delete', (req, res) => {
  LectureHomework.findOne({ "_id": req.body.postId }).populate('writer').remove((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

router.post('/edit', (req, res) => {
  LectureHomework.updateOne({ _id: req.body.postId }, { $set: { title: req.body.title,
  content: req.body.content, link: req.body.link}}).exec((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

module.exports = router;
