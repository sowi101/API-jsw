const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Connection to database
mongoose.connect('mongodb://localhost:27017/handicraft', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log("Connected to db, collection: tools");
});

// Create a schema for tool in database
let toolSchema = mongoose.Schema({
  category: String,
  brand: String,
  size: String
});

// Create model from schema
let Tool = mongoose.model('Tool', toolSchema);

/* GET tools */
router.get('/', function (req, res, next) {
  // Function to get all documents from database
  Tool.find(function (err, tools) {
    if (err) return console.error(err);
    // Convert the array of objects to JSON string 
    let toolsArr = JSON.stringify(tools);
    // Header to indicate in which format response is sent
    res.contentType('application/json');
    // Send response to client with array of objects
    res.send(toolsArr);
  });
});

/* GET tool by id */
router.get('/:id', function (req, res, next) {
  // Save parameter value to a variable
  let id = req.params.id;

  // Function to get a certain document from database
  Tool.findById(id, function (err, tool) {
    if (err) return console.error(err);

    // Convert the object to JSON string
    let toolObj = JSON.stringify(tool);
    // Header to indicate in which format response is sent
    res.contentType('application/json');
    // Send response to client with object
    res.send(toolObj);
  });
});

/* POST project */
router.post('/', function (req, res, next) {
  // New instance of Tool is saved to a variable in which input data is saved
  let newTool = new Tool({
    category: req.body.category,
    brand: req.body.brand,
    size: req.body.size,
  });

  // Function to add new tool to database
  newTool.save(function (err) {
    if (err) return console.error(err);

    // Send response to client application
    res.json({ message: "Verktyg sparat!" })
  });
});


/* UPDATE tool by id */
router.put('/:id', function (req, res, next) {
  // Save parameter value to a variable
  let id = req.params.id;

  // Save all data from request in a variable
  let updatedTool = {
    category: req.body.category,
    brand: req.body.brand,
    size: req.body.size,
  };

  // Function to find and update a certain tool from database
  Tool.findByIdAndUpdate({ "_id": id }, updatedTool, function (err) {
    if (err) return console.error(err);

    // Send response to client application
    res.json({ message: "Verktyg uppdaterat!" })
  });
});


/* DELETE tool by id */
router.delete('/:id', function (req, res, next) {
  // Save parameter value to a variable
  let id = req.params.id;

  // Function to delete a certain tool from database
  Tool.deleteOne({ "_id": id }, function (err) {
    if (err) return console.error(err);

    // Send response to client application
    res.json({ message: "Verktyg raderat!" })
  });
});

module.exports = router;