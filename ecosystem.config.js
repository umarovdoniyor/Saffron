module.exports = {
  apps: [
    {
      name: "foodu-frontend",
      script: "serve",
      args: "-s dist -l 3000",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
    },
  ],
};
