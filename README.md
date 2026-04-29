```markdown
# 🎵 Lyrify

**Lyrify** is a simple and fast web application to search for song lyrics.  
Enter an artist or song title and get the lyrics instantly.

🌍 **Live Demo** : [lyrify.vercel.app](https://lyrify.vercel.app) *(à vérifier si déployé)*



## ✨ Features

- 🔍 **Instant lyrics search** – Type a song or artist and get results.
- 🎨 **Clean interface** – Focus on lyrics, no clutter.
- 📋 **Copy to clipboard** – One-click copy.
- 🕓 **Search history** – Recent searches are saved locally.
- 📱 **Responsive** – Works on mobile and desktop.
- 🚀 **Serverless** – Deployed on Vercel, no server to manage.



## 🛠️ Technologies

| Part        | Details                        |
|-------------|--------------------------------|
| Frontend    | HTML5, CSS3, JavaScript (vanilla) |
| Backend     | Node.js, Express (Vercel function) |
| API         | `axios` to fetch lyrics from external service |
| Hosting     | Vercel                         |
| Proxy       | Images loaded via `images.weserv.nl` |



## 📦 Installation (local dev)

1. **Clone the repo**
   ```bash
   git clone https://github.com/Randriamiandry/Lyrify-.git
   cd Lyrify-
```

1. Install dependencies
   ```bash
   npm install
   ```
2. Start development server
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000.



🗂️ Project Structure


.
├── api/
│   └── lyrics.js        # Vercel serverless function
├── public/
│   ├── index.html       # Main page
│   ├── script.js        # Frontend logic
│   └── style.css        # Styling
├── package.json
└── vercel.json          # Vercel config
```



🔗 Usage

1. Open the app.
2. Type a song title or artist name.
3. Press Enter or click the search button.
4. View lyrics, album image, song title, and artist.
5. Click Copy to copy lyrics.
6. Recent searches appear below for quick access.



🌐 API

The app uses an internal Vercel API endpoint that proxies an external lyrics service.

Method Endpoint Description
GET /api/lyrics?song=query Fetches lyrics for the given query

Example response:

```json
{
  "status": true,
  "data": {
    "response": {
      "title": "Song Title",
      "artist": "Artist Name",
      "lyrics": "Lyrics here...",
      "image": "url_to_album_art"
    }
  }
}
```


📄 License

MIT License. Feel free to use, modify, and distribute.


👤 Author

Athanasius (Randriamiandry)
github.com/Randriamiandry
