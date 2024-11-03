/*This module handles communication with the Flask backend for sentiment analysis.*/

const BACKEND_URL = 'https://sentiment-analysis-57rb.onrender.com/sentiment';

/* Sends a POST request to the Flask backend with the provided text for sentiment analysis.
@param {string} text - The text to be analyzed.
@returns {Promise<string>} - A promise that resolves to the sentiment analysis result.
@throws {Error} - If the request fails.
*/
export const analyzeSentiment = async (text) => {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error("Server responded with status: " + response.status);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error("Error fetching sentiment:", error);
        throw error;
    }
};