const express = require("express");
const cors = require("cors");

const image = require("./routes/image.js");
const signin = require('./routes/signin');
const register = require('./routes/register');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', (req, res, next) => {
  console.log(req.method,  'localhost:8080' + req.url)
  console.log(req.body);
  next();
})
app.use('/image', image);
app.use('/signin', signin);
app.use('/register', register)

app.get('/', (req,res) => {
  res.send('<h1>Hello World!</h1>')
})

const server = app.listen(8080, () => {
  console.log('Server is running: http://localhost:8080/');
});
