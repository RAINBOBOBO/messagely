"use strict";

/**Handle calls to /auth routes */

const Router = require("express").Router;
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

const router = new Router();

/** POST /login: {username, password} => {token} */
router.post("/login", async (req, res, next) => {

  try {
    const { username, password } = req.body;
    const loggedInUser = await User.authenticate(username, password);
    console.log("loggedInUser: ", loggedInUser)

    if (loggedInUser) {
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
    }
    throw new UnauthorizedError("Invalid user/password");

  } catch (err) {
    return next(err);
  }
});

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post("/register", async function (req, res, next) {
  console.log("in register route");
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    const newUser = await User.register({ username, password, first_name, last_name, phone });
    console.log("after registering and this is newUser:", newUser);

    let payload = { username };
    let token = jwt.sign(payload, SECRET_KEY);
    console.log("this is payload", payload, "this is token:", token);

    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;