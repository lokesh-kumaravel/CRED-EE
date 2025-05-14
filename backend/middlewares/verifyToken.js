const { expressjwt: jwt } = require("express-jwt");
const db = require("../models");

const secret = process.env.SECRET;

const verifyToken = () => {
  return [
    // authenticate JWT token and attach decoded token to request as req.auth
    jwt({ secret, algorithms: ["HS256"] }),

    // attach full user record to request object
    async (req, res, next) => {
      // get user with id from token 'sub' (subject) property
      const user = await db.User.findByPk(req.auth.sub); // <- changed req.user.sub to req.auth.sub

      // check if user exists
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // authentication successful
      req.user = user.get(); // attach the full user object
      next();
    },
  ];
};

module.exports = verifyToken;
