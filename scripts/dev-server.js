#!/usr/bin/env node
// Simple static server to expose sibling repos for local development.
import http from "http";
import path from "path";
import { promises as fs } from "fs";
import { statSync } from "fs";

const root = path.resolve(process.cwd(), "..");
const port = process.env.PORT || 8080;

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(root, urlPath);
  try {
    if (statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    const data = await fs.readFile(filePath);
    res.writeHead(200);
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end("Not found");
  }
});
server.listen(port, () => {
  console.log(`dev server at http://localhost:${port}`);
});
