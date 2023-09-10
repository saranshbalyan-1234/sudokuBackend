//default
import express from "express";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import parser from "body-parser";
//default

import morganBody from "morgan-body"; //logger
// import { validateToken } from "./Utils/Middlewares/jwt.js"; // logged request handler

//Routes
import userRoutes from "./User/Routes/userRoutes.js";
//Routes

//swagger
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerFile = require("./swagger.json");
//swagger

const app = express();

app.use(parser.json());

if (process.env.PRINT_LOGS == "true") {
  morganBody(app, {
    prettify: false,
    includeNewLine: true,
    timezone: "Asia/Kolkata",
    logReqHeaderList: ["x-project-id"],
    skip: (req, res) => {
      return (
        req.url.includes("management") ||
        req.url.includes("favicon") ||
        req.method === "OPTIONS"
      );
    },
  });
}


app.use(parser.urlencoded({ extended: false }));
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});

app.get("/health", (req, res) => {
  /*  #swagger.tags = ["Health"] */
  return res.json("Server is Working");
});

app.get("/favicon.ico", function (req, res) {
  res.sendStatus(204);
});

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/user", userRoutes);

app.use((req, res) => {
  return res.status(404).json({ error: "Endoind Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT ${process.env.PORT} PROCESS_ID ${process.pid}`);
});
