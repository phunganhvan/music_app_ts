console.log("ok");

// logic cho alert 

const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    // console.log(closeAlert);
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
        return;
    })
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)
}

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

// button like
const likeButton = document.querySelector('[button-like]');
console.log(likeButton);
if (likeButton) {
    likeButton.addEventListener('click', function () {
        const songId = this.getAttribute('button-like');
        const isActive = this.classList.contains('active');
        // chứa hay không lớp 'liked'
        let a="";
        if(!isActive){
            a="yes";
        }else{
            a="no";
        }

        const link = `/songs/like/${a}/${songId}`;
        const option = {
            method: 'PATCH',
        }
        fetch(link, option)
            .then(response => response.json())
            .then(data => {
                // console.log('Success:', data);
                // Cập nhật số lượt thích trên giao diện
                const likeSpan = likeButton.querySelector('span');
                if (likeSpan && data.like !== undefined) {
                    likeSpan.innerHTML = ` ${data.like} yêu thích`;
                    likeButton.classList.toggle('active'); // Thêm lớp 'liked' để thay đổi giao diện nút
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

// end button like

