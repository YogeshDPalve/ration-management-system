import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
// configure dotenv
dotenv.config();

// initialize app
const app = express();

const port = process.env.PORT;
const server_url = process.env.SERVER_URL as string;
const mode = process.env.DEVELOPMENT_MODE;
app.listen(port, () => {
  console.log(
    chalk.underline.blue(
      `server running on ${server_url}${port} in ${mode} mode.`
    )
  );
});
