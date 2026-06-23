// Pushes a SQL migration to Supabase via the Management API.
// Usage: node scripts/push-migration.mjs <path-to-sql>
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const PROJECT_REF = "djftfdrlqufrkmnngqqq";

const sqlPath = process.argv[2];
if (!sqlPath) {
  console.error("Usage: node scripts/push-migration.mjs <path-to-sql>");
  process.exit(1);
}

const creds = JSON.parse(
  readFileSync(join(homedir(), ".claude", ".credentials.json"), "utf8")
);
const entry = Object.values(creds.mcpOAuth || {}).find((v) =>
  String(v.serverName || "").includes("supabase")
);
if (!entry?.accessToken) {
  console.error("No Supabase OAuth token found in ~/.claude/.credentials.json");
  process.exit(1);
}
if (entry.expiresAt && entry.expiresAt < Date.now()) {
  console.error(
    `Supabase token expired at ${new Date(entry.expiresAt).toISOString()}. Re-auth via /mcp.`
  );
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf8");

const res = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${entry.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  }
);

const text = await res.text();
if (!res.ok) {
  console.error(`HTTP ${res.status}:`, text);
  process.exit(1);
}
console.log("OK:", text || "(empty result — statements executed)");
