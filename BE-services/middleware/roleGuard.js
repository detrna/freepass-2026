const roleGuard = (allowedRole) => {
  return (req, res, next) => {
    const user = req.user;
    console.log(user);
    if (user.role !== allowedRole)
      return res
        .status(403)
        .json({ messages: "User have no access to this route" });
    next();
  };
};

module.exports = { roleGuard };
