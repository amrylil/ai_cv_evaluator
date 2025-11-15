import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import fs from "fs";
import path from "path";
import { registry } from "./registry";

const openapiDir = path.join(__dirname);
fs.readdirSync(openapiDir).forEach((file) => {
  if (file.endsWith(".openapi.ts") && file !== "index.ts") {
    require(path.join(openapiDir, file));
  }
});

export function generateOpenApiSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "CV EVALUATIONS API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000/api/v1" }],
  });
}
