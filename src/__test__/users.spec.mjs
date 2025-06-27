import * as validator from "express-validator";
import * as helpers from "../utils/helpers.mjs";
import { createUserHandler, getUserIdHandler } from "../handlers/user.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { mockUsers } from "../utils/mockData.mjs";

// mocking the validation
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: "Invalid Field" }]),
  })),
  matchedData: jest.fn(() => ({
    username: "test",
    password: "password",
    displayName: "testName",
  })),
}));

// mocking the hashpassword
jest.mock("../utils/helpers.mjs", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));
// mokcing the User constructor
jest.mock("../mongoose/schemas/user.mjs");
//mock req and res
const mockRequest = {
  findUserIndex: 1,
};
const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe("get users", () => {
  it("should get user by ID", () => {
    getUserIdHandler(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[1]);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("it should call sendStatus with 404 when not found", () => {
    // override the mockUser to call an index that doesnt exist so the status 404 will pass
    const copyMockRequest = { ...mockRequest, findUserIndex: 100 };
    getUserIdHandler(copyMockRequest, mockResponse);
    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});

describe("create users", () => {
  const mockRequest = {};
  it("should return status 400 if there is any errors", async () => {
    await createUserHandler(mockRequest, mockResponse);
    //mocking the valditor
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid Field" }],
    });
  });
  it("should return status of 201 and the user created", async () => {
    // this is how you can override the mock of validation result
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));
    //mocke the save method
    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockResolvedValueOnce({
        username: "test",
        password: "hashed_password",
        displayName: "testName",
      });
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalledWith("password");
    expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
    expect(User).toHaveBeenCalledWith({
      username: "test",
      password: "hashed_password",
      displayName: "testName",
    });
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      username: "test",
      password: "hashed_password",
      displayName: "testName",
    });
    // console.log(User.mock.instances[0]);
  });
  it("should thrown an error of 400 if failed to save user", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));
    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockImplementationOnce(() => Promise.reject("Failed to save user"));
    await createUserHandler(mockRequest, mockResponse);
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
