const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {

    try {
        const token = await request.headers.authorization.split(" ")[1];
        console.log("TOKEN = ", token);
        const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");
        // console.log("DECODED TOKEN = ", decodedToken);
        // const user = await decodedToken;
        // request.user = user;
        next();



        
    } catch (error) {
        console.log("catch");
        response.status(401).json({
            error: new Error("Invalid request!"),
          });
          
    }
    
}
