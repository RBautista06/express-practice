// client ID: 1388202977600213012
// client secret: 0qqATUu3MC7SqGLTW0Iko8uifVPGHBRO
// redirect URL: http://localhost:5000/api/auth/redirect/discord

import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

const clientId = "1388202977600213012";
const client_secret = "0qqATUu3MC7SqGLTW0Iko8uifVPGHBRO";
const redirect_URL = "http://localhost:5000/api/auth/redirect/discord";

passport.serializeUser((user, done) => {
  console.log("Inside Serialize User");
  console.log(user);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  console.log("Inside Deserialize User");
  console.log(`Desirializing User ${id}`);
  try {
    const findUser = await DiscordUser.findById(id);
    return findUser ? done(null, findUser) : done(null, null); // this will be available as req.user
  } catch (err) {
    return done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: clientId,
      clientSecret: client_secret,
      callbackURL: redirect_URL,
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await DiscordUser.findOne({ discordId: profile.id });
      } catch (err) {
        return done(err, null);
      }
      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });
          const newSaveduser = await newUser.save();
          return done(null, newSaveduser);
        }
        return done(null, findUser);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
