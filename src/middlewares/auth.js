import jsonwebtoken from "jsonwebtoken";

const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).send({ error: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "Malformatted token" });
  }

  try {
    const secret = process.env.SECRET;

    jsonwebtoken.verify(token, secret);

    next();
  } catch (error) {
    res.status(498).json({ error: "Invalid token" });
  }
};

export default checkToken;
