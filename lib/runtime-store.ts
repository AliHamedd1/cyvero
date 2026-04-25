import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const runtimeDirectory = path.join(process.cwd(), "data", "runtime");

export const runtimeFiles = {
  communityReviews: "community-reviews.json",
  specialistConversations: "specialist-conversations.json",
  specialistRatings: "specialist-ratings.json",
} as const;

async function ensureRuntimeDirectory() {
  await mkdir(runtimeDirectory, { recursive: true });
}

function getFilePath(filename: string) {
  return path.join(runtimeDirectory, filename);
}

export async function readRuntimeCollection<T>(filename: string, fallback: T): Promise<T> {
  await ensureRuntimeDirectory();
  const filePath = getFilePath(filename);

  try {
    const contents = await readFile(filePath, "utf8");
    return JSON.parse(contents) as T;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code !== "ENOENT") {
      console.error(`Failed to read runtime file ${filename}. Falling back to default data.`, error);
    }

    await writeRuntimeCollection(filename, fallback);
    return fallback;
  }
}

export async function writeRuntimeCollection<T>(filename: string, data: T) {
  await ensureRuntimeDirectory();
  const filePath = getFilePath(filename);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}
