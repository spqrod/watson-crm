const jwt = require("jsonwebtoken");

function authorizeToken (req, res, next) {
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];
    const token = req.cookies["token"];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, username) => {
        if (error) return res.sendStatus(403);
        // req.username = username;
        next();
    });
}

module.exports = authorizeToken;