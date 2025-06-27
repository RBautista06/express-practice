import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/mockData.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";
// This tells Passport how to store user data into the session
passport.serializeUser((user, done) => {
  console.log("Inside Serialize User");
  console.log(user);
  done(null, user.id); // Save only the user ID to the session (to keep it small and secure)
  // 🔐 This ID is what gets stored in the session cookie
});

// This tells Passport how to get the full user back using the ID from the session
passport.deserializeUser(async (id, done) => {
  console.log("Inside Deserialize User");
  console.log(`Desirializing User ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not Found");
    done(null, findUser); // this will be available as req.user
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found");
      if (comparePassword(password, findUser.password))
        throw new Error("bad Credentials");
      done(null, findUser);
    } catch (err) {
      //every error will be catch by this catch block
      done(err, null);
    }
  })
);
