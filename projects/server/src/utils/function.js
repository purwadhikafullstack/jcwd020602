function errorResponse(res, err, instance) {
  if (err instanceof instance) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res.status(500).send({ message: "Internal Server Error" });
}
module.exports = { errorResponse };
