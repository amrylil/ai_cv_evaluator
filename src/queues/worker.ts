import { Worker } from "bullmq";
import IORedis from "ioredis";
import { EvaluationService } from "../features/cv_evaluations/usecases/evaluations.usecase";

const evaluationService = new EvaluationService();

const host = process.env.HOST_REDIS || "127.0.0.1";
const port = Number(process.env.PORT_REDIS) || 6379;

const connection = new IORedis({
  host,
  port,
  maxRetriesPerRequest: null,
});

new Worker(
  "evaluation-queue",
  async (job) => {
    console.log("Processing job:", job.id);

    const taskId = job.data.taskId;

    await evaluationService.runEvaluation(taskId);

    console.log("Job completed:", job.id);
  },
  {
    connection,
  }
);

console.log("Evaluation Worker is running...");
