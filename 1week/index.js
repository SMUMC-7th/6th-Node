import { promises as fs } from "fs";
import path from "path";
import http from "http";
import url from "url";

// people.json 경로를 상수화 d
const dataFilePath = path.resolve("data/people.json");

// 데이터 읽기 함수
const readData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Failed to read data");
  }
};

// 데이터 쓰기 함수
const writeData = async data => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Failed to write data");
  }
};

// 응답 전송 함수
const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

// POST 요청 처리 함수
const handlePost = async (req, res) => {
  let requestBody = "";
  req.on("data", chunk => (requestBody += chunk));
  req.on("end", async () => {
    try {
      const newPerson = JSON.parse(requestBody);
      const people = await readData();
      newPerson.id = people.length ? people[people.length - 1].id + 1 : 1;
      people.push(newPerson);
      await writeData(people);
      sendResponse(res, 201, newPerson);
    } catch {
      sendResponse(res, 400, { error: "Invalid JSON" });
    }
  });
};

// PUT 요청 처리 함수
const handlePut = async (req, res) => {
  let requestBody = "";
  req.on("data", chunk => (requestBody += chunk));
  req.on("end", async () => {
    try {
      const updatedPerson = JSON.parse(requestBody);
      const parsedUrl = url.parse(req.url, true);
      const personId = parseInt(parsedUrl.path.split("/").pop(), 10);
      const people = await readData();
      const personIndex = people.findIndex(p => p.id === personId);

      if (personIndex !== -1) {
        people[personIndex] = {
          ...people[personIndex],
          ...updatedPerson,
          id: personId,
        };
        await writeData(people);
        sendResponse(res, 200, people[personIndex]);
      } else {
        sendResponse(res, 404, { error: "Person not found" });
      }
    } catch {
      sendResponse(res, 400, { error: "Invalid JSON" });
    }
  });
};

// DELETE 요청 처리 함수
const handleDelete = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const personId = parseInt(parsedUrl.path.split("/").pop(), 10);
  const people = await readData();
  const personIndex = people.findIndex(p => p.id === personId);

  if (personIndex !== -1) {
    const [deletedPerson] = people.splice(personIndex, 1);
    await writeData(people);
    sendResponse(res, 200, deletedPerson);
  } else {
    sendResponse(res, 404, { error: "Person not found" });
  }
};

// 기본 응답 처리 함수
const handleNotFound = res => {
  sendResponse(res, 404, { error: "Not Found" });
};

// 서버 생성 및 요청 라우팅
const server = http.createServer(async (req, res) => {
  const { url: reqUrl, method } = req;

  if (method === "GET" && reqUrl === "/people") {
    try {
      const people = await readData();
      sendResponse(res, 200, people);
    } catch (error) {
      sendResponse(res, 500, { error: error.message });
    }
  } else if (method === "POST" && reqUrl === "/people") {
    handlePost(req, res);
  } else if (method === "PUT" && reqUrl.startsWith("/people/")) {
    handlePut(req, res);
  } else if (method === "DELETE" && reqUrl.startsWith("/people/")) {
    handleDelete(req, res);
  } else {
    handleNotFound(res);
  }
});

// 서버 시작
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
