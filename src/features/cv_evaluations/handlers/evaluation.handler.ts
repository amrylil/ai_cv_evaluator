import { Request, Response } from "express";
import { EvaluationService } from "../usecases/evaluations.usecase";
import { ApiResponse } from "../../../utils/apiResponse";

const service = new EvaluationService();

export class EvaluationHandler {
  static async upload(req: Request, res: Response) {
    try {
      const file = (req as any).file;
      const result = await service.uploadCv(file.path, file.originalname);
      return ApiResponse.success(res, result, "CV uploaded successfully", 201);
    } catch (err: any) {
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
      const result = await service.runEvaluation(id);
      return ApiResponse.success(res, result, "Evaluation executed");
    } catch (err: any) {
      return ApiResponse.error(res, err, 500);
    }
  }
}
