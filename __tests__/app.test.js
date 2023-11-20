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
