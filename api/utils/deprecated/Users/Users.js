const fs = require("fs");
const path = require("path");
const usersPath = path.join(__dirname, "Users.txt");

let lastIndex = 0;
let oldData = {};
const emails = {};


try {
  oldData = JSON.parse(fs.readFileSync(usersPath, "utf-8")).data;
} catch (e) {
  console.error("initializing new database");
  oldData = {
    1: {
      email: "john@gmail.com",
      name: "john",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    2: {
      email: "sally@gmail.com",
      name: "sally",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  };
  fs.writeFileSync(usersPath, JSON.stringify({
    lastIndex: 2,
    data: oldData
  }));
} finally {
  for([key, value] in oldData) {
    key = parseInt(key);
    if(lastIndex < key)  lastIndex = key;
    emails[oldData[key].email] = key;
    oldData[key].joined = new Date(oldData[key].joined);
  }
  
}

const data = oldData;
delete oldData;

const save = function (user) {
  data[user.id].email = user.email;
  data[user.id].name = user.name;
  data[user.id].entries = user.entries;
}

const Users = {
  props: ['email', 'name', 'password'],
  createUser: function (email, name) {
    emails[email] = lastIndex += 1;
    data[lastIndex] = {
      email,
      name,
      password,
      entries: 0,
      joined: new Date()
    };
  },
  getUser: function (id) {
    if (typeof id === 'number')
    return {
      id,
      ...data[id],
    }
  },
  updateUser: function (id, options) {
    if(!options) throw new Error('Invalid arguments!')
    const user = this.getUser(id);
    if(options.entries) {
      delete options.entries;
      user.entries = user.entries + 1;
    }
    console.log(user)
    this.props.forEach(prop => {
      if(options[prop]) user[prop] = options[prop];
    });
    save(user);
  },
  deleteUser: function (id) {
    delete emails[data[id].email];
    delete data[id];
  },
  // ! Just for debugging
  getAll: function () {
    return data;
  },
  getId: function (email) {
    return emails[email]
  },
  onSave: function() {
    const entityPath = path.join(__dirname, 'Users.txt')
    fs.writeSync(fs.openSync(entityPath, "w"), JSON.stringify({
      lastIndex,
      data,
    }))
  }
}

{ // ToDo: Testing
// * Create
// Database.Users.createUser(
//   'abdo@gmail.com',
//   'Abdo',
//   'mango',
// )

// * Reed
// console.log('Item 0:', Database.Users.getUser(0));

// * Update
// Database.Users.updateUser(
//   0,
//   {name: 'Ahmed'},
// )

// * Delete
// Database.Users.deleteUser(2);

// * Print for testing
// console.log(emails);
}

module.exports = Users;
