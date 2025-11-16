import { Worker } from "bullmq";
import IORedis from "ioredis";
import { EvaluationService } from "../features/cv_evaluations/usecases/evaluations.usecase";

const evaluationService = new EvaluationService();

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

new Worker(
  "evaluation-queue",
  async (job) => {
    console.log("Processing job:", job.id);

    const taskId = job.data.taskId;

    await evaluationService.runEvaluation(taskId, );

    console.log("Job completed:", job.id);
  },
  {
    connection,
  }
);

console.log("Evaluation Worker is running...");
