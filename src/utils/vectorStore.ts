import { pipeline } from "@huggingface/transformers";

let embedder: any;

export async function embedText(text: string): Promise<number[]> {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "sentence-transformers/all-MiniLM-L6-v2"
    );
  }

  const output = await embedder(text, {
    pooling: "mean",
    normalize: true,
  });

  let embedding: number[];

  if (output?.tolist) {
    embedding = output.tolist()[0];
  } else if (output?.data && Array.isArray(output.data[0])) {
    embedding = Array.from(output.data[0]);
  } else if (Array.isArray(output[0])) {
    embedding = output[0];
  } else {
    throw new Error("Format output model tidak dikenali");
  }

  if (!embedding || embedding.length === 0) {
    throw new Error(
      "Embedding kosong, kemungkinan model gagal memproses input"
    );
  }

  return embedding;
}
