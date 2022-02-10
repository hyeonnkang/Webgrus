const express = require('express');
const app = express();
const api = require('./routes/api');
const bodyParser = require('body-parser');
const db = require('./config/db');
const cors = require('cors');
const port = 3001; // 포트 넘버

app.use(cors());
const cookieParser = require('cookie-parser');
app.use(express.json());

// 보안 라이브러리 helmet
const helmet = require('helmet');
app.use(helmet());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.frameguard('deny'));

app.disable('x-powered-by'); // expres가 사용되었다는 사실을 숨긴다

// db 연결
db.connect();

app.use('/posters', express.static('client/public/posters'));
app.use('/data', express.static('client/public/data')); // 정적인 파일들을 업로드 하기위해 필요함
app.use('/uploads', express.static('client/public/uploads'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', api);

// 포트 설정
app.listen(port, () => console.log(port));
