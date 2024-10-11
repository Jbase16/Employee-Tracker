const { Client } = require("pg");
const inquirer = require('inquirer');

const client = new Client({
  user: "jphil16",
  host: "localhost",
  database: "company_db",
  password: "Jdphil16!!",
  port: 5432,
});

client
  .connect()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Connection error", err.stack));

function startMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          break;
        default:
          client.end();
      }
    });
}

startMenu();

function viewAllDepartments() {
  client.query("SELECT * FROM department", (err, res) => {
    if (err) {
      console.error("Error fetching departments", err.stack);
    } else {
      console.table(res.rows);
      startMenu(); // Call startMenu again to allow the user to choose another action.
    }
  });
}
