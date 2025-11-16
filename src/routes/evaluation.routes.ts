import { Router } from "express";
import multer from "multer";
import { EvaluationHandler } from "../features/cv_evaluations/handlers/evaluation.handler";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "project", maxCount: 1 },
  ]),
  EvaluationHandler.upload
);

router.post("/:id/evaluate", EvaluationHandler.runEvaluation);
router.get("/all", EvaluationHandler.getAll);

router.get("/result/:id", EvaluationHandler.getResult);

export default router;
