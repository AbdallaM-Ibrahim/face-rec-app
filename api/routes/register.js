const express = require('express')
const router = express.Router();
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  let { name } = req.body;
  if(!email || !password) return res.status(400).json('bad cradintials');
  if(!name) name = 'Stranger';
  const hash = await bcrypt.hash(password, saltRounds);
  db.transaction(trx => {
    trx.insert({ hash, email })
      .into('login')
      .returning('email')
      .then(data => {
        return trx('users')
          .returning('*')
          .insert({
            email: data[0].email,
            name,
            joined: new Date()
          })
          .then(user => {
            console.log(user);
            return res.json(user[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('error during register'))
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  db.transaction(trx => {
    trx('users')
      .returning('email')
      .where('id', id)
      .del()
      .then(data => {
        if(data.length) 
          return trx('login')
            .where('email', data[0].email)
            .del()
            .then(data => res.status(204).end())
        res.status(400).json('bad request')
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('error during delete'));
})

module.exports = router;
