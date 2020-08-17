const moment = require("moment");

function getformattedStartAt() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

module.exports = getformattedStartAt;