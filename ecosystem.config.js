module.exports = {
  apps: [
    {
      name: "myapp",
      script: "app.js",    // <-- change this if your main file is server.js or index.js
      cwd: "/var/www/myapp",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
