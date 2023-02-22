const fs = require("fs");
const path = require("path");

const Database = {
  onExit: function () {
    for(entity in Database)
      if (entity !== 'onExit') 
        Database[entity].onSave();
    console.log("Database Saved!!!");
  },
};

Database['Users'] = require("./Users/Users")

module.exports = Database;
