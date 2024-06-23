const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  try {
  const notes = await Note.find({})
  response.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
})

notesRouter.get('/:id', (request, response, next) => {
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
})

notesRouter.post('/', (request, response, next) => {
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
    response.status(201).json(savedNote)
  }).catch(error =>next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  // Delete person using MONGO DB
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(
      request.params.id, 
      note,
      { new: true, runValidators: true, context: 'query' }
    )
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
})

module.exports = notesRouter