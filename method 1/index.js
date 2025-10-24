import { appendFileSync, existsSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import colors from 'colors';

// Create readline interface for command-line input
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Async function to handle readline prompts
const readLineAsync = (message) =>
  new Promise((resolve) => readline.question(message, resolve));

// Validate email format
const isValidEmail = (email) => /\\S+@\\S+\\.\\S+/.test(email);

// Validate phone number (simple 10-digit validation)
const isValidPhoneNumber = (number) => /^\d{10}$/.test(number);

// Person class to handle contact information and save to CSV
class Person {
  constructor(name = '', number = '', email = '') {
    this.name = name;
    this.number = number;
    this.email = email;
  }

  // Save contact to CSV
  saveToCSV() {
    const content = `${this.name}, ${this.number}, ${this.email}\n`;
    try {
      // Check if the CSV file exists, create it if not
      if (!existsSync('./contacts.csv')) {
        writeFileSync('./contacts.csv', 'Name, Phone, Email\n');
      }
      appendFileSync('./contacts.csv', content);
      console.log(`${this.name} saved!`.green);
    } catch (err) {
      console.error('Error saving contact:'.bgRed, err);
    }
  }
}

// Check if CSV file exists, create with headers if not
if (!existsSync('contacts.csv')) {
  writeFileSync('contacts.csv', 'Name, Phone, Email\n');
}

// Start the application
const startApp = async () => {
  let shouldContinue = true;
  while (shouldContinue) {
    const name = await readLineAsync('Contact Name: '.blue);
    const number = await readLineAsync('Contact Number: '.blue);
    const email = await readLineAsync('Contact Email: '.blue);

    // Validate inputs
    if (!isValidEmail(email)) {
      console.log("Invalid email format.".red);
      continue; // Skip saving this contact and ask for a new one
    }

    if (!isValidPhoneNumber(number)) {
      console.log("Invalid phone number format.".red);
      continue; // Skip saving this contact and ask for a new one
    }

    const person = new Person(name, number, email);
    person.saveToCSV();

    const response = await readLineAsync('Continue? [y to continue]: '.red);
    shouldContinue = response.toLowerCase() === 'y';
  }
  readline.close();
};

// Start the app
startApp();
