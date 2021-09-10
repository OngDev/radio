var player;

const updateUI = async() => {
    const fullName = document.getElementById('full-name');
    const avatar = document.getElementById('avatar');

    try {
        const response = await axios.get(`/user/me`);
        const { nickname, picture, email: userEmail, id } = response.data;
        window.email = userEmail;
        window.userId = id;
        const isAuthenticated = nickname && picture;
        document.getElementById("btn-login").style.visibility = isAuthenticated ? 'hidden' : 'visible';
        document.getElementsByClassName("user-profile")[0].style.display = isAuthenticated ? 'block' : 'none';

        if (nickname && picture) {
            fullName.innerHTML = nickname;
            avatar.src = picture;
            fullName.style.visibility = 'visible';
            avatar.style.visibility = 'visible';
        }
    } catch (error) {
        document.getElementsByClassName("user-profile")[0].style.display = 'none';
        console.log(error.message);
    }
};
updateUI();

function updateCount(id, likes, dislikes) {
    const userId = window.userId
    let upvoted, downvoted;
    if (likes.findIndex(x => x === userId) !== -1) {
        upvoted = `<i class="fas fa-arrow-up q-m-u" onclick="toggleLikeVideo('${id}')"></i>`
    } else {
        upvoted = `<i class="fas fa-arrow-up q-m" onclick="toggleLikeVideo('${id}')"></i>`
    }
    if (dislikes.findIndex(x => x === userId) !== -1) {
        downvoted = `<i class="fas fa-arrow-down q-m-d" onclick="toggleDislikeVideo('${id}')"></i>`
    } else {
        downvoted = `<i class="fas fa-arrow-down q-m" onclick="toggleDislikeVideo('${id}')"></i>`
    }

    let upvoteCounter = likes.length,
        downvoteCounter = dislikes.length;
    const ret = `
                ${upvoted}
                <h5 style="padding-right: 0.4333em; font-weight: 300; padding-top: 10px;">${upvoteCounter - downvoteCounter}</h5>
                ${downvoted}
            `;
    if (window.playingVideo._id === id) {
        $(`#playing-video-voting`).html(ret);
    } else {
        $(`#video-voting-${id}`).html(ret);
    }
    return ret;
}

var socket = io();
socket.on("playingVideo", async(data) => {
    if (player === null || player === undefined) {
        player = new YT.Player('videoPlaying', {
            height: '390',
            width: '640',
            videoId: `${data.playingVideo.youtubeVideoId}`,
            enablejsapi: 1,
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'mute': 1,
                'start': `${data.playedTime}`,
            },
            events: {
                'onReady': onPlayerReady,
            }
        });
    } else {
        player.loadVideoById(`${data.playingVideo.youtubeVideoId}`);
    }
    window.playingVideo = data.playingVideo;
    document.getElementById('titlePlayingVideo').innerHTML = `${data.playingVideo.title}`
    updateCount(data.playingVideo._id, data.playingVideo.likes, data.playingVideo.dislikes);
    init();
})

socket.on("new-video-added", async() => {
    init();
});

socket.on("video-queue-item-update", ({ id, likes, dislikes }) => {
    updateCount(id, likes, dislikes)
})

function onPlayerReady(event) {
    event.target.setVolume(100);
    event.target.playVideo();

}

function changeMute() {
    const mutedBtn = document.getElementById('muted');
    if (player.isMuted()) {
        player.unMute();
        mutedBtn.innerHTML = `<i class="fas fa-volume"></i>`;
        document.getElementById('volume-control').value = 30;
    } else {
        player.mute();
        mutedBtn.innerHTML = `<i class="fas fa-volume-mute"></i>`;
        document.getElementById('volume-control').value = 0;
    }
}

function changeVolume(v) {
    player.setVolume(v);
    const mutedBtn = document.getElementById('muted');
    if (v == 0) {
        player.mute();
        mutedBtn.innerHTML = `<i class="fas fa-volume-mute"></i>`;
    } else {
        player.unMute();
        mutedBtn.innerHTML = `<i class="fas fa-volume"></i>`;
    }
}

const searchValue = document.querySelector('#search-input');

searchValue.oninput = async(e) => {
    await searchVideo(e.target.value);
};

const setLoading = (isLoading) => {
    if (isLoading) {
        $('#search-result').css('visibility', 'hidden');
        $('#loader').css('visibility', 'visible');
    } else {
        $('#loader').css('visibility', 'hidden');
        $('#search-result').css('visibility', 'visible');
    }
}

const searchVideo = async(value) => {
    try {
        setLoading(true);
        const response = await axios.get(`/video/search?keyword=${value}`)
        renderListVideo(response.data);
    } catch (error) {
        renderListVideo([]);
    } finally {
        setLoading(false);
    }
};

function renderListVideo(videos) {
    let videoItem = '';
    videos.map((item) => {
        videoItem += `
          <div class="video-item">
              <img 
                  src="${item.thumbnail.thumbnails[0].url}"
                  alt="" 
                  width="160px" height="90"
              >
              <div class="meta">
                  <button class="btn btn-dark add-btn" onclick="createVideo('${item.id}')">Add</button>
                  <div class="title">Duration: ${item.length ? item.length.simpleText : 'Chịu'} | ${item.title}</div>
              </div>
          </div>
          `;
    });
    $('#search-result').html(videoItem);
}

async function createVideo(youtubeVideoId) {
    const addBtns = document.getElementsByClassName('add-btn');
    for (btn of addBtns) {
        btn.disabled = true;
    }
    axios({
        url: '/video',
        method: 'POST',
        data: {
            youtubeVideoId,
        }
    }).then(() => {
        for (btn of addBtns) {
            btn.disabled = false;
        }
    }).catch(error => {
        for (btn of addBtns) {
            btn.disabled = false;
        }
        alert("Add cái khác giùm cái, trùng hoặc dài quá đó :((")
    })
}