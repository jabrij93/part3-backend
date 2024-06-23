const { test, after, beforeEach } = require('node:test')
const Note = require('../models/note')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const api = supertest(app)

// const initialNotes = [
//     {
//       content: 'HTML is easy',
//       important: false,
//     },
//     {
//       content: 'Browser can execute only JavaScript',
//       important: true,
//     },
// ]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()
  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length, helper.initialNotes.length)
})
  
test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
  
    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  assert.strictEqual(response.body.length, helper.initialNotes.length + 1)

  assert(contents.includes('async/await simplifies making async calls'))
})

test.only('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, helper.initialNotes.length)
})

after(async () => {
  await mongoose.connection.close()
})