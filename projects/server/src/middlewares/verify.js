const key = process.env["secret_key"];

const verify = (req, res, next) => {
  const secret = req.headers["x-secret-key"];
  if (secret != key) {
    return res.send("invalid key");
  }
  next();
};

module.exports = verify;
