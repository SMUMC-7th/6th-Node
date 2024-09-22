import { promises as fs } from 'fs';
import path from 'path';
import http from 'http';
import url from 'url';

// people.json 경로를 상수화
const dataFilePath = path.resolve('people.json');
let products = []; // 빈 배열로 초기화

const readData = async () => {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
};

// 데이터 쓰기
const writeData = async (data) => {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
};

// 응답 전송 함수
const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// GET 요청
const server = http.createServer(async (req, res) => {
  const { url: reqUrl, method } = req; // req.url을 reqUrl로 변경

  if (method === 'GET' && reqUrl === '/people') {
    try {
      const data = await readData();
      sendResponse(res, 200, data);
    } catch (error) {
      sendResponse(res, 500, { error: error.message });
    }
  } else if (method === 'POST' && reqUrl === '/people') {
    handlePost(req, res);
  } else if (method === 'PUT' && reqUrl.startsWith('/people/')) {
    handlePUT(req, res);
  } else if (method === 'DELETE' && reqUrl.startsWith('/people/')) {
    handleDelete(req, res);
  } else {
    sendResponse(res, 404, { error: 'Not Found' });
  }
});

// POST 통제
const handlePost = async (req, res) => {
  let requestBody = '';

  req.on('data', (chunk) => {
    requestBody += chunk;
  });

  req.on('end', async () => {
    try {
      const product = JSON.parse(requestBody);
      products = await readData(); // 기존 데이터를 읽어옴
      product.id = products.length ? products[products.length - 1].id + 1 : 1; // ID 설정

      products.push(product); // 새 제품 추가
      await writeData(products); // 파일에 데이터 쓰기

      sendResponse(res, 201, product);
    } catch (error) {
      sendResponse(res, 400, { error: 'Invalid JSON' });
    }
  });
};

const handlePUT = (req, res) => {
  let requestBody = '';

  req.on('data', (chunk) => {
    requestBody += chunk;
  });

  req.on('end', async () => {
    try {
      const updatedProduct = JSON.parse(requestBody);
      const parsedUrl = url.parse(req.url, true);
      const productId = parseInt(parsedUrl.path.split('/').pop());

      console.log(`Received PUT request for product ID: ${productId}`);

      products = await readData(); // 데이터 읽기
      const productIndex = products.findIndex(p => p.id === productId);

      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct, id: productId };
        await writeData(products);
        sendResponse(res, 200, products[productIndex]);
      } else {
        sendResponse(res, 404, { error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error occurred:', error);
      sendResponse(res, 400, { error: 'Invalid JSON' });
    }
  });
};

const handleDelete = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const productId = parseInt(parsedUrl.path.split('/').pop());
  
  products = await readData(); // 데이터 읽기
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1)[0]; // 제품 삭제
    await writeData(products); // 파일에 데이터 쓰기
    sendResponse(res, 200, deletedProduct); // 삭제된 제품 응답
  } else {
    sendResponse(res, 404, { error: 'Product not found' });
  }
};

// 서버를 8080 포트에서 실행
const PORT = 8080; // 포트 설정
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
