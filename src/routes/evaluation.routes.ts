import { Router } from "express";
import multer from "multer";
import { EvaluationHandler } from "../features/cv_evaluations/handlers/evaluation.handler";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), EvaluationHandler.upload);

router.post("/:id/evaluate", EvaluationHandler.runEvaluation);

router.get("/result/:id", EvaluationHandler.getResult);

export default router;
