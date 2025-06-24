import express from "express";

const app = express();
//convert body to json
app.use(express.json());

const mockUsers = [
  {
    id: 1,
    username: "Railley",
    displayName: "Zenith",
  },
  {
    id: 2,
    username: "Nickolei",
    displayName: "Stapidi",
  },
  {
    id: 3,
    username: "Vince",
    displayName: "Stakes",
  },
  {
    id: 4,
    username: "Princess",
    displayName: "Dragon",
  },
];

const resolveUserUserById = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex; ///this asiggns the findUserIndex to a request body
  next();
};

app.get("/", (req, res) => {
  res.send("Home").status(200);
});

app.get("/api/users", (req, res) => {
  // destrucutre query parameters
  const {
    query: { filter, value },
  } = req;
  // if filter and value is undefined
  if (filter && value) {
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  }
  return res.send(mockUsers);
});

////INSERT
app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = {
    id: mockUsers[mockUsers.length - 1].id + 1,
    ...body,
  };
  mockUsers.push(newUser);
  return res.sendStatus(201).send(newUser);
});
///UPDATE BUT IN BATCH
app.put("/api/users/:id", resolveUserUserById, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = {
    id: mockUsers[findUserIndex].id,
    ...body,
  };
  return res.send(mockUsers[findUserIndex]).status(200);
});
// UPDATE THE OBJECT BUT IN ONLY SPECIFIC OBJECT KEYS
app.patch("/api/users/:id", resolveUserUserById, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.send(mockUsers[findUserIndex]).status(200);
});
///DELETE REQUEST
app.delete("/api/users/:id", resolveUserUserById, (req, res) => {
  const { findUserIndex } = req;
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers.splice(findUserIndex, 1);
  return res.send(200);
});
// fetch the data using params
app.get("/api/users/:id", resolveUserUserById, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
  console.log(`Running on Port ${PORT}`);
});
