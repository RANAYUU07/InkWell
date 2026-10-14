const required = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"];

for (const name of required) {
  if (!process.env[name]) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
}
