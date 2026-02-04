const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken)
    return res.status(403).json({ message: "User not logged in" });

  console.log(process.env.JWT_ACCESS_KEY);

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    req.user = decoded;
    next();
    return;
  } catch (err) {
    console.log("--- AUTH ERROR ---");
    console.log("Error Name:", err.name);
    console.log("Error Message:", err.message);

    return res.status(401).json({
      message: "Session has expired",
      code: "ACCESS_TOKEN_EXPIRED",
      postmanOnlyMessage:
        "Session will be refreshed and this endpoint is soon to be fetched again in the background. To view the result, please check the console (ctrl + alt + c)",
    });
  }
};

module.exports = { authenticate };
