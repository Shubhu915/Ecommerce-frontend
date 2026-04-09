const crypto = require('crypto');
const User = require('../models/User');
const EmailToken = require('../models/EmailVerificationToken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../services/emailService');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/token');

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, 'User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await EmailToken.create({
        userId: user._id,
        token: verificationToken
    });

    // Send verification email
    // For direct backend testing, we point to the API endpoint.
    // In production, this would point to your frontend URL.
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email?token=${verificationToken}`;
    const message = `Please verify your email by clicking: ${verificationUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification',
            message
        });
    } catch (error) {
        console.error('Email send failed:', error);
        // We don't throw error here to allow registration to complete, 
        // user can resend verification later.
    }

    res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification.'
    });
});

/**
 * @desc    Verify email
 * @route   GET /api/v1/auth/verify-email
 * @access  Public
 */
const verifyEmail = catchAsync(async (req, res) => {
    const { token } = req.query;

    if (!token) {
        throw new ApiError(400, 'Verification token is required');
    }

    const emailToken = await EmailToken.findOne({ token });
    if (!emailToken) {
        throw new ApiError(400, 'Invalid or expired verification token');
    }

    const user = await User.findById(emailToken.userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (user.isVerified) {
        return res.status(200).json({ success: true, message: 'Email already verified' });
    }

    user.isVerified = true;
    await user.save();
    await emailToken.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Email verified successfully'
    });
});



/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        throw new ApiError(401, 'Invalid credentials');
    }

    if (!user.isVerified) {
        throw new ApiError(401, 'Please verify your email to log in');
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token in secure cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        success: true,
        accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        }
    });
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
const logout = catchAsync(async (req, res) => {
    res.cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
const refreshToken = catchAsync(async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        throw new ApiError(401, 'No refresh token provided');
    }

    try {
        const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = generateToken(decoded.id);
        
        res.status(200).json({
            success: true,
            accessToken
        });
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
});

module.exports = {
    register,
    verifyEmail,
    login,
    logout,
    refreshToken,
    getMe
};
