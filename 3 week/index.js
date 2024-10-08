import express from 'express'
import cors from 'cors'
import url from 'url'
import http from 'http'
import path from 'path'

const app = express()
const port = 8080
const personalinfo = path.resolve('info.json')

const readData = async () => {
    const data = await fs.readFile(personalinfo, 'utf-8');
    return JSON.parse(data);
}

const writeData = async (data) => {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
};
  

app.use(cors());


app.get('/', (req,res) => {
    res.send('hello there')
}); 

/** 로그인 창 */
app.get('/users/login', (req, res) => { 
    res.send('Try to login')
});

/** 회원가입 */
app.get('/users', async(req, res) => { 
    const {name, birth, sex} = req.query; // 쿼리에서 사용자 정보 받기

    if(!name || !birth || !sex) {
        return res.status(400).send("name, birth, sex is required");
    }

    try {
        const data = await readData();
        const newUser ={name, birth, sex};

        data.push(newUser);
        await writeData(data);

        res.status(201).send(`User ${name} has been registered`);
    } catch (error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

/** 홈 화면 */
app.get('/home', (req, res) => { 
    res.send('home interface')
});

app.get('/home/my-mission', (req, res) => { 
    res.send('home interface')
});


/** 미션 창 */
app.get('/mission', (req, res) => {
    res.send('point that i got')
});

app.get('/mission/review', (req, res) => {
    res.send('write down review')
});

/** map */
app.get('/map-info', (req, res) => {
    res.send('map infomation')
});

app.get('/map-info/restaurant-list', (req, res) => {
    res.send('restaurant info')
});

app.get('/map-info/restaurant-list/restaurant-info', (req, res) => {
    res.send('restaurant info')
});

/** 마이페이지 */
app.get('/my-page', (req, res) => {
    res.send("my point, help, logout, excution")
});

app.get('/my-page/alter-info', (req, res) => {
    res.send("change infomation")
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});