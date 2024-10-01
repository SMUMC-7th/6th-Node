import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
const app = express();

dotenv.config();

app.set('port', process.env.PORT);
// 현재 폴더의 절대경로를 __dirname 변수에 저장하기 
const __dirname = import.meta.dirname;
/////////////////////////////// 여기 코드 추가함
app.use(morgan('dev'));
// 아래 미들웨어는 서버에서 정적 파일을 전달해주는 라우터 역할을 합니다.
// 라우터란 해당 경로로 (여기선 '/') 길을 열어준다고 생각해주시면 돼요
app.use('/', express.static(path.join(__dirname, 'public')));
// 아래 두 개의 미들웨어는 클라이언트의 request의 본문을 
// 서버에서 사용할 수 있는 req.body 객체로 바꿔주는 미들웨어 입니다.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/////////////////////////////// 여기 코드 추가함

app.use((req, res, next) => {
  console.log('이건 모든 요청에서 다 실행됨');
  next();
});

app.get('/', (req, res, next) => {
  res.send('Hello UMC 7th express');
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '에서 대기중');
});
