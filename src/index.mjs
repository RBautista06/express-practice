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
app.put("/api/users/:id", (req,res)=>{
  
})
app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.status(400).send("Bad Request. Invalid ID");
  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
  console.log(`Running on Port ${PORT}`);
});
