import router from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import express from "express";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";
// import "./strategies/discord-strategy.mjs";

export function createApp() {
  const app = express();
  //convert body to json
  app.use(express.json());
  app.use(cookieParser("helloWorld"));
  app.use(
    session({
      secret: "railley the dev", // This is the secret key used to sign the session ID cookie, making it tamper-proof
      saveUninitialized: false, // If false, session won’t be saved to the store unless something is added/changed
      resave: false, // If false, session won’t be saved again to the store if it wasn’t modified
      cookie: {
        maxAge: 60000 * 60, // Sets how long the cookie (session) lasts in the browser — here it's 1 hour (60000 ms * 60)
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  );
  app.use(passport.initialize()); // 🔐 This sets up Passport — it gets ready to handle login/authentication.
  app.use(passport.session()); // 🧠 This tells Passport to use sessions — so users stay logged in across pages.

  app.use(router);

  app.get("/", (req, res) => {
    console.log(req.session.id);
    req.session.visited = true; //this will save the session id
    res.cookie("hello", "world", { maxAge: 60000 * 60, signed: true });
    res.send("Home").status(200);
  });

  app.post("/api/auth", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
  });

  app.get("/api/auth/status", (req, res) => {
    // console.log(`Inside Auth Status`);
    // console.log(req.user);
    // console.log(req.session);
    // console.log(req.sessionID);
    return req.user ? res.send(req.user) : res.sendStatus(401);
  });

  app.post("/api/auth/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logout((err) => {
      if (err) return res.sendStatus(400);
      return res.sendStatus(200);
    });
  });

  app.get("/api/auth/discord", passport.authenticate("discord"));
  app.get(
    "/api/auth/redirect/discord",
    passport.authenticate("discord"),
    (req, res) => {
      console.log(req.session);
      console.log(req.user);
      res.sendStatus(200);
    }
  );
  return app;
}
