import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import path from 'path';
// 필요한 파일 import

// app에 express 실행
const app = express();
// 라이브러리를 사용하기 위해서는 config() 처리
dotenv.config();

// app.set은 데이터를 저장하기 위한 메서드
// app.set(key, value) 꼴로 사용
// PORT를 key로 불러와서 value에 데이터(환경변수 값)을 저장
app.set('port', process.env.PORT);

// 현재 폴더의 정대경로를 __dirname 변수에 저장하기
const __dirname = import.meta.dirname;
/************** 여기 코드 추가 **************/


app.use(morgan('dev'));
/** 아래 미들웨어는 서버에서 정적 파일을 전달해주는 라우터 역할 */
app.use('/', express.static(path.join(__dirname, 'public')));

/** 아래 두 개의 미들웨어는 클라이언트의 request의 본문을
 *  서버에서 사용할 수 있는 req.body 객체로 바꿔주는 미들웨어 */
app.use(express.json());
app.use(express.urlencoded({extended : false}));

/************** 여기 코드 추가 **************/

app.use((req, res, next) => {
    console.log('다 실행스');
    next();
});

app.get('/', (req, res, next) => {
    res.send('Hello world');
    next();
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

// app.get 매서드의 첫번째 파라미터로 주소가 아니라
// 우리가 정의한 데이터가 들어온 경우 (port 8080)
// port라는 key에 대응하는 value인 8080을 읽어옴
app.listen(app.get('port'), () =>{
    console.log(app.get('port'), '에서 대기중');
});