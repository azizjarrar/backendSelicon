const jwt = require('jsonwebtoken');
const ENV = require('dotenv')
ENV.config();
module.exports = (req, res, next) => {
    /**get token from header */
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    /******************* */
    //console.log(req.headers['authorization'])
    try {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
                const decoded = jwt.verify(token, process.env.tokenpassword)
                req.verified = decoded
                next()
            }
    } catch (error) {
        if ((error.name == "TokenExpiredError")) {
            return res.status(401).json({
                status: 401,
                message: error
            })
        } else {
            return res.status(401).json({
                status: res.statusCode,
                message: error.message
            })
        }
    }
}
