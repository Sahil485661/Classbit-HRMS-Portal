const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');

// Check if .env already exists
if (fs.existsSync('.env')) {
  console.log("⚠️ .env already exists!");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise(res => rl.question(q, ans => res(ans)));

// Helper function to ask for a password while hiding the input with asterisks
const askPassword = (query) => {
  return new Promise((resolve) => {
    process.stdout.write(query);
    rl.pause(); // Pause readline to let raw mode handle the inputs securely
    
    let password = '';
    
    const onData = (chunk) => {
      const char = chunk.toString('utf8');
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004': // Enter or End-Of-Transmission (EOT)
          process.stdout.write('\n');
          process.stdin.removeListener('data', onData);
          process.stdin.setRawMode(false);
          process.stdin.pause(); // Pause stdin temporarily to let rl.resume work properly
          rl.resume();
          resolve(password);
          break;
        case '\u0003': // Ctrl+C
          process.stdin.removeListener('data', onData);
          process.stdin.setRawMode(false);
          process.exit();
          break;
        case '\b':
        case '\x7f':
        case '\x08': // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            // Move cursor back, overwrite with space, move cursor back
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    };

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', onData);
  });
};

(async () => {
  console.log("=== HRMS Setup ===");

  const DB_HOST = await ask("Enter DB Host (default: localhost): ") || "localhost";
  const DB_PORT = await ask("Enter DB Port (default: 3306): ") || "3306";
  const DB_USER = await ask("Enter DB User: ");
  const DB_PASSWORD = await askPassword("Enter DB Password: ");
  const SMTP_USER = await ask("Enter SMTP Email: ");
  const SMTP_PASSWORD = await askPassword("Enter SMTP Password: ");

  // Auto generate 64-character hex secret
  const JWT_SECRET = crypto.randomBytes(32).toString('hex');

  const envContent = `PORT=5000
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=classbit_hrms
JWT_SECRET=${JWT_SECRET}
SMTP_USER=${SMTP_USER}
SMTP_PASSWORD=${SMTP_PASSWORD}
NODE_ENV=production
`;

  fs.writeFileSync('.env', envContent.trim() + '\n');

  console.log("\n✅ .env file created successfully!");
  console.log("👉 Now run: npm start");

  rl.close();
})();
