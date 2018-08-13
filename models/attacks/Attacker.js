const Location = require("./Location");

class Attacker {
  constructor(ip) {
    this.ip = ip;
    this.location = new Location(ip);
  }
}

module.exports = Attacker;
