const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require("fs");
const csv = require('csv-parser')


const rootPath = "/hirva_PV_dir";
const portNum = 6001;

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(portNum, ()=>{
    console.log(`Server of c2 started on the localhost port ${portNum}`);
});

let stream;

app.post("/process", (request, response)=>{
    let reqData = request.body;
    let [fileName, productName] = [reqData.file, reqData.product];
    console.log("received file and product as", fileName, productName);
    
    response.setHeader('content-type', 'application/json');
    // object to store product entity
    const collection = {};

    stream = fs.createReadStream(`${rootPath}/${fileName}`)
    .pipe(csv({headers:['product', 'amount'], strict: true}));

    let error = false;
    let rowNum = 0;

    stream
    .on('error', (err) => {
        console.log("error occurred while parsing given file",err);
        error = true;
        response.send({
            file: fileName,
            error: "Input file not in CSV format."
        });
        stream.destroy();
    })
    .on('data', row => {
        if(rowNum != 0){
            if(isNaN(Number(row.amount))){
                error = true;
            }
            else {
                collection[row.product] = (collection[row.product] || 0)+ Number(row.amount);
            }
        }
        rowNum++;
    })
    .on('end', () => {
        // watching amount after calculating
        console.log(`Amount is ${collection[productName]}`);
        stream.destroy();
        if(!error){
            response.send({
                file: fileName,
                sum: collection[productName] || 0
            });
        }
        else {
            response.send({
                file: fileName,
                error: "Input file not in CSV format."
            });
        }
    });
});

