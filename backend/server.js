const app = require("./app");
const dotenv = require("dotenv");

// Database Require
const connectDatabase = require("./config/database");

// UnCaught Exception Error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting the server due to unCaught Exception");

  process.exit(1);
});

//Config
dotenv.config({ path: "./config/config.env" });

const agenda = require("./config/agendaConfig")

// Start Agenda
async function startAgenda() {
  await agenda.start();
  console.log("Agenda has been started!");
}

process.on("SIGTERM", async () => {
  console.log("Stopping Agenda...");
  await agenda.stop();
  process.exit(0);
});


// Start Agenda
startAgenda();

//Connect Database
connectDatabase();


const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on port ${process.env.PORT}...`);
});


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting the server due to unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
