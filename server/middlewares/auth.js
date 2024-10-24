const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader,'authheade')
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log(" sdf")
        console.log("token from my blogs request",token)
        console.log("sdf ")
        // Verify the token
        jwt.verify(token, process.env.jwt_secret, (err, user) => {
            if (err) {
                console.log('error',err)
                return res.json({ msg: "Invalid or expired token" });
            }
            req.user = user;
            next(); 
        });
    } else {
        return res.json({ msg: "No token provided, authorization denied" });
    }
};

module.exports = verifyToken;
