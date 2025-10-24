
import { appendFileSync, existsSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import colors from 'colors'

// Create readline interface for command-line input
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Async function to handle readline prompts
const readLineAsync = (message) =>
  new Promise((resolve) => readline.question(message, resolve));

// Person class to handle contact information and save to CSV
class Person {
  constructor(name = '', number = '', email = '') {
    this.name = name;
    this.number = number;
    this.email = email;
  }

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

// Start the application
const startApp = async () => {
  let shouldContinue = true;
  while (shouldContinue) {
    const name = await readLineAsync('Contact Name: '.bgBlue);
    const number = await readLineAsync('Contact Number: '.bgBlue);
    const email = await readLineAsync('Contact Email: '.bgBlue);

    const person = new Person(name, number, email);
    person.saveToCSV();

    const response = await readLineAsync('Continue? [y to continue]: '.red);
    shouldContinue = response.toLowerCase() === 'y';
  }
  readline.close();
};

// Start the app
startApp();
