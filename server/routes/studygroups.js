const express = require('express');
const router = express.Router();
const { StudyGroup } = require("../models/StudyGroup");

const { auth } = require("../middleware/auth");
const multer = require('multer');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(res.status(400).end('only jpg, jpeg, png files can be uploaded'), false)
    }
    cb(null, true)
  }
});

const upload = multer({ storage: storage }).single("file");
//=================================
//             Lecture
//=================================

router.post('/uploadThumnail', (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err })
    }
    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
  })
})

router.post('/uploadStudyGroup', (req, res) => {
  const studyGroup = new StudyGroup(req.body);
  studyGroup.save((err) => {
    if (err) return res.status(400).send(err)
    return res.status(200).json({ success: true })
  })
})

router.get('/getStudyGroups', (req, res) => {
  StudyGroup.find().populate('manager').exec((err, groups) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true, groups })
  })
})

router.post('/getStudyGroupDetail', (req, res) => {
  StudyGroup.findOne({ "_id": req.body.studygroupId }).populate('manager').exec((err, studygroupDetail) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true, studygroupDetail })
  })
})

router.post('/deleteStudyGroup', (req, res) => {
  StudyGroup.findOne({ "_id": req.body.studygroupId }).populate('manager').remove((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

router.post('/editStudyGroup', (req, res) => {
  const studyGroup = new StudyGroup(req.body);
  studyGroup.save((err) => {
    if (err) return res.status(400).send(err)
  })

  StudyGroup.findOne({ "_id": req.body._id }).populate('manager').remove((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

router.post('/updateApplicationStatus', (req, res) => {
  StudyGroup.updateOne({ _id: req.body.studygroupId }, { $set: { applicationPeriod: req.body.Boolean }}).exec((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

module.exports = router;
