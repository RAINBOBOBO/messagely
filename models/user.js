"use strict";

const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const bcrypt = require("bcrypt");
const getformattedStartAt = require("../middleware/getTime");

/** User of the site. */
//YYYY-MM-DD HH:MI:SS

class User {
  
  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    console.log("in register function");
    try {
      const hashedPassword = await bcrypt.hash(
        password, BCRYPT_WORK_FACTOR);
      const joinAt = getformattedStartAt();
      // console.log("This is joinAt", joinAt);
      const result = await db.query(
        `INSERT INTO users (username, password, first_name, last_name, phone, join_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, first_name, last_name, phone, join_at`,
        [username, hashedPassword, first_name, last_name, phone, joinAt]);
      
      return result.rows[0];
    } catch (err) {
      console.log(`Couldn't register user because ${err}`);
    }
  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
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
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
  }
}


module.exports = User;
