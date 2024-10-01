import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.set('port', process.env.PORT);

app.get('/', (req, res) => {
  res.send('Hello UMC 7th express');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '에서 대기중');
});
