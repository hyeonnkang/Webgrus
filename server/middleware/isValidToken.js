/* 토큰 유효성 검사 */
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../config/tokenkey");

const isValidToken = (req, res, next) => {
  // accessToken 자체가 없는 경우 - ( 비정상적인 접근 )
  if (!req.cookies.accessToken)
    return res.json({
      success: false,
      message: "권한이 없습니다.",
      isAuth: false,
    });
  try {
    const accessToken = jwt.verify(req.cookies.accessToken, SECRET_KEY);
    const refreshToken = jwt.verify(req.cookies.refreshToken, SECRET_KEY);

    if (!accessToken) {
      if (!refreshToken) {
        // (1) access: X, refresh: X - ( 비정상적인 접근 )
        return res.json({
          success: false,
          message: "권한이 없습니다.",
          isAuth: false,
        });
      } else {
        // (2) access: X, refresh: O - ( access 토큰의 유효기간 만료, 재발급 )
        User.findByToken(req.cookies.refreshToken, (err, user) => {
          if (err) return res.json({ success: false, err, isAuth: false });
          const newAccessToken = jwt.sign({ _id: user._id }, SECRET_KEY, {
            expiresIn: "1h",
          });
          res.cookie("accessToken", newAccessToken, { httpOnly: true });
          req.cookies.accessToken = newAccessToken;
          next();
        });
      }
    } else {
      if (!refreshToken) {
        // (3) access: O, refresh: X - ( refresh 토큰의 유효기간 만료, 재발급 )
        const newRefreshToken = jwt.sign({}, SECRET_KEY, {
          expiresIn: "14d",
        });
        User.findByToken(req.cookies.refreshToken, (err, user) => {
          if (err) return res.json({ success: false, err, isAuth: false });
          User.findOneAndUpdate(
            { id: user.id },
            { token: newRefreshToken },
            (err, user) => {
              res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
              req.cookies.refreshToken = newRefreshToken;
              next();
            }
          );
        });
      } else {
        // (4) access: O, refresh: O - ( access, refresh 두 토큰 모두 유효함, 통과 )
        next();
      }
    }
  } catch (err) {
    return res.json({ success: false, err, isAuth: false });
  }
};

module.exports = { isValidToken };
