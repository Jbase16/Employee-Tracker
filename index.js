// This script is used to manage employee data in a company database using a command-line interface.

import pkg from "pg";
import inquirer from "inquirer";

const { Client } = pkg;

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

async function startMenu() {
  let exit = false;
  while (!exit) {
    console.clear(); // Clear the console before displaying the menu
    const { action } = await inquirer.prompt([
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
    ]);

    switch (action) {
      case "View All Departments":
        await viewAllDepartments();
        break;
      case "View All Roles":
        await viewAllRoles();
        break;
      case "View All Employees":
        await viewAllEmployees();
        break;
      case "Add a Department":
        await addDepartment();
        break;
      case "Add a Role":
        await addRole();
        break;
      case "Add an Employee":
        await addEmployee();
        break;
      case "Update an Employee Role":
        await updateEmployeeRole();
        break;
      case "Exit":
        client.end();
        exit = true;
        break;
      default:
        console.error("Unknown action:", action);
        break;
    }
  }
}

async function viewAllDepartments() {
  try {
    const res = await client.query("SELECT * FROM departments");
    console.table(res.rows);
  } catch (err) {
    console.error("Error fetching departments", err.stack);
  }
}

async function viewAllRoles() {
  try {
    const res = await client.query("SELECT * FROM roles");
    console.table(res.rows);
  } catch (err) {
    console.error("Error fetching roles", err.stack);
  }
}

async function viewAllEmployees() {
  try {
    const res = await client.query("SELECT * FROM employees");
    console.table(res.rows);
  } catch (err) {
    console.error("Error fetching employees", err.stack);
  }
}

async function addDepartment() {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the department:",
    },
  ]);
  try {
    await client.query("INSERT INTO departments (name) VALUES ($1)", [name]);
    console.log(`Added department: ${name}`);
  } catch (err) {
    console.error("Error adding department", err.stack);
  }
}

async function addRole() {
  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the title of the role:",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary for the role:",
    },
    {
      type: "input",
      name: "department_id",
      message: "Enter the department ID for the role:",
    },
  ]);
  try {
    await client.query(
      "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)",
      [title, salary, department_id]
    );
    console.log(`Added role: ${title}`);
  } catch (err) {
    console.error("Error adding role", err.stack);
  }
}

async function addEmployee() {
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the first name of the employee:",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the last name of the employee:",
    },
    {
      type: "input",
      name: "role_id",
      message: "Enter the role ID for the employee:",
    },
    {
      type: "input",
      name: "manager_id",
      message: "Enter the manager ID for the employee:",
    },
  ]);
  try {
    await client.query(
      "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, role_id, manager_id]
    );
    console.log(`Added employee: ${first_name} ${last_name}`);
  } catch (err) {
    console.error("Error adding employee", err.stack);
  }
}

async function updateEmployeeRole() {
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: "input",
      name: "employee_id",
      message: "Enter the ID of the employee to update:",
    },
    {
      type: "input",
      name: "role_id",
      message: "Enter the new role ID for the employee:",
    },
  ]);
  try {
    await client.query(
      "UPDATE employees SET role_id = $1 WHERE id = $2",
      [role_id, employee_id]
    );
    console.log(`Updated employee ID ${employee_id} with new role ID ${role_id}`);
  } catch (err) {
    console.error("Error updating employee role", err.stack);
  }
}

// Start the application
startMenu();
