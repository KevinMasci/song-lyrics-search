const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
const lyricsDiv = document.getElementById('lyrics');

form.addEventListener('submit', e => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a search term.');
        return;
    }
    searchSongs(query);
});

async function searchSongs(query) {
    resultsDiv.innerHTML = 'Searching...';
    lyricsDiv.innerHTML = '';
    try {
        const res = await fetch(`https://api.lyrics.ovh/suggest/${query}`);
        const data = await res.json();
        displaySongs(data.data);
    }
    catch (error) {
        resultsDiv.innerHTML = 'Error fetching results.';
    }
}

function displaySongs(songs) {
    resultsDiv.innerHTML = songs.slice(0, 10).map(song => `
        <div class="song">
            <strong>${song.title}</strong> - ${song.artist.name}
            <button data-artist="${song.artist.name}" data-title="${song.title}" class="get-lyrics">
                Get Lyrics
            </button>
        </div>
    `).join('');
}

resultsDiv.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const artist = e.target.getAttribute('data-artist');
        const title = e.target.getAttribute('data-title');
        getLyrics(artist, title);
    }
});

async function getLyrics(artist, title) {
    lyricsDiv.innerHTML = 'Fetching lyrics...';
    try {
        const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
        const data = await res.json();
        lyricsDiv.innerHTML = `
            <h2>${title} - ${artist}</h2>
            <pre>${data.lyrics || 'Lyrics not found.'}</pre>`;
    } catch (error) {
        lyricsDiv.innerHTML = 'Error fetching lyrics.';
    }
}