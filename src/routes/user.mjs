import { Router } from "express";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  checkUserValidationSchema,
  patchUserSchema,
} from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/mockData.mjs";
import { resolveUserUserById } from "../utils/middleware.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { createUserHandler, getUserIdHandler } from "../handlers/user.mjs";

const router = Router();

//FETCH
router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("must not Empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("must be 3 to 10 characters"),
  async (req, res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });
    // destrucutre query parameters
    const {
      query: { filter, value },
    } = req;
    try {
      const users = await User.find({});
      if (filter && value) {
        return res.send(users.filter((user) => user[filter].includes(value)));
      }
      return res.send(users);
    } catch (err) {
      console.log(err);
    }
    // if filter and value is undefined
  }
);
////INSERT
router.post(
  "/api/users",
  checkSchema(checkUserValidationSchema),
  createUserHandler
);
///UPDATE BUT IN BATCH
router.put(
  "/api/users/:id",
  checkSchema(checkUserValidationSchema),
  resolveUserUserById,
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const data = matchedData(req);
    const { findUserIndex } = req;
    mockUsers[findUserIndex] = {
      id: mockUsers[findUserIndex].id,
      ...data,
    };
    return res.send(mockUsers[findUserIndex]).status(200);
  }
);
// UPDATE THE OBJECT BUT IN ONLY SPECIFIC OBJECT KEYS
router.patch(
  "/api/users/:id",
  checkSchema(patchUserSchema),
  resolveUserUserById,
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const data = matchedData(req);
    const { findUserIndex } = req;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...data };
    return res.send(mockUsers[findUserIndex]).status(200);
  }
);
///DELETE REQUEST
router.delete("/api/users/:id", resolveUserUserById, (req, res) => {
  const { findUserIndex } = req;
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers.splice(findUserIndex, 1);
  return res.send(200);
});
// fetch the data using params
router.get("/api/users/:id", resolveUserUserById, getUserIdHandler);
export default router;
