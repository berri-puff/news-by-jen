const app = require("../app-files/app");
const seed = require("../db/seeds/seed");
const request = require('supertest')
const db = require("../db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const endpoints = require('../endpoints.json')



beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});
afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET: 200 responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const {topics} = response.body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe('/api', ()=>{
  test('GET 200: responds with available api endpoints', ()=>{
    return request(app)
    .get('/api')
    .expect(200)
    .then(({body})=>{
      expect(body.endpoints).toEqual(endpoints)
    })
  })
})

describe('Error Handling', ()=>{
    test('ERROR: 400 when given an invalid pathway', ()=>{
        return request(app)
        .get('/api/not-news-address')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('bad request')
        })
      })
})

describe('/api/articles/:article_id', ()=>{
  test('GET: 200 responds with the selected article when given a valid id', ()=>{
    return request(app)
    .get('/api/articles/3')
    .expect(200)
    .then(({body})=>{
      expect(body.article.article_id).toBe(3)
      expect(body.article).toMatchObject({
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
    })
  })
  test('ERROR: 404 responds with an error when a non-existent id is given', ()=>{
    return request(app)
    .get('/api/articles/89')
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('no article with this ID')
    })
  })
  test('ERROR: 400 responds with an error when given an invalid id', ()=>{
    return request(app)
    .get('/api/articles/numbers-only')
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
})
