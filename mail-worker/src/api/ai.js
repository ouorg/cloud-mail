// ai.js: API for managing AI configurations and dynamic AI service calls

const express = require('express');
const router = express.Router();
const axios = require('axios');

// In-memory storage for AI configurations (replace with DB in production)
const aiConfig = {};

/**
 * Save AI configuration
 * @route POST /api/ai/config
 */
router.post('/config', (req, res) => {
    const { userId, API_KEY, API_URL, MODEL } = req.body;

    if (!userId || !API_KEY || !API_URL || !MODEL) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    aiConfig[userId] = { API_KEY, API_URL, MODEL };
    res.json({ message: 'AI configuration saved successfully' });
});

/**
 * Call AI service dynamically
 * @route POST /api/ai/call
 */
router.post('/call', async (req, res) => {
    const { userId, prompt } = req.body;

    if (!userId || !prompt) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const config = aiConfig[userId];
    if (!config) {
        return res.status(404).json({ error: 'AI configuration not found for user' });
    }

    try {
        const response = await axios.post(config.API_URL, {
            model: config.MODEL,
            prompt,
            max_tokens: 100,
        }, {
            headers: {
                'Authorization': `Bearer ${config.API_KEY}`,
            },
        });
        res.json({ result: response.data });
    } catch (error) {
        console.error('Error calling AI service:', error);
        res.status(500).json({ error: 'Failed to call AI service' });
    }
});

module.exports = router;
