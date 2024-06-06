const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())
app.use(express.json())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/api/notes', (request, response) => {
  // const notes2 = notes.map(note => note.content)
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
 
  if (note) {
    response.json(note)
  } else {
    response.statusMessage = "The following resources is not found"
    response.status(404).end()
  }
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

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id : generateId(),
  }

  notes = notes.concat(note)
  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)

  // notes = notes.filter(note => note.id !== id)
  notes = notes.find(note => note.id === id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})