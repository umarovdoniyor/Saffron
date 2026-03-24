module.exports = {
  apps: [
    {
      name: "BURAK-REACT",
      script: "yarn",
      args: "start:prod",
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
