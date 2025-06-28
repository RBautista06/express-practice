import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

let app;

///async to wdait fot the database to connect before running the test
beforeAll(async () => {
  await mongoose
    .connect("mongodb://localhost/express_test")
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(`Error ${err}`));

  app = createApp();
});
// const app = createApp();
describe("/api/auth/status", () => {
  it("should return 401 when not log in", async () => {
    const response = await request(app).get("/api/auth/status"); // calll the super test
    expect(response.statusCode).toBe(401);
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
