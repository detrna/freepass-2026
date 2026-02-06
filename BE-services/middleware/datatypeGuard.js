const datatypeGuard = (inputList, dataType) => {
  return (req, res, next) => {
    const keys = req.body;

    for (let i = 0; i < dataType.length; i++) {
      const value = keys[inputList[i]];

      if (
        !value || typeof value !== "string"
          ? toString(value).trim() === ""
          : value.trim() === ""
      )
        continue;

      if (typeof value !== dataType[i])
        return res.status(400).json({
          message: `${value} value must be a ${dataType[i]}`,
        });
    }
    next();
  };
};

module.exports = { datatypeGuard };
