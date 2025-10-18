export default {
  apps: [
    {
      name: "whatsapp_service",
      script: "src/main.ts",
      interpreter: "bun",
      args: ["--watch"]
    }
  ]
}
