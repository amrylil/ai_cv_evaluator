import express, { Express, Request, Response, Router } from "express";
import evaluationRouter from "./routes/evaluation.routes";
import knowRouter from "./routes/knowledge.routes";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiSpec } from "./openapi";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const v1Router: Router = Router();
v1Router.use("/docs", swaggerUi.serve, swaggerUi.setup(generateOpenApiSpec()));

v1Router.use("/evaluations", evaluationRouter);
v1Router.use("/knowledge", knowRouter);

app.use("/api/v1", v1Router);

app.use(errorHandler);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("Server is healthy and running!");
});

export default app;
