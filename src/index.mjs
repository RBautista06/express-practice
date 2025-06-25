import express from "express";
import router from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/mockData.mjs";

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
  })
);
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
  console.log(req.session.id);
  req.session.visited = true; //this will save the session id
  res.cookie("hello", "world", { maxAge: 60000 * 60, signed: true });
  res.send("Home").status(200);
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return res.status(401).send("Bad Credentials");
  req.session.user = findUser;
  return res.status(200).send(findUser);
});
app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send("Not Authenticated");
});
