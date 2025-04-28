// importing packages
import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/user.routes";
import familyRoutes from "./Routes/family.routes";
import complaintRoutes from "./Routes/complaint.routes";
import rationRoutes from "./Routes/ration.routes";
import fpsRoutes from "./Routes/fps.routes";
// configure dotenv
dotenv.config();

// initialize app
const app = express();

// common middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

// generating routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/family-member", familyRoutes);
app.use("/api/v1/report", complaintRoutes);
app.use("/api/v1/ration", rationRoutes);
app.use("/api/v1/fps", fpsRoutes);

// importing some data from .env file
const port = process.env.PORT;
const server_url = process.env.SERVER_URL as string;
const mode = process.env.DEVELOPMENT_MODE;

app.listen(port, () => {
  console.log(
    chalk.bold.bgBlue.white(
      `server running on ${server_url}${port} in ${mode} mode.`
    )
  );
});
