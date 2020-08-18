"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require("../models/user");


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", async function(req, res, next) {
  try {
    const users = await User.all();

    return res.json({users});
  } catch (err) {
    return next(err);
  }
})


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", async function(req, res, next) {
  try {
    const { username } = req.params;
    const user = await User.get(username);
    // console.log("this is user after awaiting:", user);

    return res.json({user});
  } catch (err) {
    return next(err);
  }
});


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", async function (req, res, next) {
    // TODO: import and add ensureCorrectUser middleware
  console.log("getting messages sent to user", req.params.username);
  try {
    const { username } = req.params;
    const messages = await User.messagesTo(username);
    console.log("messages after awaiting:", messages);

    return res.json({ messages });
  } catch (err) {
    return next(err);
  }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", async function (req, res, next) {
  // TODO: import and add ensureCorrectUser middleware
  console.log("getting messages sent from user", req.params.username);
  try {
    const { username } = req.params;
    const messages = await User.messagesFrom(username);
    console.log("messages after awaiting:", messages);

    return res.json({ messages });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;