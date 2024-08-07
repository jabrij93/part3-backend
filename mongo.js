const mongoose = require('mongoose')

const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config();

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://jabrijuhinin93:54264316426153jJ%40@cluster0.5brgeat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'TEST with false',
  important: false,
})


note.save().then(result => {
  console.log('note3 test saved!')
  mongoose.connection.close()
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert.strictEqual(contents.includes('HTML is easy'), true)
})

// Note.find({important: true}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })