exports.psqlErrors = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(error);
  }
};

exports.handle500 = (error, request, response) => {
  response.statusSend(500);
};
