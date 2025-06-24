export const checkUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Must be minimun of 5 characters and maximum of 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be String",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display name must not be empty",
    },
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Must be minimun of 5 characters and maximum of 32 characters",
    },
  },
};
export const patchUserSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Must be minimun of 5 characters and maximum of 32 characters",
    },
    isString: {
      errorMessage: "Username must be String",
    },
  },
  displayName: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Must be minimun of 5 characters and maximum of 32 characters",
    },
  },
};
