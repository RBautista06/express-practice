import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/mockData.mjs";

// This tells Passport how to store user data into the session
passport.serializeUser((user, done) => {
  console.log("Inside Serialize User");
  console.log(user);
  done(null, user.id); // Save only the user ID to the session (to keep it small and secure)
  // 🔐 This ID is what gets stored in the session cookie
});

// This tells Passport how to get the full user back using the ID from the session
passport.deserializeUser((id, done) => {
  console.log("Inside Deserialize User");
  console.log(`Desirializing User ${id}`);
  try {
    const findUser = mockUsers.find((user) => user.id === id);
    if (!findUser) throw new Error("User not Found");
    done(null, findUser); // this will be available as req.user
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    try {
      const findUser = mockUsers.find((user) => user.username === username);
      if (!findUser) throw new Error("User is not found!");
      if (findUser.password !== password)
        throw new Error("Invalid Credentials");
      done(null, findUser);
    } catch (err) {
      //every error will be catch by this catch block
      done(err, null);
    }
  })
);
