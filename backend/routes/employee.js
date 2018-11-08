//第二步，写routes
//Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
// Route definition takes the following structure:
// *app.METHOD(PATH, HANDLER);
// 1.app is an instance of express.
// 2.METHOD is an HTTP request method, in lowercase.
// 3.PATH is a path on the server.
// 4.HANDLER is the function executed when the route is matched.

//Route paths, in combination with a request method, define the endpoints at which requests can be made. Route paths can be strings, string patterns, or regular expressions.

const express = require("express");
const router = express.Router();
const employee_controller = require("../controllers/employee");

//define the home page route
// router.get("/", function(req, res) {
//   res.send("users home page!");
// });

//restAPI
router.get("/employees", employee_controller.getAllEmployee);
router.get("/employee/:id", employee_controller.getEmployeeById);
router.get("/directreports/:id", employee_controller.getDirectReporters);
router.post("/addNewEmployee", employee_controller.addNewEmployee);
//:id use the req.params.id to match
router.delete("/employee/:id", employee_controller.deleteEmployee);
//use put to edit employee
router.put("/employee/:id", employee_controller.editEmployee);

module.exports = router;

//Then, load these two router modules in the app(index.js):
//app.use("/api", routes);  || import employee from "./routes/employee";
