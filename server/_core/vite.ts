import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Prefer Manus pre-built homepage if present. We try a few likely locations
  // because Railway's bundler may or may not copy non-tracked dirs into the
  // deploy image. Order: dist/public/manus-build, repo-root/manus-build, dist/manus-build.
  const manusCandidates = [
    path.resolve(distPath, "manus-build"),
    path.resolve(import.meta.dirname, "..", "manus-build"),
    path.resolve(import.meta.dirname, "manus-build"),
    path.resolve(import.meta.dirname, "..", "..", "manus-build"),
    path.resolve(process.cwd(), "manus-build"),
  ];
  const manusPath = manusCandidates.find(
    (p) => fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))
  );

  if (manusPath) {
    console.log(`[serveStatic] Serving Manus pre-built homepage from ${manusPath}`);
    // Manus assets and html win at root
    app.use(express.static(manusPath));
  } else {
    console.warn("[serveStatic] No manus-build/ found — falling back to Vite dist/public.");
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    if (manusPath) {
      const manusIndex = path.resolve(manusPath, "index.html");
      if (fs.existsSync(manusIndex)) {
        return res.sendFile(manusIndex);
      }
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
