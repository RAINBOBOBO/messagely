"use strict";

const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const bcrypt = require("bcrypt");
const getformattedStartAt = require("../middleware/getTime");

/** User of the site. */

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
    console.log(`authenticating ${username}`);
    try {
      const result = await db.query (
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
    } catch (err) {
      console.log("UNABLE TO AUTHENTICATE USER : ", err);
    }
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    console.log(`updateLoginTimestamp ran and username is ${username}`);
    try {
      const currentTime = getformattedStartAt();
      const result = await db.query(
        `UPDATE users
        SET last_login_at = $1
        WHERE username = $2
        RETURNING username, last_login_at`, 
        [currentTime, username] 
      );
      const user = result.rows[0];
      console.log(`last login updated for ${username} ${user.last_login_at}`)
    } catch (err) {
      console.log(`Couldn't update last login because ${err}`);
    }
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
