/**
 * GitHub API helpers — чтение и запись content.json
 */

const REPO = process.env.GITHUB_REPO || "dancekilla1999-gif/Soul-website";
const TOKEN = process.env.GITHUB_TOKEN || "";
const FILE_PATH = "src/data/content.json";

async function gh(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  return res;
}

export async function getContentFile(): Promise<{
  content: Record<string, unknown>;
  sha: string;
}> {
  const res = await gh(`/contents/${FILE_PATH}?ref=main`);
  if (!res.ok) {
    throw new Error(`GitHub read failed: ${res.status}`);
  }
  const data = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return { content: JSON.parse(decoded), sha: data.sha };
}

export async function saveContentFile(
  content: Record<string, unknown>,
  sha: string,
  message: string
): Promise<void> {
  const body = JSON.stringify(content, null, 2);
  const encoded = Buffer.from(body, "utf-8").toString("base64");

  const res = await gh(`/contents/${FILE_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: encoded,
      sha,
      branch: "main",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${err}`);
  }
}
