const Attacker = require("./Attacker");

const types = Object.freeze({
  INVALID_USER: "InvalidUser",
  FAILED_CONNECTION: "FailedConnection"
});

const regexes = {
  invalidUserRegex: /Invalid user ([^\s]+) from ((?:[0-9]{1,3}\.){3}[0-9]{1,3})/,
  failedConnectionRegex: /Did not receive identification string from ((?:[0-9]{1,3}\.){3}[0-9]{1,3})/
};

class Attack {
  static get Types() {
    return types;
  }

  static parseAddress(log) {
    if (regexes.invalidUserRegex.test(log)) {
      return regexes.invalidUserRegex.exec(log)[2];
    } else if (regexes.failedConnectionRegex.test(log)) {
      return regexes.failedConnectionRegex.exec(log)[1];
    } else {
      throw new Error(`Attempted to parse invalid attack log: ${log}`)
    }
  }

  static isValidAttackLog(log) {
    return regexes.invalidUserRegex.test(log) || regexes.failedConnectionRegex.test(log);
  }

  constructor(log) {
    this.log = log;
    this.time = this._parseTime(log);
    this.parameters = {};
    this._parseLog(log);
  }

  _createInvalidUserAttack(log) {
    const match = regexes.invalidUserRegex.exec(log);
    const [ignored, targetUsername, ip] = match;
    this.type = Attack.Types.INVALID_USER;
    this.attacker = new Attacker(ip);
    this.parameters.targetUsername = targetUsername;
  }

  _createFailedConnectionAttack(log) {
    const match = regexes.failedConnectionRegex.exec(log);
    this.type = Attack.Types.FAILED_CONNECTION;
    this.attacker = new Attacker(match[1]);
  }

  _parseLog(log) {
    if (regexes.invalidUserRegex.test(log)) {
      this._createInvalidUserAttack(log);
    } else if (regexes.failedConnectionRegex.test(log)) {
      this._createFailedConnectionAttack(log)
    } else {
      throw new Error(`Attempted to parse invalid attack log: ${log}`)
    }
  }

  _parseTime(log) {
    let timeStr = log.substring(0, log.indexOf(" ip-"));
    if (!timeStr) return null;
    // assumes that these all happened this year... frail I know, but the logs themselves are limited
    timeStr += ` ${new Date().getFullYear()}`;
    return new Date(timeStr);
  }
}

module.exports = Attack;
