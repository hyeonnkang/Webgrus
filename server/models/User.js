const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../config/tokenkey");

/* 유저 스키마 */
const userSchema = mongoose.Schema({
  id: {
    type: String,
    maxlength: 50,
    unique: 1,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 6,
  },
  role: {
    type: Number,
    default: 0, // 0 : 승인 대기, 1 : 부원, 2 : 임원
  },
  token: {
    type: String,
  },
  image: {
    type: String,
  },
});

/* 비밀번호 암호화 */
userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/* 비밀번호 비교 */
userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/* 토큰 생성 */
userSchema.methods.generateToken = function (cb) {
  const user = this;

  const refreshToken = jwt.sign({}, SECRET_KEY, { expiresIn: "14d" });
  const accessToken = jwt.sign({ _id: user._id }, SECRET_KEY, {
    expiresIn: "1h",
  });

  User.findOneAndUpdate(
    { id: user.id },
    { token: refreshToken },
    (err, user) => {
      if (err) return res.json({ success: false, err });
    }
  );

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;

  user.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};

/* refresh 토큰으로 찾기 */
userSchema.statics.findByToken = function (Token, cb) {
  const user = this;

  jwt.verify(Token, SECRET_KEY, (err, decoded) => {
    user.findOne({ token: Token }, (err, user) => {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
