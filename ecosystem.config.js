module.exports = {
  apps: [
    {
      name: "dscons-backend",
      script: "node_modules/.bin/tsx", // Chạy trực tiếp file server.ts bằng Node.js + tsx
      args: "server.ts",
      // Hoặc nếu dùng Bun trên VPS:
      // script: "bun",
      // args: "run server.ts",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
