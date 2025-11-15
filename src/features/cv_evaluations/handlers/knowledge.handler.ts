import { Request, Response } from "express";
import { createKnowledgeRequestSchema } from "../dtos/knowledge.dto";
import { KnowledgeService } from "../usecases/knowledge.usecase";
import { ApiResponse } from "../../../utils/apiResponse";

const service = new KnowledgeService();

export class KnowledgeHandler {
  static create = async (req: Request, res: Response) => {
    try {
      const dto = createKnowledgeRequestSchema.parse(req.body);
      const created = await service.create(dto);
      return ApiResponse.success(
        res,
        created,
        "Knowledge created successfully",
        201
      );
    } catch (err: any) {
      return ApiResponse.error(res, err, 400);
    }
  };

  static getAll = async (_: Request, res: Response) => {
    try {
      const all = await service.getAll();
      return ApiResponse.success(res, all, "Knowledge fetched successfully");
    } catch (err: any) {
      return ApiResponse.error(res, err, 500);
    }
  };

  static search = async (req: Request, res: Response) => {
    try {
      const { q, topK } = req.query;
      if (!q || typeof q !== "string") {
        return ApiResponse.error(
          res,
          { message: "Missing query param 'q'" },
          400
        );
      }

      const result = await service.search(q, Number(topK) || 5);
      return ApiResponse.success(res, result, "Search completed");
    } catch (err: any) {
      return ApiResponse.error(res, err, 500);
    }
  };

  static getById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const found = await service.getById(id);
      if (!found) {
        return ApiResponse.error(res, { message: "Knowledge not found" }, 404);
      }
      return ApiResponse.success(res, found, "Knowledge fetched successfully");
    } catch (err: any) {
      return ApiResponse.error(res, err, 500);
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { content } = req.body;
      if (!content) {
        return ApiResponse.error(res, { message: "Content is required" }, 400);
      }

      const updated = await service.update(id, content);
      return ApiResponse.success(
        res,
        updated,
        "Knowledge updated successfully"
      );
    } catch (err: any) {
      return ApiResponse.error(res, err, 500);
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await service.delete(id);
      return ApiResponse.success(
        res,
        null,
        "Knowledge deleted successfully",
        204
      );
    } catch (err: any) {
      return ApiResponse.error(res, err, 500);
    }
  };
}
