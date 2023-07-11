module.exports = {
  apps: [
    {
      name: "JCWD-0206-02", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 2602,
      },
      time: true,
    },
  ],
};
