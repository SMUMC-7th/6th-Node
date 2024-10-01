import { promises as fs } from 'fs';
import path from 'path';
import http from 'http';

const dataFilePath = path.resolve('product.json');

const readData = async () => {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeData = async (data) => {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
};

const server = http.createServer(async (req, res) => {
  const { url, method } = req;
  if (method === 'GET' && url === '/product') {
    try {
      const data = await readData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if(req.method === 'POST' && parsedUrl.path === '/product'){
    handlePostRequest(req, res);
  } else if(req.method === 'PUT' && parsedUrl.path.startsWith('/product/')){
    handlePutRequest(req, res, parsedUrl);
  } else if(req.method === 'DELETE' && parsedUrl.path.startsWith('/product/')){
    handleDeleteRequest(req, res, parsedUrl);
  } else {
    sendResponse(res, 404, CONTENT_TYPE_JSON, {error : 'Method not allowed'});
  }
});

const sendResponse = (res, statusCode, contentType, data) => {
  res.writeHead(statusCode, contentType);
  res.end(JSON.stringify(data));
};

const handlePostRequest = (req,res) => {
  let requestBody = '';

  req.on('data', (chunk) => {
    requestBody += chunk;
  });

  req.on('end', () => {
    const product = JSON.parse(requstBody);
    product.id = product.length + 1;
    products.push(product);

    sendResponse(res, 201, CONTENT_TYPE_JSON, product);
  });
};

const handlePutRequest = (req, res, parsedUrl) => {
  req.on('data', (chunk) => {
    requestBody += chunk;
  });

  req.on('end', () => {
    const updatedProduct = JSON.parse(requestBody);
    const productId = parseInt(parsedUrl.path.split('/').pop());
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedProduct, id: productId };
      sendResponse(res, 200, CONTENT_TYPE_JSON, products[productIndex]);
    } else {
      sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'Product not found' });
    }
  });
}

const handleDeleteRequest = (req, res, parsedUrl) => {
  const productId = parseInt(parsedUrl.path.split('/').pop());
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1)[0];
    sendResponse(res, 200, CONTENT_TYPE_JSON, deletedProduct);
  } else {
    sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'Product not found' });
  }
};

server.listen(3000, () => {
  console.log('서버 실행중');
});

