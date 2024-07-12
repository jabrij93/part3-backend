const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  .populate('user', {username: 1, name: 1})
  
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

// Get Token
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response, next) => {
  // Add new note using MongoDB 
  const body = request.body
  
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // Add new note when using MongoDB 
  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user._id
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