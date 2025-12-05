console.log("ok");

// APlayer 
const songData = document.getElementById('aplayer').getAttribute('data-song');
if (songData) {
    // convert string to object - chuỗi json to object
    const song = JSON.parse(songData);
    const ap = new APlayer({
        container: document.getElementById('aplayer'),
        audio: [{
            name: song.title,
            artist: song.singerName,
            url: song.audio,
            cover: song.avatar
        }],
        autoplay: true,
    });
    const avatar = document.querySelector('.inner-avatar img');
    ap.on('play', function () {
        avatar.style.animationPlayState = 'running'; // Bắt đầu quay khi phát nhạc
        // gán giá trị cho CSS animationPlayState thành 'running' để bắt đầu quay
    });
    ap.on('pause', function () {
        avatar.style.animationPlayState = 'paused'; // Dừng quay khi tạm dừng nhạc
    });
}



// end aplayer