const AUTH_CONFIG = {
  SALT_ROUNDS: 10,
  ACCESS_TOKEN_EXPIRY: {
    expiresIn: "5s",
  },
  REFRESH_TOKEN_EXPIRY: {
    expiresIn: "1h",
  },
  COOKIE: {
    path: "/",
    sameSite: "lax",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  },
};

module.exports = { AUTH_CONFIG };
