     
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../models/index.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

     
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, first_name, last_name } = req.body;

        console.log('Register attempt for:', email);      

             
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

             
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

             
        const user = await User.create({
            email,
            password_hash,
            first_name: first_name || '',
            last_name: last_name || '',
            role: 'student'
        });

             
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

             
        const userResponse = user.toJSON();
        delete userResponse.password_hash;

        res.status(201).json({
            token,
            user: userResponse
        });
    } catch (err) {
        console.error('Registration error:', err);
        next(err);
    }
});

     
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt for:', email);      

             
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

             
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

             
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

             
        const userResponse = user.toJSON();
        delete userResponse.password_hash;

        res.json({
            token,
            user: userResponse
        });
    } catch (err) {
        console.error('Login error:', err);
        next(err);
    }
});

     
router.get('/verify', async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        const userResponse = user.toJSON();
        delete userResponse.password_hash;

        res.json({ user: userResponse });
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
});

export default router;