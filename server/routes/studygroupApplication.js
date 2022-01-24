const express = require('express');
const router = express.Router();
const { StudyGroupApplication } = require("../models/StudyGroupApplication");
const { StudyGroup } = require("../models/StudyGroup");

const { auth } = require("../middleware/auth");

router.post('/getStudyGroupApplicants', (req, res) => {
  StudyGroupApplication.find({ studygroupId: req.body.studygroupId }).populate('ApplicantInfo').exec((err, application) => {
    if (err) return res.status(400).send(err)
    return res.status(200).json({ success: true, Apply: application.length, ApplicantsInfo: application  })
    })
})

router.post('/getAppliedStudyGroup', (req, res) => {
  StudyGroupApplication.find({ studygroupId: req.body.studygroupId, ApplicantInfo: req.body.ApplicantInfo }).exec((err, application) => {
    if (err) return res.status(400).send(err)
    let result = false
    if (application.length !== 0) {
      result = true
    }
    return res.status(200).json({ success: true, isApplied: result })
  })
})

router.post('/cancleApply', (req, res) => {
  StudyGroupApplication.findOneAndDelete({ studygroupId: req.body.studygroupId, ApplicantInfo: req.body.ApplicantInfo }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

router.post('/toApply', (req, res) => {
  const apply = new StudyGroupApplication(req.body)
  apply.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

module.exports = router;
