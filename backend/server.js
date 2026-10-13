import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./src/config/db.config.js";

const PORT = process.env.PORT || 2300;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`VaultLink Server listening on port ${PORT}`);
  });
};

startServer();

