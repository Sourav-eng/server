import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const regUser = async (req, res) => {
    try {
        console.log(">>> /register called");
        console.log(">>> req.body:", req.body);
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Something is missing Try agsin' })
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered. Please log in.' });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = { name, email, password: hashedPassword }
        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token, user: { name: user.name } })

    } catch (error) {
        console.log(">>> Registration error:", error.message);
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User not exist' })
        }
        const isMatched = await bcrypt.compare(password, user.password)
        if (isMatched) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token, user: { name: user.name } })
        } else {
            return res.json({ success: false, message: 'Invalid Data' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userCredit = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId)
        res.json({ success: true, credits: user.creditBalance, user: { name: user.name } })
    }
    catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export { regUser, loginUser, userCredit } 
