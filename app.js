import { createObjectCsvWriter } from "csv-writer";
import prompt from "prompt";
import { existsSync, writeFileSync } from "fs";

// Initialize prompt and set message
prompt.start();
prompt.message = "";

// Create CSV writer
const csvWriter = createObjectCsvWriter({
  path: "./contactData.csv",
  append: true,
  header: [
    { id: "name", title: "NAME" },
    { id: "number", title: "NUMBER" },
    { id: "email", title: "EMAIL" }
  ]
});

// Person class for contact info
class Person {
  constructor(name = "", number = "", email = "") {
    this.name = name;
    this.number = number;
    this.email = email;
  }

  async saveToCSV() {
    try {
      const { name, number, email } = this;
      await csvWriter.writeRecords([{ name, number, email }]);
      console.log(`${name} saved!`);
    } catch (err) {
      console.error("Error saving contact:", err);
    }
  }
}

// Validate email format
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Validate phone number (simple 10-digit validation)
const isValidPhoneNumber = (number) => /^\d{10}$/.test(number);

// Check if CSV file exists, create with headers if not
if (!existsSync("./contactData.csv")) {
  writeFileSync("./contactData.csv", "NAME, NUMBER, EMAIL\n");
}

// Start the app and prompt for user input
const startApp = async () => {
  const questions = [
    { name: "name", description: "Contact Name" },
    { name: "number", description: "Contact Number" },
    { name: "email", description: "Contact Email" }
  ];

  const responses = await prompt.get(questions);

  // Validate inputs
  if (!isValidEmail(responses.email)) {
    console.log("Invalid email format.");
    return;
  }

  if (!isValidPhoneNumber(responses.number)) {
    console.log("Invalid phone number format.");
    return;
  }

  const person = new Person(responses.name, responses.number, responses.email);
  await person.saveToCSV();

  const { again } = await prompt.get([
    { name: "again", description: "Continue? [y to continue]" }
  ]);
  
  if (again.toLowerCase() === "y") await startApp();
};

// Start the app
startApp();
