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


app.get('/api/notes/:id', (request, response, next) => {
  // Find notes by ID using MongoDB
  const id = request.params.id;

  // Check if the ID is a valid MongoDB ObjectId
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return response.status(400).json({ error: 'Invalid ID format' });
  // }

  // Find notes by ID using MongoDB
  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error));

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
  // Add new note using MongoDB 
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

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  // Delete person using MONGO DB
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

   // Delete person before MONGO DB
   // const id = Number(request.params.id)
   // notes = notes.filter(note => note.id !== id)
   // notes = notes.find(note => note.id === id)
   // response.status(204).end()
})

// Error handler middleware
// Error handler middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
// Error handler middleware
// Error handler middleware

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})