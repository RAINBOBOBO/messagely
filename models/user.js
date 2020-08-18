"use strict";

const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const bcrypt = require("bcrypt");
const Message = require("./message");

/** User of the site. */

class User {

  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    console.log("in register function");
    const hashedPassword = await bcrypt.hash(
      password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, phone, join_at)
      VALUES ($1, $2, $3, $4, $5, localtimestamp)
      RETURNING username, first_name, last_name, phone, join_at`,
      [username, hashedPassword, first_name, last_name, phone]);

    return result.rows[0];
  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    console.log(`authenticating ${username}`);

    const result = await db.query(
      `SELECT password
      FROM users
      WHERE username = $1`,
      [username]
    );

    const userFromDB = result.rows[0];
    console.log("userFromDB is ", userFromDB);

    if (userFromDB) {
      if (await bcrypt.compare(password, userFromDB.password) === true) {
        return true;
      }
    }
    return false;
  }

  /** Update last_login_at for user, doesn't return anything */

  static async updateLoginTimestamp(username) {
    console.log(`updateLoginTimestamp ran and username is ${username}`);

    const result = await db.query(
      `UPDATE users
      SET last_login_at = current_timestamp
      WHERE username = $1
      RETURNING username, last_login_at`,
      [username]
    );

    const user = result.rows[0];
    console.log(`last login updated for ${username} ${user.last_login_at}`)

  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
    console.log("get basic info on all users");
    // order results in some way
    const results = await db.query(
      `SELECT username, first_name, last_name
      FROM users
      `
    );
    console.log("result.rows", results.rows);
    return results.rows;

  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    console.log("get user by username", username);
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users
      WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    // console.log("this is user:", user)
    return user;
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    console.log("get messages for user", username);
    // return [{id, to_user, body, sent_at, read_at}]
    // return [{id, to_user: {username, first_name, last_name, phone}, body, sent_at, read_at}]

    const mResults = await db.query(
      `SELECT id
      FROM messages
      WHERE from_username = $1`, [username]
    );

    const messagesIds = mResults.rows;
    console.log("messagesIds for user: ", messagesIds);

    // iterate through each index, Message.get(id), delete from_user key
    // Message.get(id) => { id, from_user, to_user, body, sent_at, read_at } 
    // where both to_user and from_user = { username, first_name, last_name, phone }
    const messagesDetails = messagesIds.map(async (id) => {
      const message = await Message.get(id);
      delete message.from_user;
      return message;
    })

    return messagesDetails;

  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    console.log("get messages to user", username);
    // return [{id, to_user, body, sent_at, read_at}]
    // return [{id, to_user: {username, first_name, last_name, phone}, body, sent_at, read_at}]

    const mResults = await db.query(
      `SELECT id
      FROM messages
      WHERE to_username = $1`, [username]
    );

    const messagesIds = mResults.rows;
    console.log("messagesIds to user: ", messagesIds);

    // iterate through each index, Message.get(id), delete from_user key
    // Message.get(id) => { id, from_user, to_user, body, sent_at, read_at } 
    // where both to_user and from_user = { username, first_name, last_name, phone }
    const messagesDetails = messagesIds.map(async (id) => {
      const message = await Message.get(id);
      delete message.to_user;
      return message;
    })

    return messagesDetails;
  }
}


module.exports = User;
