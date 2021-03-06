"use strict";

const { messagesFrom } = require("../models/user");

const Router = require("express").Router;
const { ensureLoggedIn } = require("../middleware/auth");
const Message = require("../models/message");
const router = new Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/


/** POST / - post message.
 *
 * {to_username, body, _token} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn,  async (req, res, next) => {
  console.log("posting a new message");
  try {
    const from_username = res.locals.user.username;
    const { to_username, body} = req.body;
    console.log("from_user", from_username, "to_username", to_username, "body",body );

    const postMessage = await Message.create({ from_username, to_username, body });

    return res.json({ postMessage }) 
  } catch (err) {
    return next(err);
  }
 })


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/


module.exports = router;