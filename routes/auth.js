"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");


/** POST /login: {username, password} => {token} */


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post("/register", async function (req, res, next) {
  console.log("in register route");
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    const newUser = await User.register({username, password, first_name, last_name, phone});
    console.log("after registering and this is newUser:", newUser);

    let payload = {username};
    let token = jwt.sign(payload, SECRET_KEY);
    console.log("this is payload", payload, "this is token:", token);

    return res.json({token});
  } catch (err) {
    return next(err);
  }
});


module.exports = router;