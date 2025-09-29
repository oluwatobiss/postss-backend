import express from "express";
import request from "supertest";
import test from "node:test";
import userRouter from "../routes/login.ts";

const app = express();
app.use("/users", userRouter);

test("POST /users with invalid data throws error", (t, done) => {
  request(app)
    .post("/users")
    .expect("Content-Type", /json/)
    .expect(400)
    .end(function (err, res) {
      if (err) throw err;
      console.log("=== Test Passed! ===");
      console.log(res.text);
      return done();
    });
});
