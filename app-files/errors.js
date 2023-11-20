exports.invalidPaths = (req, res) => {
  res.status(400).send({ msg: "bad request" });
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "42601") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Interal server error :(" });
};
