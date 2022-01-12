const express = require('express');
const router = express.Router();
const { LectureApplication } = require("../models/LectureApplication");
const { Lecture } = require("../models/Lecture");

const { auth } = require("../middleware/auth");

router.post('/getLectureApplicants', (req, res) => {
  LectureApplication.find({ LectureId: req.body.LectureId }).populate('ApplicantInfo').exec((err, application) => {
    if (err) return res.status(400).send(err)
    return res.status(200).json({ success: true, Apply: application.length, ApplicantsInfo: application  })
    })
})

router.post('/getAppliedLecture', (req, res) => {
  LectureApplication.find({ LectureId: req.body.LectureId, ApplicantInfo: req.body.ApplicantInfo }).exec((err, application) => {
    if (err) return res.status(400).send(err)
    let result = false
    if (application.length !== 0) {
      result = true
    }
    return res.status(200).json({ success: true, isApplied: result })
  })
})

router.post('/cancleApply', (req, res) => {
  LectureApplication.findOneAndDelete({ LectureId: req.body.LectureId, ApplicantInfo: req.body.ApplicantInfo }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

router.post('/toApply', (req, res) => {
  const apply = new LectureApplication(req.body)
  apply.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

module.exports = router;
