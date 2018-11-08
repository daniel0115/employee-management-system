//第三步，写controller

//import the schema Employee from model
import Employee from "../models/employee";

// 1.get all employees information by writing the route handle function
//const getAllEmployee = (req, res) => { Employee.find(） 就已经成功查找所有数据
// GET: get all empolyees information
//method: get post delete put (restAPI)
//Employee.find({}, (err, employees)，=》
//{} 查找数据库里所有的东西，
//(err, employees)=> err: 查找如果出错！
//employees:把在数据库里找到的所有数据以json形式返回给employees
const getAllEmployee = (req, res) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ employees });
    }
  });
};

// 2.GET: Get an employee by id
//Employee.findById(req.params.id, (err, employee) =》
//(req.params.id =>指的就是在数据库里找相对于的id的数据
const getEmployeeById = (req, res) => {
  console.log("start get employee by id");
  console.log(req.params.id);
  let numOfDRs = 0;
  let managerName = null;
  Employee.findById(req.params.id, (err, employee) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      console.log(employee);
      //find number of direct reporters
      if (employee.directReporters) {
        numOfDRs = employee.directReporters.length;
        console.log(numOfDRs);
      }
      //find manager name
      if (employee.manager) {
        console.log(employee.manager);
        Employee.findById(employee.manager, (err, manager) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            console.log("your manager's name:");
            console.log(manager);
            managerName = manager.name;
            res.status(200).json({
              employee,
              managerName: managerName,
              numOfDRs: numOfDRs
            });
          }
        });
      } else {
        // console.log(`You selecte: ${employee.name}`);
        console.log("no manager case");
        console.log(managerName);
        res.status(200).json({
          employee,
          managerName: managerName,
          numOfDRs: numOfDRs
        });
      }
    }
  });
};

//3. get direct reporter by employee id
const getDirectReporters = (req, res) => {
  Employee.find({ manager: req.params.id }, (err, employee) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      // let drs = employee.directReporters;
      // Employee.find({}, (err, all) => {
      // if (err) {
      // res.status(500).json({ error: err });
      // } else {
      res.status(200).json({
        reporters: employee
      });
    }
  });
};
// });
// };

//4.add one emploee
const addNewEmployee = (req, res) => {
  // When this staff is not assigned with a manager
  console.log(`req.body.manager: ${req.body.manager}`);

  console.log(req.body.manager === null);
  if (!req.body.manager) {
    // console.log("it is posting");
    //Employee.create(req.body, (err, employee) =>
    //创建一个新的employee，req.body-> 把post到数据库里的信息赋给employee
    Employee.create(req.body, (err, employee) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        console.log("post ok");
        //这里我要给前端返回的是所有的employees 这个array！
        getAllEmployee(req, res);
        // res.status(201).json({message: 'New staff created!'});
      }
    });
  } else {
    // When this employee is assigned with a manager
    Employee.create(req.body, (err, employee) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        console.log(`New emplpyee is added.`);
        // Find the manager and update his/her direct reports
        console.log(req.body.manager, typeof req.body.manager);
        Employee.findById(req.body.manager, (err, manager) => {
          if (err) {
            console.log(`Manager fetch failed: ${err}`);
            res.status(500).json({ error: err });
          } else {
            console.log(employee._id);
            console.log(manager);
            console.log(manager.directReporters);
            let newDR = [...manager.directReporters, employee._id];
            //employee's manager has no DR;
            // let newDR = [employee._id];
            console.log(newDR);
            // Update manager's direct reports
            console.log(manager._id);
            Employee.findByIdAndUpdate(
              manager._id,
              { directReporters: newDR },
              err => {
                if (err) res.status(500).json({ error: err });
                else {
                  // res.status(201).json({message: 'New staff created and the managers direct reports are updated!'});

                  getAllEmployee(req, res);

                  // getAllEmployee(req, res);
                  // console.log(`Your edited manager's DR, new manager is: ${staff}`);
                  // Get updated staff list
                  // Staff.find({}, (err, staffs) => {
                  //     if (err) res.status(500).json({error: err});
                  //     else {
                  //         res.status(200).json({staffs});
                  //     }
                  // })
                }
              }
            );
          }
        });
      }
    });
  }
};

