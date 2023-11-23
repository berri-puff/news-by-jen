const app = require("../app-files/app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const db = require("../db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

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
        const { topics } = response.body;
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

describe("/api", () => {
  test("GET 200: responds with available api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("Error Handling", () => {
  test("ERROR: 400 when given an invalid pathway", () => {
    return request(app)
      .get("/api/not-news-address")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET: 200 responds with the selected article when given a valid id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(3);
        expect(body.article).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("ERROR: 404 responds with an error when a non-existent id is given", () => {
    return request(app)
      .get("/api/articles/89")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("ERROR: 400 responds with an error when given an invalid id", () => {
    return request(app)
      .get("/api/articles/numbers-only")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET: 200 responds with the selected article and the total number of comments for that article by the selected id", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 9,
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          comment_counts: "2",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET: 200 responds with the selected article with comment count even if there are no comments for the selected article by id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_counts: '0',
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
});

describe(" GET /api/articles", () => {
  test("GET: 200 retrieves all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((piece) => {
          expect(piece).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(piece.hasOwnProperty("body")).toBe(false);
          expect(piece).hasOwnProperty("comment_count");
        });
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("GET: 200, responds with an array of comments in ascending order by the article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toBeSortedBy("created_at", { ascending: true });
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(5);
          expect(comment).toMatchObject({
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_id: expect.any(Number),
            body: expect.any(String),
          });
        });
      });
  });
  test("ERROR: 404, responds with an error message when given a valid but non-exist article_id", () => {
    return request(app)
      .get("/api/articles/67/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET: 200 responds when an empty array when article_id exists but no comments has been made", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("ERROR: 400 responds with error message when trying to access by an invalid endpoint", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("Post: api/articles/:article_id/comments", () => {
  test("POST: 201 adds a new comment for an article", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Contents are not worth reading",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "Contents are not worth reading",
          article_id: 7,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("ERROR: 400 responds with an error when the request body does not have all the required information", () => {
    const invalidComment = { username: "rogersop" };
    return request(app)
      .post("/api/articles/5/comments")
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("ERROR: 404 responds with an error message when comment is being added to a valid but non-existent article", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Contents are not worth reading",
    };
    return request(app)
      .post("/api/articles/46/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("ERROR: 400 responds with an error message when trying to add comment to an invalid endpoint", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Contents are not worth reading",
    };
    return request(app)
      .post("/api/articles/mouse/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH articles", () => {
  test("PATCH: 200, increases vote by article_id", () => {
    const newVote = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/10")
      .send(newVote)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 10,
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: expect.any(String),
          votes: 5,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH: 200 decreases the vote by article ID", () => {
    const newVote = { inc_votes: -4 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 96,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("ERROR: 404 responds with an error when trying to decrease the vote to non-existing article (decrease)", () => {
    const newVote = { inc_votes: -4 };
    return request(app)
      .patch("/api/articles/45")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("ERROR: 400 responds with error if patching to an invalid path", () => {
    const newVote = { inc_vote: 45 };
    return request(app)
      .patch("/api/articles/wow")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("ERROR: 400, responds with an error when vote is not a number", () => {
    const newVote = { inc_vote: "six" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("ERROR: 400, responds with an error when no information has been given", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/4")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe("Delete: Comments", () => {
  test("DELETE: 204, deletes the comment by id", () => {
    return request(app).delete("/api/comments/7").expect(204);
  });
  test("ERROR: 404 responds with an error when comment_id is non-existent", () => {
    return request(app)
      .delete("/api/comments/677")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("ERROR: 400 responds with an error with endpoint is invalid", () => {
    return request(app)
      .delete("/api/comments/snakes")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET users", () => {
  test("GET: 200, responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const { users } = response.body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
