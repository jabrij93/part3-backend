const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  // Find notes by ID using MongoDB
  const id = request.params.id;

  // Check if the ID is a valid MongoDB ObjectId
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return response.status(400).json({ error: 'Invalid ID format' });
  // }

  // Find notes by ID using MongoDB
    const note = await Note.findById(id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
})

notesRouter.post('/', async (request, response, next) => {
  // Add new note using MongoDB 
  const body = request.body
  console.log("INSPECT body", body)

  
  const user = await User.findById(body.userId)
  console.log("INSPECT user", user)
  
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // Add new note when using MongoDB 
  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  // Delete person using MONGO DB
    await Note.findByIdAndDelete(request.params.id)
      response.status(204).end()
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