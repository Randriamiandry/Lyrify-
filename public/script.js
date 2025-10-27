// Configuration
let searchHistory = JSON.parse(localStorage.getItem('lyricsSearchHistory')) || [];

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    resultsSection: document.getElementById('resultsSection'),
    albumImage: document.getElementById('albumImage'),
    imagePlaceholder: document.getElementById('imagePlaceholder'),
    songTitleResult: document.getElementById('songTitleResult'),
    artistNameResult: document.getElementById('artistNameResult'),
    lyricsText: document.getElementById('lyricsText'),
    copyLyricsBtn: document.getElementById('copyLyricsBtn'),
    historyList: document.getElementById('historyList'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    notification: document.getElementById('notification')
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
    setupEventListeners();
    elements.searchInput.focus();
});

// Event listeners setup
function setupEventListeners() {
    elements.searchBtn.addEventListener('click', searchLyrics);
    elements.searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && searchLyrics());
    elements.copyLyricsBtn.addEventListener('click', copyLyrics);
    elements.clearHistoryBtn.addEventListener('click', clearHistory);
    
    document.querySelectorAll('.example-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            elements.searchInput.value = tag.textContent;
            elements.searchInput.focus();
        });
    });
}

// Search lyrics via our Vercel API
async function searchLyrics() {
    const query = elements.searchInput.value.trim();
    if (!query) return showNotification('Please enter a search query', 'error');
    
    try {
        elements.searchBtn.disabled = true;
        showNotification('Searching...', 'info');
        
        // Call to our Vercel API (relative path)
        const response = await fetch(`/api/lyrics?song=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const apiData = await response.json();
        
        if (apiData.status && apiData.data?.response) {
            await displayResults(apiData.data.response);
            addToHistory(query);
            showNotification('Lyrics found!', 'success');
        } else {
            throw new Error(apiData.message || 'No lyrics found');
        }
        
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        elements.searchBtn.disabled = false;
    }
}

// Display results
async function displayResults(songData) {
    elements.resultsSection.style.display = 'block';
    elements.songTitleResult.textContent = songData.title || "Unknown title";
    elements.artistNameResult.textContent = songData.artist || "Unknown artist";
    
    if (songData.image) await loadAlbumImage(songData.image);
    elements.lyricsText.textContent = songData.lyrics || "No lyrics available.";
    
    elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Load album image
async function loadAlbumImage(imageUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
            elements.albumImage.src = imageUrl;
            elements.albumImage.style.display = 'block';
            elements.imagePlaceholder.style.display = 'none';
            resolve(true);
        };
        
        img.onerror = () => {
            // Simple image proxy
            const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl.replace(/^https?:\/\//, ''))}&w=200&h=200&fit=cover`;
            const proxyImg = new Image();
            
            proxyImg.onload = () => {
                elements.albumImage.src = proxyUrl;
                elements.albumImage.style.display = 'block';
                elements.imagePlaceholder.style.display = 'none';
                resolve(true);
            };
            
            proxyImg.onerror = () => {
                elements.imagePlaceholder.style.display = 'flex';
                resolve(false);
            };
            
            proxyImg.src = proxyUrl;
        };
        
        img.src = imageUrl;
    });
}

// Copy lyrics
function copyLyrics() {
    const lyrics = elements.lyricsText.textContent;
    
    navigator.clipboard.writeText(lyrics)
        .then(() => showNotification('Copied!', 'success'))
        .catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = lyrics;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Copied!', 'success');
        });
}

// History management
function addToHistory(query) {
    searchHistory.unshift({ query, timestamp: new Date().toISOString() });
    searchHistory = searchHistory.slice(0, 8);
    localStorage.setItem('lyricsSearchHistory', JSON.stringify(searchHistory));
    loadSearchHistory();
}

function loadSearchHistory() {
    elements.historyList.innerHTML = '';
    
    if (searchHistory.length === 0) {
        elements.historyList.innerHTML = '<div class="no-history">No recent searches</div>';
        return;
    }
    
    searchHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
        
        historyItem.innerHTML = `
            <div class="history-song">${item.query}</div>
            <div class="history-date">${formattedDate}</div>
        `;
        
        historyItem.addEventListener('click', () => {
            elements.searchInput.value = item.query;
            searchLyrics();
        });
        
        elements.historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    if (confirm('Clear all history?')) {
        searchHistory = [];
        localStorage.removeItem('lyricsSearchHistory');
        loadSearchHistory();
        showNotification('History cleared', 'success');
    }
}

// Notifications
function showNotification(message, type = 'info') {
    elements.notification.textContent = message;
    elements.notification.className = `android-notification ${type} show`;
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}