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
const song = document.getElementById('aplayer')
if (song) {
    songData = song.getAttribute('data-song');
    if (songData) {
        // convert string to object - chuỗi json to object
        const song = JSON.parse(songData);
        const ap = new APlayer({
            container: document.getElementById('aplayer'),
            lrcType: 1,
            audio: [{
                name: song.title,
                artist: song.singerName,
                url: song.audio,
                cover: song.avatar,
                lrc: song.lyrics || "",
            }],
            autoplay: true,
        });
        let audioDuration
        ap.on('loadedmetadata', () => {
            // console.log('Duration:', ap.duration);
            audioDuration = ap.duration;
            setTimeout(() => {
                ap.on('ended', function () {
                    avatar.style.animationPlayState = 'paused'; // Dừng quay khi kết thúc nhạc

                    const link = `/songs/listen/${song._id}`;
                    const option = {
                        method: 'PATCH',
                        credentials: 'include'
                    }
                    fetch(link, option)
                        .then(response => response.json())
                        .then(data => {
                            // console.log('Success:', data);
                            const eInnerListenSpan = document.querySelector('.singer-detail .inner-listen span');
                            if (eInnerListenSpan && data.listen !== undefined) {
                                eInnerListenSpan.innerHTML = `${data.listen} lượt nghe`;
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                });
            }, audioDuration * 1000 -5000); // Chuyển đổi giây thành mili giây
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
}


// end aplayer

// button like
const likeButton = document.querySelector('[button-like]');
// console.log(likeButton);
if (likeButton) {
    likeButton.addEventListener('click', function () {
        const songId = this.getAttribute('button-like');
        const isActive = this.classList.contains('active');
        // chứa hay không lớp 'liked'
        let a = "";
        if (!isActive) {
            a = "yes";
        } else {
            a = "no";
        }

        const link = `/songs/like/${a}/${songId}`;
        const option = {
            method: 'PATCH',
            credentials: 'include'
        }
        fetch(link, option)
            .then(response => response.json())
            .then(data => {
                // console.log('Success:', data);
                // Cập nhật số lượt thích trên giao diện
                const likeSpan = likeButton.querySelector('span');
                if (likeSpan && data.like !== undefined) {
                    if (data.code == 200) {
                        likeSpan.innerHTML = ` ${data.like} yêu thích`;
                        likeButton.classList.toggle('active'); // Thêm lớp 'liked' để thay đổi giao diện nút
                        showToast(data.flash[0]);
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

// end button like

//button add favorite
const listFavoriteButton = document.querySelectorAll('[button-favorite]');
if (listFavoriteButton.length > 0) {
    listFavoriteButton.forEach(favoriteButton => {
        favoriteButton.addEventListener('click', function () {
            const songId = this.getAttribute('button-favorite');
            const isActive = this.classList.contains('active');
            // chứa hay không lớp 'liked'
            let a = "";
            if (!isActive) {
                a = "add";
            } else {
                a = "remove";
            }

            const link = `/songs/favorite/${a}/${songId}`;
            const option = {
                method: 'PATCH',
                credentials: 'include'
            }
            fetch(link, option)
                .then(response => response.json())
                .then(data => {
                    const favoriteSpan = favoriteButton.querySelector('span');
                    if (favoriteSpan !== undefined) {
                        // favoriteSpan.innerHTML = ` ${data.favorite} yêu thích`;
                        if (data.code == 200) {
                            favoriteButton.classList.toggle('active'); // Thêm lớp 'liked' để thay đổi giao diện nút
                            showToast(data.flash[0]);
                        }
                        else {
                            alert('Vui lòng đăng nhập để thêm bài hát yêu thích');
                        }

                    }
                })
                .catch((error) => {
                    console.error('Error:', error);

                });
        });
    });
}
// end button add favorite

// thông báo ra giao diện
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 2500);
}


// suggest search header
const boxSearch = document.querySelector('.box-search');
if (boxSearch) {
    const inputSearch = boxSearch.querySelector('input[name="keyword"]');
    const suggestBox = boxSearch.querySelector('.inner-suggest');
    inputSearch.addEventListener('keyup', function () {
        // const query = this.value.trim();
        const keyword = inputSearch.value;
        // console.log(keyword);
        const link = `/search/suggest?keyword=${encodeURIComponent(keyword)}`;
        // an toàn cho url

        fetch(link)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                if (data.code === 200) {
                    // console.log(data);
                    const songs = data.songs;
                    if (songs.length > 0) {
                        suggestBox.classList.add('show');

                        const htmls = songs.map(song => {
                            return `
                                <a href="/songs/detail/${song.slug}" class="inner-item">
                                    <div class="inner-image">
                                        <img src="${song.avatar}" alt="${song.title}">
                                    </div>
                                    <div class="inner-info">
                                        <div class="inner-title">${song.title}</div>
                                        <div class="inner-singer">
                                            <i class="fa-solid fa-microphone-lines"></i> ${song.singerInfo.fullName}
                                        </div>
                                    </div>
                                </a>
                            `;
                        });
                        // console.log(htmls);
                        const boxList = suggestBox.querySelector('.inner-list');
                        boxList.innerHTML = htmls.join(""); // join lại
                    } else {
                        suggestBox.classList.remove('show');
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    })
}
