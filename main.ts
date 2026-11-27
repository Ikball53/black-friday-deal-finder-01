// DealHound entry program — hands the site in for the make.fun
// black-friday-deal-finder-01 bounty.
//
// It copies app/ and screenshots/ from this repository into the output
// directory and writes /output/dossier.json with buildDossier from the
// kit's vendor/makefun-frontend.ts. Outside the grader, the environment
// variable MAKEFUN_OUTPUT_DIR stands in for /output. Node 22 standard
// library only; no network, no install, no build step.
import { cpSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function copyTree(name: string): void {
  const source = join(repoRoot, name);
  const target = join(outputDir, name);
  rmSync(target, { recursive: true, force: true });
  cpSync(source, target, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });

// Fail fast with a clear message if the site entry point is missing,
// instead of handing in a broken output directory.
if (!existsSync(join(repoRoot, "app", "index.html"))) {
  throw new Error("DealHound: app/index.html is missing from the repository");
}
copyTree("app");
copyTree("screenshots");

const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, "dossier.json"), dossier);
console.log(
  "DealHound entry written to " + outputDir +
  " (dossier " + dossier.length + " bytes, app " +
  statSync(join(outputDir, "app", "index.html")).size + " byte index)"
);
