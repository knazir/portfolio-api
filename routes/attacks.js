const cron = require("node-cron");
const debug = require("debug")("portfolio-api:attacks");
const express = require("express");
const fs = require("fs");
const router = express.Router();

const Attack = require("../models/attacks/Attack");

// parsed entries will be stored and updated here
let attackData = {
  attacks: [],
  lastUpdated: null
};

function loadEventLogs() {
  fs.readFile(process.env.sshAuthLog, "utf-8", (err, logs) => {
    if (err) return debug(`Encountered error reading file ${process.env.sshAuthLog}: ${err}`);
    attackData.attacks = logs.split("\n")
      .filter(log => Attack.isValidAttackLog(log))
      .map(log => new Attack(log));
    attackData.lastUpdated = new Date();
  });
}

cron.schedule(process.env.parseAttackLogCrontab, () => loadEventLogs());
loadEventLogs();

router.get("/list", (req, res) => {
  res.json(attackData);
});

module.exports = router;
