const express = require('express')
const app = express()
const Note = require('./models/note')
const mongoose = require('mongoose')
const cors = require('cors')

// MONGO DB
// MONGO DB
// MONGO DB

// MONGO DB
// MONGO DB
// MONGO DB



app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   },
//   {
//     id: 4,
//     content: "TEST CONTENT",
//     important: true
//   }
// ]

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  }).catch(error => {
    console.error('Error fetching notes:', error.message);
    response.status(500).json({ error: 'Failed to fetch notes' });
  });
});
  // const notes2 = notes.map(note => note.content)
  // response.json(notes)


app.get('/api/notes/:id', (request, response) => {
  // Find notes by ID using MongoDB
  const id = request.params.id;

  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID format' });
  }

  // Find notes by ID using MongoDB
  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).json({ error: 'The following resource is not found' });
      }
    })
    .catch(error => {
      // Handle any other errors
      response.status(500).json({ error: 'Internal server error' });
    });

  // Find notes by ID before MongoDB
  // const id = Number(request.params.id);
  // const note = notes.find(note => {
  //   console.log(note.id, typeof note.id, id, typeof id, note.id === id)
  //   return note.id === id
  // })
 
  // if (note) {
  //   response.json(note)
  // } else {
  //   response.statusMessage = "The following resources is not found"
  //   response.status(404).end()
  // }
})

const generateId = () => {
  const maxId = notes.length > 0 ? 
    Math.max(...notes.map(note=>note.id)) : 0
  return maxId + 1;
}

app.post('/api/notes', (request, response) => {
  const body = request.body
  
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // Add new note when using MongoDB 
  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false
  })

  note.save().then(savedNote=> {
    response.json(savedNote)
  })

  // Add new note before MongoDB 
  // const note = {
  //   content: body.content,
  //   important: Boolean(body.important) || false,
  //   id : generateId(),
  // }

  // notes = notes.concat(note)
  // response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)

  // notes = notes.filter(note => note.id !== id)
  notes = notes.find(note => note.id === id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})