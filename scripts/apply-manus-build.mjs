// =============================================================================
// apply-manus-build.mjs
// =============================================================================
// Runs after `vite build`. Overwrites dist/public/index.html and copies the
// Manus pre-built assets into dist/public/assets/ so the homepage at "/" is
// served by the Manus-built React bundle (the version the user spent two
// weeks designing on wishcatalog-vbmeruzh.manus.space).
//
// The Express server (server/_core/vite.ts -> serveStatic) serves
// dist/public/ statically and falls back to index.html for unknown routes,
// which makes this a clean drop-in for SPA hosting.
//
// To remove this layer in the future, just delete the manus-build/ folder
// and remove the && node scripts/apply-manus-build.mjs from package.json's
// build script. Vite will then serve its own built React app again.
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const src = path.join(repoRoot, "manus-build");
const dest = path.join(repoRoot, "dist", "public");

if (!fs.existsSync(src)) {
  console.log("[apply-manus-build] manus-build/ not found — skipping (Vite output kept).");
  process.exit(0);
}

if (!fs.existsSync(dest)) {
  console.error(`[apply-manus-build] ERROR: ${dest} does not exist. Did vite build run?`);
  process.exit(1);
}

function copyRecursive(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
      console.log(`  copied  ${path.relative(repoRoot, d)}`);
    }
  }
}

console.log("[apply-manus-build] Overlaying Manus build onto dist/public/ ...");
copyRecursive(src, dest);

// Also copy to dist/manus-build/ so the runtime serveStatic() in vite.ts can
// find it via its location candidates even if dist/public/ overlay was missed
// by Railway's deploy image (e.g. due to caching).
const runtimeFallback = path.join(repoRoot, "dist", "manus-build");
console.log(`[apply-manus-build] Mirroring to ${runtimeFallback} ...`);
copyRecursive(src, runtimeFallback);

console.log("[apply-manus-build] Done. Homepage will serve the Manus build.");
