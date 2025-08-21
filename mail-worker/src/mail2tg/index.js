// mail2tg/index.js: Core functionality from mail2telegram integrated into cloud-mail

const axios = require('axios');

/**
 * Send a message to Telegram
 * @param {string} botToken - Telegram Bot Token
 * @param {string} chatId - Telegram Chat ID
 * @param {string} message - Message to send
 */
async function sendToTelegram(botToken, chatId, message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message,
        });
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
}

/**
 * Process and forward email to Telegram
 * @param {Object} email - Email object containing details
 * @param {Object} config - Configuration object with Telegram and OpenAI keys
 */
async function processEmail(email, config) {
    const { TELEGRAM_TOKEN, TELEGRAM_ID, OPENAI_API_KEY } = config;

    // Generate email summary using OpenAI (if API key is provided)
    let summary = '';
    if (OPENAI_API_KEY) {
        try {
            const openaiResponse = await axios.post('https://api.openai.com/v1/completions', {
                model: 'text-davinci-003',
                prompt: `Summarize the following email:\n\n${email.text || email.html}`,
                max_tokens: 100,
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
            });
            summary = openaiResponse.data.choices[0].text.trim();
        } catch (error) {
            console.error('Error generating email summary:', error);
        }
    }

    // Construct message
    const message = `Subject: ${email.subject}\nFrom: ${email.from}\nTo: ${email.to}\n\nSummary:\n${summary}`;

    // Send message to Telegram
    for (const chatId of TELEGRAM_ID.split(',')) {
        await sendToTelegram(TELEGRAM_TOKEN, chatId, message);
    }
}

module.exports = {
    sendToTelegram,
    processEmail,
};
