import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { flow } from "./services/introspection";

const app = express();

app.use(express.json());

flow();

export default app;
