const AUTH_CONFIG = {
  SALT_ROUNDS: 10,
  ACCESS_TOKEN_EXPIRY: {
    expiresIn: "15m",
  },
  REFRESH_TOKEN_EXPIRY: {
    expiresIn: "1h",
  },
  COOKIE: {
    sameSite: "lax",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  },
};

module.exports = { AUTH_CONFIG };
