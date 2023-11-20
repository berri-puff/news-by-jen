exports.invalidPaths = (req, res) => {
  res.status(400).send({ msg: "bad request" });
};



exports.customErrors = (err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: "Bad Request" });
    } else {
      next(err);
    }
  };
exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Interal server error :(" });
};
