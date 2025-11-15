import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validate =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error: any) {
      const error_messages = error.issues.map((issue: any) => issue.message);
      return res.status(400).json({ errors: error_messages });
    }
  };
