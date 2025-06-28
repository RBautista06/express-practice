import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";

mongoose
  .connect("mongodb://localhost/express-practice")
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(`Error ${err}`));

const app = createApp();

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
