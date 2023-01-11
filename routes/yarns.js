const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Connection to database
mongoose.connect('mongodb://localhost:27017/handicraft', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log("Connected to db, collection: yarns");
});

// Create a schema for yarn in database
let yarnSchema = mongoose.Schema({
  category: String,
  brand: String,
  name: String
});

// Create model from schema
let Yarn = mongoose.model('Yarn', yarnSchema);

/* GET yarns */
router.get('/', function (req, res, next) {
  // Function to get all documents from database
  Yarn.find(function (err, yarns) {
    if (err) return console.error(err);
    // Convert the array of objects to JSON string 
    let yarnsArr = JSON.stringify(yarns);
    // Header to indicate in which format response is sent
    res.contentType('application/json');
    // Send response to client with array of objects
    res.send(yarnsArr);
  });
});

/* GET yarn by id */
router.get('/:id', function (req, res, next) {
  // Save parameter value to a variable
  let id = req.params.id;

  // Function to get a certain document from database
  Yarn.findById(id, function (err, yarn) {
    if (err) return console.error(err);

    // Convert the object to JSON string
    let yarnObj = JSON.stringify(yarn);
    // Header to indicate in which format response is sent
    res.contentType('application/json');
    // Send response to client with object
    res.send(yarnObj);
  });
});

/* POST yarn */
router.post('/', function (req, res, next) {
  // New instance of Yarn is saved to a variable in which input data is saved
  let newYarn = new Yarn({
    category: req.body.category,
    brand: req.body.brand,
    name: req.body.name
  });

  // Function to add new yarn to database
  newYarn.save(function (err) {
    if (err) return console.error(err);

    // Send response to client application
    res.json({ message: "Garn sparat!" })
  });
});

/* UPDATE yarn by id */
router.put('/:id', function (req, res, next) {
  // Save parameter value to a variable
  let id = req.params.id;

  // Save all data from request in a variable
  let updatedYarn = {
    category: req.body.category,
    brand: req.body.brand,
    name: req.body.name
  };

  // Function to find and update a certain yarn from database
  Yarn.findOneAndUpdate({ "_id": id }, updatedYarn, function (err) {
    if (err) return console.error(err);

    // Send response to client application
    res.json({ message: "Garn uppdaterat!" })
  });
});

/* DELETE yarn by id */
router.delete('/:id', function (req, res, next) {
  // Save parameter value to a variable
  let id = req.params.id;

  // Function to delete a certain yarn from database
  Yarn.findByIdAndDelete({ "_id": id }, function (err) {
    if (err) return console.error(err);

    // Send response to client application
    res.json({ message: "Garn raderat!" })
  });
});

module.exports = router;