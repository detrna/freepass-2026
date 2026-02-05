const AUTH_CONFIG = {
  SALT_ROUNDS: 10,
  ACCESS_TOKEN_EXPIRY: {
    expiresIn: "15m",
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

const PAYMENT_CONFIG = {
  EXPIRY: {
    duration: 60,
    unit: "minutes",
  },
};

module.exports = { AUTH_CONFIG, PAYMENT_CONFIG };
