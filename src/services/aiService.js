const axios = require('axios');
const ApiError = require('../utils/ApiError');

/**
 * Parses natural language search query into structured filters using AI
 * @param {string} query - The user's search string (e.g., "red shoes under 2000")
 * @returns {Object} Structured JSON containing filters
 */
const parseSearchQuery = async (query) => {
    if (!process.env.AI_API_KEY) {
        return null; // Fallback to basic search if no key
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: process.env.AI_MODEL || 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `You are an AI search assistant for an e-commerce store. 
                    Convert the user's natural language query into a structured JSON filter.
                    Supported attributes: name (string), color (string), maxPrice (number), minPrice (number), category (string), gender (string).
                    Output ONLY valid JSON. If an attribute isn't found, omit it.`
                },
                {
                    role: 'user',
                    content: query
                }
            ],
            temperature: 0
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.AI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error('AI Parsing failed:', error.message);
        return null; // Graceful fallback
    }
};

module.exports = {
    parseSearchQuery
};
