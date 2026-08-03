// Load local .env first so process.env picks up OPENAI_API_KEY,
// DATABASE_URL, etc. before any other import touches them. On Railway
// the variables are injected directly, so this no-ops in production.
import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

const app = express();
// Gzip API responses and static files — don't rely on the hosting
// proxy to compress.
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve attached assets (videos, images). Once the library has been
// mirrored to the bucket (npm run migrate:assets) and
// ATTACHED_ASSETS_FROM_BUCKET=true is set, requests redirect to the
// bucket instead — offloads bandwidth and lets the CDN handle Range.
// Otherwise, static files with a long cache: filenames include
// timestamps so the URL changes when the asset changes.
const assetsBucketBase = (process.env.OBJECT_STORAGE_PUBLIC_URL || '').replace(/\/+$/, '');
if (process.env.ATTACHED_ASSETS_FROM_BUCKET === 'true' && assetsBucketBase) {
  app.use('/attached_assets', (req, res) => {
    res.redirect(301, `${assetsBucketBase}/attached_assets${req.path}`);
  });
} else {
  app.use(
    '/attached_assets',
    express.static(path.resolve(process.cwd(), 'attached_assets'), {
      maxAge: '30d',
      immutable: true,
    }),
  );
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Unhandled error:", err);
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes.
  //
  // Default to production (static serving). Vite dev middleware
  // requires the source tree at client/src which isn't shipped to
  // Railway, so an unset NODE_ENV must NOT trigger it.
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use Railway's PORT environment variable, fallback to 5000 for local dev
  const port = parseInt(process.env.PORT || "5000", 10);
  
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
