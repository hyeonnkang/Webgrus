/* 어드민 권한 확인 (auth : 2) */
const { User } = require("../models/User");

const isAdmin = (req, res, next) => {
  User.findByToken(req.cookies.refreshToken, (err, user) => {
    if (err) {
      return res.json({ success: false, err });
    }
    if (!user || user.auth !== 2) {
      return res.json({ success: false, reason: "권한이 없습니다." });
    } else {
      next();
    }
  });
};

module.exports = { isAdmin };
