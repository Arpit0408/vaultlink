const isHttpsProd = process.env.NODE_ENV === "production" && process.env.APP_URL?.startsWith("https");

export const cookieOptions = {
  httpOnly: true,
  secure: Boolean(isHttpsProd),
  sameSite: isHttpsProd ? "None" : "Lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:2300",
  "https://urlshortner-nu-ten.vercel.app",
];
