// telegram.js: API for managing Telegram configurations and forwarding emails

const express = require('express');
const router = express.Router();
const { processEmail } = require('../mail2tg');

// In-memory storage for Telegram configurations (replace with DB in production)
const telegramConfig = {};

/**
 * Save Telegram configuration
 * @route POST /api/telegram/config
 */
router.post('/config', (req, res) => {
    const { userId, TELEGRAM_TOKEN, TELEGRAM_ID } = req.body;

    if (!userId || !TELEGRAM_TOKEN || !TELEGRAM_ID) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    telegramConfig[userId] = { TELEGRAM_TOKEN, TELEGRAM_ID };
    res.json({ message: 'Telegram configuration saved successfully' });
});

/**
 * Forward email to Telegram
 * @route POST /api/telegram/forward
 */
router.post('/forward', async (req, res) => {
    const { userId, email } = req.body;

    if (!userId || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const config = telegramConfig[userId];
    if (!config) {
        return res.status(404).json({ error: 'Telegram configuration not found for user' });
    }

    try {
        await processEmail(email, config);
        res.json({ message: 'Email forwarded to Telegram successfully' });
    } catch (error) {
        console.error('Error forwarding email to Telegram:', error);
        res.status(500).json({ error: 'Failed to forward email to Telegram' });
    }
});

module.exports = router;
