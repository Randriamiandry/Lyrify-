const axios = require('axios');

module.exports = async (req, res) => {
  // Configure CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only GET requests are allowed
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { song } = req.query;
    
    if (!song) {
      return res.status(400).json({
        status: false,
        message: 'Required "song" parameter'
      });
    }

    // Call to external API
    const apiUrl = `https://miko-utilis.vercel.app/api/lyrics?song=${encodeURIComponent(song)}`;
    const response = await axios.get(apiUrl, {
      timeout: 10000 // 10 second timeout
    });
    
    // Return the external API response
    res.status(200).json(response.data);
    
  } catch (error) {
    console.error('Lyrify API Error:', error.message);
    
    // Specific error handling
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        status: false,
        message: 'Request timeout'
      });
    }
    
    if (error.response) {
      // External API error
      return res.status(error.response.status).json({
        status: false,
        message: 'Lyrics service error'
      });
    }
    
    // Generic error
    res.status(500).json({
      status: false,
      message: 'Error while searching for lyrics'
    });
  }
};