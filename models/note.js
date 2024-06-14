const dotenv = require('dotenv')
const mongoose = require('mongoose')

// Load environment variables from .env file
dotenv.config();

mongoose.set('strictQuery',false)

const password = process.argv[2]

// Replace placeholder with the actual password
const url = process.env.MONGODB_URI.replace('<password>', password);

console.log(`Connect to`, url)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server only after the connection is established
  }).catch(error => {
    console.log("error connecting to MongoDB", error.message)
  })

const noteSchema = new mongoose.Schema({
  content: { 
    type: String, 
    minLength: 5, 
    required: true 
  },
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)