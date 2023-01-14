const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Connection to database
mongoose.connect('mongodb://localhost:27017/handicraft', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log("Connected to db, collection: projects");
});

// Create a schema for project in database
let projectSchema = mongoose.Schema({
  name: String,
  link: String,
  tool: String,
  yarn: String,
  information: String,
  status: String
});

// Create model from schema
let Project = mongoose.model('Project', projectSchema);

/* GET projects */
router.get('/', function (req, res, next) {
  // Function to get all documents from database
  Project.find(function (err, projects) {
    if (err) return console.error(err);
    // Convert the array of objects to JSON string 
    let projectsArr = JSON.stringify(projects);
    // Header to indicate in which format response is sent
    res.contentType('application/json');
    // Send response to client with array of objects
    res.send(projectsArr);
  });
});

/* GET projects by id */
router.get('/:id', function (req, res, next) {
  // Save parameter value to a variable
  let id = req.params.id;

  // Function to get a certain document from database
  Project.findById(id, function (err, project) {
    if (err) return console.error(err);
    // Convert the object to JSON string
    let projectObj = JSON.stringify(project);
    // Header to indicate in which format response is sent
    res.contentType('application/json');
    // Send response to client with object
    res.send(projectObj);
  });
});

/* POST project */
router.post('/', function (req, res, next) {
  // New instance of Project is saved to a variable in which input data is saved
  let newProject = new Project({
    name: req.body.name,
    link: req.body.link,
    tool: req.body.tool,
    yarn: req.body.yarn,
    information: req.body.information,
    status: req.body.status
  });

  // Function to add new project to database
  newProject.save(function (err) {
    if (err) return console.error(err);

    // Send response to client application
    res.json({ message: "Projekt sparat!" })
  });
});

/* UPDATE project by id */
router.put('/:id', function (req, res, next) {
  // Save parameter value to a variable
  let id = req.params.id;

  // Save all data from request in a variable
  let updatedProject = {
    name: req.body.name,
    link: req.body.link,
    tool: req.body.tool,
    yarn: req.body.yarn,
    information: req.body.information,
    status: req.body.status
  };

  // Function to find and update a certain project from database
  Project.findByIdAndUpdate({ "_id": id }, updatedProject, function (err) {
    if (err) return console.error(err);

    // Send response to client application
    res.json({ message: "Projekt uppdaterat!" })
  });
});

/* DELETE project by id */
router.delete('/:id', function (req, res, next) {
  // Save parameter value to a variable
  let id = req.params.id;

  // Function to delete a certain project from database
  Project.findByIdAndDelete({ "_id": id }, function (err) {
    if (err) return console.error(err);

    // Send response to client application
    res.json({ message: "Projekt raderat!" })
  });
});

module.exports = router;