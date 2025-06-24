import express from "express";
import usersRouter from "./routes/user.mjs";
const app = express();
//convert body to json
app.use(express.json());
app.use(usersRouter);

app.get("/", (req, res) => {
  res.send("Home").status(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
  console.log(`Running on Port ${PORT}`);
});
