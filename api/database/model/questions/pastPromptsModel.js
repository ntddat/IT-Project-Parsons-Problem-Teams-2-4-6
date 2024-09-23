const pastPromptsSchema = {
  prompt: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  context: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
}
export default pastPromptsSchema;