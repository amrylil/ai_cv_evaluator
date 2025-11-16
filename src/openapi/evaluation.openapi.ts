import {
  evaluationResponseSchema,
  uploadDocumentsRequestSchema,
  uploadDocumentsResponseSchema,
} from "../features/cv_evaluations/dtos/evaluation.dto";
import { registry } from "./registry";

// Register schemas
registry.register("UploadDocumentsRequest", uploadDocumentsRequestSchema);
registry.register("UploadDocumentsResponse", uploadDocumentsResponseSchema);
registry.register("EvaluationResponse", evaluationResponseSchema);

// POST /evaluations/upload
registry.registerPath({
  method: "post",
  path: "/evaluations/upload",
  tags: ["Evaluations"],
  summary: "Upload CV and Project PDF files to create an evaluation task",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: { $ref: "#/components/schemas/UploadDocumentsRequest" },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Documents uploaded successfully, evaluation task created",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UploadDocumentsResponse" },
        },
      },
    },
    400: { description: "Validation error" },
  },
});

// POST /evaluations/{id}/evaluate
registry.registerPath({
  method: "post",
  path: "/evaluations/{id}/evaluate",
  tags: ["Evaluations"],
  summary: "Run evaluation on uploaded CV",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Evaluation completed successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/EvaluationResponse" },
        },
      },
    },
    404: { description: "Task not found" },
    500: { description: "Evaluation failed" },
  },
});

// GET /evaluations/result/{id}
registry.registerPath({
  method: "get",
  path: "/evaluations/result/{id}",
  tags: ["Evaluations"],
  summary: "Get evaluation result by Task ID",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Evaluation result retrieved successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/EvaluationResponse" },
        },
      },
    },
    404: { description: "Task not found" },
  },
});
