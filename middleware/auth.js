import jwt from 'jsonwebtoken';
import dotenv from 'dotenv' 


export default function verfyJwt(req, res, next) {
    const header = req.header("authorization");
    if (header) {
        const token = header.replace('Bearer ', '');
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                console.error('JWT error:', err.message);
            } else {
                req.user = decoded;
                console.log('Decoded token:', decoded);
            }
            next(); // Move next() inside the callback to wait for verification
        });
    } else {
        next();
    }
    
}