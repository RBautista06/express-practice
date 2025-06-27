// client ID: 1388202977600213012
// client secret: 0qqATUu3MC7SqGLTW0Iko8uifVPGHBRO

import express from "express";
import router from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

// import "./strategies/local-strategy.mjs";

const app = express();

mongoose
  .connect("mongodb://localhost/express-practice")
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(`Error ${err}`));

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
  console.log(`Inside Auth Status`);
  console.log(req.user);
  console.log(req.session);
  console.log(req.sessionID);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    return res.sendStatus(200);
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
  console.log(`Running on Port ${PORT}`);
});

// app.post("/api/auth", (req, res) => {
//   const {
//     body: { username, password },
//   } = req;
//   const findUser = mockUsers.find((user) => user.username === username);
//   if (!findUser || findUser.password !== password)
//     return res.status(401).send("Bad Credentials");
//   req.session.user = findUser;
//   console.log(req.session.id);
//   return res.status(200).send(findUser);
// });
// app.get("/api/auth/status", (req, res) => {
//   req.sessionStore.get(req.sessionID, (err, session) => {
//     console.log(session);
//   });
//   console.log(req.session.id);
//   return req.session.user
//     ? res.status(200).send(req.session.user)
//     : res.status(401).send("Not Authenticated");
// });

// app.post("/api/cart", (req, res) => {
//   if (!req.session.user) return res.sendStatus(401);
//   const { body: item } = req;
//   const { cart } = req.session;
//   if (cart) {
//     cart.push(item);
//   } else {
//     req.session.cart = [item];
//   }
//   return res.status(201).send(item);
// });

// app.get("/api/cart", (req, res) => {
//   if (!req.session.user) return res.sendStatus(401);
//   return res.send(req.session.cart ?? []);
// });
