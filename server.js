const express = require('express')
const format = require('string-format')
const app = express()
const port = 8383

require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// DataFrames, Normalized Mutual Information, Sentence splitting using NLTK
// Correlation, Linear Regression, Decision Tree Classifier, Read/Write CSV files
async function askGemini(topic, context) {
    var prompt = "Create a Python code with the following requirements: The code should be less than 10 lines, It should be about " + topic + ", It should be about " + context + ", It should NOT have comments in the code, Give me a description of the code and the expected output";
    console.log(prompt)
    // Starting a full chat
    const chat = model.startChat({ history: [] })
    let result = await chat.sendMessage(prompt);
    console.log(result.response.text());

    prompt = prompt.concat("that's different from the last one");

    result = await chat.sendMessage(prompt);
    console.log(result.response.text());
}



//Allows the server to see the index.html page in the public folder
app.use(express.static('public'))
//Expects to receive json in the app.post method
app.use(express.json())

app.get('/info', (req, res) => {
    //res.status(200).send('<h1>hi<h1/>')
    res.status(200).json({info: 'preset text :)'})
})

app.get('/info2', (req, res) => {
    //res.status(200).send('<h1>hi<h1/>')
    res.status(200).json({info: 'OTHER THING'})
})

app.post('/', (req,res) => {
    const {parcel} = req.body
    console.log("PARCEL:" + parcel)
    const arr = parcel.split("|")
    console.log("PARCEL:" + arr[0])
    console.log("PARCEL:" + arr[1])
    topic = arr[0]
    context = arr[1]
    
    askGemini(topic, context)
    if (!parcel) {
        res.status(400).send({status: "failed"})
    }
    res.status(200).send({status: "received"})

})

app.listen(port, () => console.log(format("server has started on port: {}", port)))