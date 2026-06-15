import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json({ limit: "10mb" }));

  // API endpoints FIRST
  // Get content endpoint
  app.get("/api/content", async (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), "src", "data", "contentData.json");
      if (fs.existsSync(dataPath)) {
        const fileContent = await fs.promises.readFile(dataPath, "utf-8");
        return res.json(JSON.parse(fileContent));
      } else {
        return res.status(404).json({ error: "contentData.json not found" });
      }
    } catch (error: any) {
      console.error("Error reading contentData.json:", error);
      return res.status(500).json({ error: error.message || "Failed to read content" });
    }
  });

  // Save content endpoint
  app.post("/api/content", async (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), "src", "data", "contentData.json");
      const updatedContent = req.body;

      if (!updatedContent || typeof updatedContent !== "object") {
        return res.status(400).json({ error: "Invalid data payload" });
      }

      await fs.promises.writeFile(dataPath, JSON.stringify(updatedContent, null, 2), "utf-8");
      
      console.log("Successfully wrote updated portfolio content to contentData.json");
      return res.json({ success: true, message: "Content updated successfully" });
    } catch (error: any) {
      console.error("Error writing contentData.json:", error);
      return res.status(500).json({ error: error.message || "Failed to write content" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // Vite or static content serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite dev server middlewares
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CMS] Fullstack server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
