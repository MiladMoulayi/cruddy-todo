const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err = null, id) => {
    // items[id] = text;
    var toDoDir = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(toDoDir, text, (err) => {
      if (err) {
        throw ('error writing todo file');
      } else {
        callback(null, { id, text });
      }
    });
  });
};


exports.readAll = (callback) => {
  var todoList;
  fs.readdir(exports.dataDir, (err = null, files) => {
    if (err) {
      throw console.log('error');
    } else {
      var formatedList = [];
      files.forEach((items) => {
        item = items.slice(0, -4);
        formatedList.push({'id': item, 'text': item});
      });
      return callback(null, formatedList);
    }
  });
};

exports.readOne = (id, callback) => {
  var idToPass = `${exports.dataDir}/${id}.txt`;
  fs.readFile(idToPass, 'utf8', (err = null, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  }
  );
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var idToPass = `${exports.dataDir}/${id}.txt`;
      fs.writeFile(idToPass, text, (err = null) => {
        if (err) {
          callback(new Error('This file is read-only'));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');


exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
