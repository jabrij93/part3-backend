const config = require('../utils/config')

const { test, after, beforeEach, describe } = require('node:test');

const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('node:assert');
const bcrypt = require('bcrypt');

const helper = require('./test_helper');
const User = require('../models/user');
const Note = require('../models/note');
const app = require('../app');
const api = supertest(app);

// Connect to MongoDB with increased timeout settings
// mongoose.connect(config.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   socketTimeoutMS: 60000, // 60 seconds
//   connectTimeoutMS: 30000 // 30 seconds
// });


describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    console.log('Deleting all notes...');
    await Note.deleteMany({});
    console.log('All notes deleted.');

    const noteObjects = helper.initialNotes.map(note => new Note(note));
    const promiseArray = noteObjects.map(note => note.save());
    await Promise.all(promiseArray);
    console.log('All initial notes saved.');
  }, 30000); // Increase timeout for beforeEach

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');
    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');
    const contents = response.body.map(e => e.content);
    assert(contents.includes('HTML is easy'));
  });

  describe('viewing a specific note', () => {
    test('a specific note can be viewed', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToView = notesAtStart[0];
      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      assert.deepStrictEqual(resultNote.body, noteToView);
    });

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();
      await api.get(`/api/notes/${validNonexistingId}`).expect(404);
    });

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445';
      await api.get(`/api/notes/${invalidId}`).expect(400);
    });
  });

  describe('addition of a new note', () => {
    test('a valid note can be added', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      };
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);
      const contents = notesAtEnd.map(r => r.content);
      assert(contents.includes('async/await simplifies making async calls'));
    });

    test('fails with status code 400 if data invalid', async () => {
      const newNote = { important: true };
      await api.post('/api/notes').send(newNote).expect(400);
      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
    });
  });

  describe('deletion of a note', () => {
    test('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToDelete = notesAtStart[0];
      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);
      const notesAtEnd = await helper.notesInDb();
      const contents = notesAtEnd.map(r => r.content);
      assert(!contents.includes(noteToDelete.content));
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
    });
  });

  describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      console.log('Deleting all users...');
      await User.deleteMany({});
      console.log('All users deleted.');

      const passwordHash = await bcrypt.hash('sekret', 10);
      const user = new User({ username: 'root', passwordHash });

      await user.save();
      console.log('User saved.');
    }, 30000); // Increase timeout for beforeEach

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map(u => u.username);
      assert(usernames.includes(newUser.username));
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes('expected `username` to be unique'));
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
