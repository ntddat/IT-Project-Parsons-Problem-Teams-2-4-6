import askGemini  from "../service/askGemini.js";

async function generateQuestion (req, res) {
  console.log("POST request received"); 
  const { topic, context } = req.body; // Destructure the topic and context from req.body

  console.log("Received topic:", topic);
  console.log("Received context:", context);
  
  await askGemini(topic, context)

  if (!topic && !context) {
      res.status(400).send({status: "failed"})
  }
  res.status(200).send({status: "received"})
}

export default generateQuestion;