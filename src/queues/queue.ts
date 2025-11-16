import { Queue } from "bullmq";
import IORedis from "ioredis";

const host = process.env.HOST_REDIS || "127.0.0.1";
const port = Number(process.env.PORT_REDIS) || 6379;

const connection = new IORedis({
  host,
  port,
});

export const evaluationQueue = new Queue("evaluation-queue", {
  connection,
});