//5. Delete employee,
const deleteEmployee = (req, res) => {
  //find the employee
  console.log("start deleting");
  console.log(req.params.id);
  Employee.findById(req.params.id, (err, employee) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      // Find employee's manager and delete employee from manager's direct reports
      console.log(employee);
      if (employee.manager) {
        Employee.findById(employee.manager, (err, manager) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            console.log("manager:", manager);
            let reporter_Index = manager.directReporters.indexOf(employee._id);
            console.log(manager.directReporters);
            let newDR = [
              ...manager.directReporters.slice(0, reporter_Index),
              ...manager.directReporters.slice(reporter_Index + 1)
            ];
            console.log(`Your current manager's newDR: ${newDR}`);
            console.log(manager.directReporters);
            Employee.findByIdAndUpdate(
              manager._id,
              { directReporters: newDR },
              err => {
                if (err) {
                  res.status(500).json({ error: err });
                  // getAllEmployee(req, res);
                }
              }
            );
          }
        });
      }

      // FIND the employee's direc reports and update their manager to null
      console.log("ur drs:", employee.directReporters);
      if (employee.directReporters) {
        console.log("ur drs:", employee.directReporters);

        employee.directReporters.forEach(reporter_id => {
          console.log(`em reporter: ${reporter_id}`);
          Employee.findByIdAndUpdate(reporter_id, { manager: null }, err => {
            if (err) {
              res.status(500).json({ error: err });
            }
          });
        });
      }

      // Find staff's direct reports and update their manager to null
      // console.log("ur drs:", employee.directReporters);
      // if (employee.directReports) {
      //   employee.directReports.forEach(reporter_id => {
      //     console.log("ur drs:", employee.directReporters);
      //     Staff.findByIdAndUpdate(reporter_id, { manager: null }, err => {
      //       if (err) res.status(500).json({ error: err });
      //     });
      //   });
      // }

      //Delete the employee
      Employee.findByIdAndRemove(req.params.id, (err, employee) => {
        if (err) {
          req.status(500).json({ error: err });
        } else {
          getAllEmployee(req, res);
          console.log("successful deleter employee");
        }
      });
    }
  });
};

// 6. Edit an employee
const editEmployee = (req, res) => {
  Employee.findById(req.params.id, (err, employee) => {
    console.log("edit em_id:", req.params.id);
    console.log(req.body);
    if (err) {
      res.status(500).json({ error: err });
    } else {
      Employee.findByIdAndUpdate(req.params.id, err => {
        if (err) res.status(500).json({ error: err });
        else {
          getEmployeeById(req, res);
        }
      });
    }
  });
};

// 6. Edit an employee
// const editEmployee = (req, res) => {
//   Employee.findById(req.params.id, (err, employee) => {
//     if (err) res.status(500).json({ error: err });
//     else {
//       if (employee) {
//         // Avoid management circle
//         let index = employee.directReports.indexOf(req.body.manager); // check if staff's direct reports has req.body.manager
//         // console.log(`index: ${index}`)
//         if (employee._id == req.body.manager || index != -1) {
//           console.log(`Management circle is not allowed`);
//           res.status(500).json({ error: "Management circle is not allowed." });
//         } else if (employee.manager != req.body.manager) {
//           // If manager changes
//           // 1. add current staff into new manager's direct reports
//           if (req.body.manager) {
//             Employee.findById(req.body.manager, (err, manager) => {
//               if (err) res.status(500).json({ error: err });
//               else {
//                 let newDR = [...manager.directReports, employee._id];
//                 console.log(`Your new manager's newDR: ${newDR}`);
//                 Employee.findByIdAndUpdate(
//                   manager._id,
//                   { directReports: newDR },
//                   err => {
//                     if (err) res.status(500).json({ error: err });
//                   }
//                 );
//               }
//             });
//           }

//           if (employee.manager) {
//             // 2. delete current staff from current manager's direct reports
//             Employee.findById(employee.manager, (err, manager) => {
//               console.log(`hihi trying to delete ,,,,,`);
//               if (err) res.status(500).json({ error: err });
//               else {
//                 let idx = manager.directReports.indexOf(staff._id);
//                 // delete operation using spread and slice
//                 let newDR = [
//                   ...manager.directReports.slice(0, idx),
//                   ...manager.directReports.slice(idx + 1)
//                 ];
//                 console.log(`Your current manager's newDR: ${newDR}`);
//                 Employee.findByIdAndUpdate(
//                   manager._id,
//                   { directReports: newDR },
//                   err => {
//                     if (err) res.status(500).json({ error: err });
//                   }
//                 );
//               }
//             });
//           }

//           // 3. update current staff:
//           Employee.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             (err, updatedStaff) => {
//               if (err) res.status(500).json({ error: err });
//               else {
//                 getEmployeeById(req, res);
//                 // res.status(200).json({updatedStaff});
//                 // res.status(201).json({message: 'The staff is updated!'});
//                 // getAll(req, res);
//               }
//             }
//           );
//         } else {
//           // If manager is not changed
//           Employee.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             (err, updatedStaff) => {
//               if (err) res.status(500).json({ error: err });
//               else {
//                 getEmployeeById(req, res);
//                 // res.status(200).json({updatedStaff});
//                 // res.status(201).json({message: 'The staff is updated!'});
//                 // getAll(req, res);
//               }
//             }
//           );
//         }
//       }
//     }
//   });
// };

module.exports = {
  getAllEmployee,
  getEmployeeById,
  getDirectReporters,
  addNewEmployee,
  deleteEmployee,
  editEmployee
};

// 2.GET: Get an employee by id
//Employee.findById(req.params.id, (err, employee) =》
//(req.params.id =>指的就是在数据库里找相对于的id的数据
// const getEmployeeById = (req, res) => {
//   console.log(req.params.id);
//   Employee.findById(req.params.id, (err, employee) => {
//     if (err) {
//       res.status(500).json({ error: err });
//     } else {
//       res.status(200).json(employee);
//     }
//   });
// };
