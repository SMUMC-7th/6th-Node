import fs from 'fs/promises';

function readFilePromise(filePath){
    return fs.readFile(filePath,'utf8');
}

function writeFilePromise(filePath, data){
    return fs.writeFile(filePath, data, 'utf8');
}

async function processFiles(){
    try{
        const data = await readFilePromise('test.txt');
        console.log('파일 내용 : ', data);

        const modifiedData = data + '\n새로운 내용 추가';
        await writeFilePromise('modifiedTest.txt', modifiedData);
        console.log('수정된 파일이 성공적으로 저장되었습니다.');

        const newData = await readFilePromise('modifiedTest.txt');
        console.log('수정된 파일 내용 : ', newData);
    } catch (err){
        console.error('오류 발생: ',err);
    }
}

processFiles();