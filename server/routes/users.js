const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { isValidToken } = require("../middleware/isValidToken");

//=================================
//             User
//=================================

/* 회원 정보 넘겨주기... 전에 isValidToken으로 유효성 검사 거치기 */
router.get("/auth", isValidToken, auth, (req, res) => {
  return res.status(200).json({
    _id: req.user._id,
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image,
    isAdmin: req.user.role === 2 ? true : false,
    isAuth: req.user.role === 1 || req.user.role === 2 ? true : false,
  });
});

/* 회원가입 처리 */
router.post("/register", (req, res) => {
  const user = new User(req.body); // 나중에 수정 (auth를 주입하지 못하도록.)
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

/* 로그인 처리 */
router.post("/login", (req, res) => {
  User.findOne({ id: req.body.id }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Auth failed, id not found",
      });
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.json({ loginSuccess: false, message: "Wrong password" });
        } else {
          user.generateToken((err, user) => {
            if (err) return res.json({ loginSuccess: false, err });
            res
              .cookie("accessToken", user.accessToken, { httpOnly: true })
              .cookie("refreshToken", user.refreshToken, { httpOnly: true })
              .status(200)
              .json({ loginSuccess: true, userId: user._id });
          });
        }
      });
    }
  });
});

/* 로그아웃 처리 */
router.get("/logout", (req, res) => {
  User.findOneAndUpdate(
    { token: req.cookies.refreshToken },
    {
      token: "",
    },
    (err, user) => {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      if (err) return res.json({ success: false, err });
      else return res.status(200).send({ success: true });
    }
  );
});

module.exports = router;
