import { Request, Response } from "express";
import { EvaluationService } from "../usecases/evaluations.usecase";
import { ApiResponse } from "../../../utils/apiResponse";
import { evaluationQueue } from "../../../queues/queue";

const service = new EvaluationService();

export class EvaluationHandler {
  static async upload(req: Request, res: Response) {
    try {
      const files = req.files as any;

      const cv = files?.cv?.[0];
      const project = files?.project?.[0];

      if (!cv || !project) {
        return ApiResponse.error(res, "CV and Project file are required", 400);
      }

      const result = await service.uploadDocuments(
        cv.path,
        cv.originalname,
        project.path,
        project.originalname
      );

      return ApiResponse.success(res, result, "Files uploaded", 201);
    } catch (err) {
      return ApiResponse.error(res, err, 500);
    }
  }

  static async getResult(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await service.getResult(id);
      return ApiResponse.success(res, result, "Evaluation result retrieved");
    } catch (err: any) {
      return ApiResponse.error(res, err, 404);
    }
  }

  static async runEvaluation(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await evaluationQueue.add("evaluate", {
        taskId: id,
      });

      return ApiResponse.success(
        res,
        { id, status: "queued" },
        "Evaluation queued"
      );
    } catch (err: any) {
      return ApiResponse.error(res, err, 500);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return ApiResponse.success(res, result, "All evaluations retrieved");
    } catch (err: any) {
      return ApiResponse.error(res, err, 500);
    }
  }
}
