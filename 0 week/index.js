const express = require("express"); // express 모듈을 가져옴 Node.js에서 웹 애플리케이션 프레임워크

const app = express(); // express 객체 생성
// HTTP 요청 및 응답을 처리하는데 사용

const port = 3000; // 포트를  3000으로 설정

// HTTP GET 요청을 처리하는 라우터
// 첫 번째 인자로 URL 경로 "/"를 받고, 두번째 인자로 요청 처리 콜백 함수를 받음
// 골백 함수는 req(요청 객체)와 res(응답 객체)를 인자로 받음
app.get("/", (req, res) => {
    res.send("Hello world"); // 응답을 보냄
});
// 라우터 콜백 함수 종료


// app.listen은 서버를 시작하는 매서드
// 지정한 포트에서 수신을 대기함
// 첫번째 인자로 포트 번호를 받고, 두 번째 인자로 서버가 시작된 후 실행할 콜백 함수를 받음
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
