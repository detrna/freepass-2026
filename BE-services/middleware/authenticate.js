const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken)
    return res.status(403).json({ message: "User not logged in" });

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
        "Postman will fetch /api/auth/refresh endpoint in the background, thus the session will be refreshed automatically. Please send the API request again",
      postmanNotes:
        "Normally, Front-end side will refetch the endpoint in the background after session refreshed. But, unfortunately Postman can't do such thing due to cookie set synchronazation issues. Furthermore, I decided to just keep it this way for clarity purposes",
    });
  }
};

module.exports = { authenticate };
