import { Router } from "express";
import { KnowledgeHandler } from "../features/cv_evaluations/handlers/knowledge.handler";

const router = Router();

router.post("/", KnowledgeHandler.create);
router.get("/", KnowledgeHandler.getAll);

router.get("/:id", KnowledgeHandler.getById);

router.put("/:id", KnowledgeHandler.update);
router.delete("/:id", KnowledgeHandler.delete);

export default router;
