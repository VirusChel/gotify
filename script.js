let audio = new Audio();

const songsDiv = document.getElementById('songs');
const now = document.getElementById('now');

document.getElementById('fileInput').addEventListener('change', (e) => {
    const files = e.target.files;
    songsDiv.innerHTML = '';

    for (let file of files) {
        const card = document.createElement('div');
        card.className = 'song';
        card.textContent = file.name;

        card.onclick = () => {
            const url = URL.createObjectURL(file);
            audio.src = url;
            audio.play();
            now.textContent = "🎵 " + file.name;
        };

        songsDiv.appendChild(card);
    }
});

document.getElementById('play').onclick = () => {
    if (audio.src) {
        if (audio.paused) audio.play();
        else audio.pause();
    }
};