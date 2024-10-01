// http 모듈 import하기 (불러온다고 생각하시면 되고 import 문은 항상 파일 최상단에 위치시켜주세요!)
import http from 'http';

const server = http
  .createServer((req, res) => {
    // 응답에 대한 정보가 기록되는 header를 설정
    res.writeHead(200, { 'Content-Type': ' text/html; charset=uts-8' });
    // 본문인 body를 설정
    res.write('<h1>Hello Node!</h1>');
    // 응답 종료와 더불어 body를 추가적으로 설정
    res.end('<p>Hello UMC!</p>');
  })
  .listen(8080, () => {
    console.log('서버 생성 완료');
  });
