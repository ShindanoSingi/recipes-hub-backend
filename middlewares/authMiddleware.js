const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.userId;
        next();
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        })
    }
};


// const jwt = require('jsonwebtoken');
// const SECRET_KEY = process.env.SECRET_KEY;

// function AuthMiddleware(req, res, next) {
//     const authorization = req.headers.authorization;
//     if (!authorization) {
//         return res.status(401).json({
//             message: 'No Authorization Header'
//         })
//     }
//     try {
//         const token = authorization.split('Bearer ')[1];
//         if (!token) {
//             return res.status(401).json({
//                 message: 'Invalid Token Format'
//             })
//         }
//         const decode = jwt.verify(token, SECRET_KEY);
//         req.user = decode
//         next()
//     } catch (error) {
//         if (error instanceof jwt.TokenExpiredError) {
//             return res.status(401).json({
//                 message: 'Session Expired',
//                 error: error.message,
//             })
//         }
//         if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
//             return res.status(401).json({
//                 message: 'Invalid Token',
//                 error: error.message,
//             })
//         }
//         res.status(500).json({
//             message: 'Internal server Error',
//             error: error.message,
//             stack: error.stack
//         });
//     }
// }

// module.exports = AuthMiddleware