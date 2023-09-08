const jwt = require("jsonwebtoken");

function authorizeToken (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, username) => {
        if (error) return res.sendStatus(403);
        req.username = username;
        next();
    });

}

module.exports = authorizeToken;

// module.exports = async (request, response, next) => {

//     try {
//         const token = await request.headers.authorization.split(" ")[1];
//         console.log("TOKEN = ", token);
//         const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");
//         console.log("DECODED TOKEN = ", decodedToken);
//         const user = await decodedToken;
//         request.user = user;
//         next();



        
//     } catch (error) {
//         console.log("catch");
//         response.status(401).json({
//             error: new Error("Invalid request!"),
//           });
          
//     }
    
// }
