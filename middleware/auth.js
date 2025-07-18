import jwt from 'jsonwebtoken'



const userAuth = async (req, res, next) => {
    const { token } = req.headers;
    console.log(">>> Token received:", token);

    if (!token) {
        return res.status(403).json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(">>> Token decoded:", decoded);

        if (decoded.id) {
            if (!req.body) req.body = {}; 
            req.body.userId = decoded.id;
            console.log(">>> userId attached to body:", decoded.id);
            next();
        } else {
            return res.status(403).json({ success: false, message: 'Invalid token structure (no ID)' });
        }

    } catch (err) {
        console.error(">>> JWT Verify Error:", err.message);
        return res.status(403).json({ success: false, message: err.message });
    }
};


export default userAuth