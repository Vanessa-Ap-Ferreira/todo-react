require("dotenv-safe").config();
const express = require('express')
const cors = require('cors')
//const bodyParser = require('body-parser')


const router = require('./src/routes/routes')

const jwt = require('jsonwebtoken');

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

//const bodyParser = require('body-parser');
//router.use(bodyParser.json());

app.listen(4000,()=>{
    console.log("Aplicação rodando na porta 4000")
})

app.get('/', (request,response)=>{
    response.send("Hello world")
})