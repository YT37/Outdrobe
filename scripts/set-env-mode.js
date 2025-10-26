#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const mode = process.argv[2]; // 'dev' or 'prod'
const envPath = path.join(__dirname, "..", ".env");

if (!mode || (mode !== "dev" && mode !== "prod")) {
  console.error("Usage: node set-env-mode.js <dev|prod>");
  process.exit(1);
}

// Read current .env file
let envContent = "";
try {
  envContent = fs.readFileSync(envPath, "utf8");
} catch (error) {
  console.log(".env file not found, creating one...");
  envContent = `# All API keys are now handled by Firebase Functions
# No client-side API keys needed
VITE_FIREBASE_FUNCTION_URL="https://outdrobe.tech/api"

`;
}

// Update or add VITE_DEV flag
const devValue = mode === "dev" ? "true" : "false";
const viteDevRegex = /^VITE_DEV=.*$/m;

if (viteDevRegex.test(envContent)) {
  // Update existing VITE_DEV line
  envContent = envContent.replace(viteDevRegex, `VITE_DEV=${devValue}`);
} else {
  // Add VITE_DEV line
  envContent += `VITE_DEV=${devValue}\n`;
}

// Write updated content back to .env
try {
  fs.writeFileSync(envPath, envContent, "utf8");
  console.log(`✅ Set VITE_DEV=${devValue} (${mode} mode)`);
} catch (error) {
  console.error("❌ Error writing .env file:", error.message);
  process.exit(1);
}
