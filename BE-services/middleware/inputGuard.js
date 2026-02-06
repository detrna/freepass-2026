const inputGuard = (inputList, dataType) => {
  return (req, res, next) => {
    const keys = req.body;

    for (const [value] of keys) {
      if (
        !value || typeof value !== "string"
          ? toString(value).trim() === ""
          : value.trim() === ""
      )
        return res
          .status(400)
          .json({ message: `${inputList[i]} cannot be empty` });

      if (typeof value !== dataType[i])
        return res.status(400).json({
          message: `${inputList[i]} value must be a ${dataType[i]}`,
        });
    }
    next();
  };
};

module.exports = { inputGuard };
