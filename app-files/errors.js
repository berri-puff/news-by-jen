exports.invalidPaths = (req, res) => {
  res.status(400).send({ msg: "Bad Request" });
};

exports.customErrors = (err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } 
  else if (err.code === '23503'){
    res.status(404).send({msg:'Not Found'})
  }
  else {
    next(err);
  }
};
exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Interal server error :(" });
};
