
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../utils/db");

router.get("/", async (req, res) => {
  const data = await db.select('email').from('login');
  res.json(data);
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const data = await db
    .select('email', 'hash')
    .from('login')
    .where({email})
  if(data.length)
    if(await bcrypt.compare(password, data[0].hash))
      res.json(
        (await db
        .select('*')
        .from('users')
        .where({ email }))[0]
      )
    else res.status(400).json('wrong cradintials')
  else res.status(400).json('not found')
});

module.exports = router;
