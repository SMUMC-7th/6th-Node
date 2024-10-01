import express from 'express';

// 환경변수 사용을 위해 dotenv 사용하기
import dotenv from 'dotenv';

// express를 실행해서 app에 할당하기
const app = express();
// dotenv 라이브러리를 사용하기위해 아래 config()처리를 꼭 해주세요!
dotenv.config();

// app.set은 데이터를 저장하기 위한 메서드
// app.set(key, value) 꼴로 사용됨
// port를 key로 process.env.PORT로 .env 파일에 우리가 정의한
// PORT=8080을 불러와서 value에 데이터(환경변수 값)를 저장함
// 즉 port, 8080 꼴로 데이터를 저장했다고 생각해주세요
app.set('port', process.env.PORT);

// app.get 메서드의 경우 첫번째 파라미터로 아래처럼 주소('/'의 경우에 기본 주소임)가 들어오는 경우
// 지정된 (여기선 '/') 주소로 get 요청이 올때 응답을 처리할 수 있습니다.
app.get('/', (req, res) => {
// 1주차 때 응답 처리는 res.end로 했을텐데 express에선 res.send입니다.
  res.send('Hello UMC 7th express');
});

// 이건 1주차 코드와 비슷하죠? app.get 메서드의 첫번째 파라미터로 주소가 아니라 
// 우리가 정의한 데이터가 들어온 경우 (이 경우 port)
// port라는 key에 대응하는 value인 8080을 읽어옵니다.
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '에서 대기중');
});