import {
  createKnowledgeRequestSchema,
  createKnowledgeResponseSchema,
  knowledgeResponseSchema,
  searchKnowledgeResponseSchema,
} from "../features/cv_evaluations/dtos/knowledge.dto";
import { registry } from "./registry";

registry.register("CreateKnowledgeRequest", createKnowledgeRequestSchema);
registry.register("CreateKnowledgeResponse", createKnowledgeResponseSchema);
registry.register("KnowledgeResponse", knowledgeResponseSchema);
registry.register("SearchKnowledgeResponse", searchKnowledgeResponseSchema);

registry.registerPath({
  method: "post",
  path: "/knowledge",
  tags: ["Knowledge"],
  summary: "Create new knowledge entry",
  request: {
    body: {
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateKnowledgeRequest" },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Knowledge created successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateKnowledgeResponse" },
        },
      },
    },
    400: { description: "Validation error" },
  },
});

// === GET /knowledge ===
registry.registerPath({
  method: "get",
  path: "/knowledge",
  tags: ["Knowledge"],
  summary: "Get all knowledge entries",
  responses: {
    200: {
      description: "List of all knowledge entries",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: { $ref: "#/components/schemas/KnowledgeResponse" },
          },
        },
      },
    },
  },
});

// === GET /knowledge/{id} ===
registry.registerPath({
  method: "get",
  path: "/knowledge/{id}",
  tags: ["Knowledge"],
  summary: "Get a knowledge entry by ID",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", format: "uuid" },
    },
  ],
  responses: {
    200: {
      description: "Knowledge entry retrieved successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/KnowledgeResponse" },
        },
      },
    },
    404: { description: "Knowledge not found" },
  },
});

// === PUT /knowledge/{id} ===
registry.registerPath({
  method: "put",
  path: "/knowledge/{id}",
  tags: ["Knowledge"],
  summary: "Update a knowledge entry",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", format: "uuid" },
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: { type: "string" },
            },
            required: ["content"],
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Knowledge entry updated successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/KnowledgeResponse" },
        },
      },
    },
    404: { description: "Knowledge not found" },
  },
});

// === DELETE /knowledge/{id} ===
registry.registerPath({
  method: "delete",
  path: "/knowledge/{id}",
  tags: ["Knowledge"],
  summary: "Delete a knowledge entry",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", format: "uuid" },
    },
  ],
  responses: {
    204: { description: "Knowledge entry deleted successfully" },
    404: { description: "Knowledge not found" },
  },
});
