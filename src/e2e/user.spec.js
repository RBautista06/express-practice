import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

// const app = createApp();
describe("create user long in", () => {
  let app;

  ///async to wdait fot the database to connect before running the test
  beforeAll(async () => {
    await mongoose
      .connect("mongodb://localhost/express_test")
      .then(() => console.log("connected to database"))
      .catch((err) => console.log(`Error ${err}`));

    app = createApp();
  });
  it("it should create the user", async () => {
    const response = await request(app).post("/api/users").send({
      username: "railley123",
      password: "password",
      displayName: "player_01",
    });
    expect(response.statusCode).toBe(201);
  });
  it("should log the user in and visit /api/auth/status and return the user", async () => {
    const response = await request(app)
      .post("/api/auth")
      .send({
        username: "railley123",
        password: "password",
      })
      .then((res) => {
        return request(app)
          .get("/api/auth/status")
          .set("Cookie", res.headers["set-cookie"]); // this is to pass the cookie to api auth status
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("railley123");
    expect(response.body.displayName).toBe("player_01");
    // expect(response.headers["set-cookie"]).toBeDefined();
  });
  // it("should visit /api/auth/status and return the authenticated user", async () => {
  //   const response = await request(app).get("/api/auth/status");
  //   expect(response.statusCode).toBe(200);
  // });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
