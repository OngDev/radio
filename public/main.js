window.onload = async() => {
    updateUI();
}

var player;

const updateUI = async() => {
    const fullName = document.getElementById('full-name');
    const avatar = document.getElementById('avatar');

    try {
        const response = await axios.get(`/user/me`);
        const { nickname, picture } = response.data;

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
        console.log(error);
    }
};

var socket = io();
var playingVideo = null;
socket.on("playingVideo", async(data) => {
    if (data.playingVideo) {
        playingVideo = data.playingVideo;
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

        document.getElementById('titlePlayingVideo').innerHTML = `<h4>${data.playingVideo.title}</h4>`
            // updateCount(data.playingVideo._id);
        init(data.playingVideo);
    }
})

socket.on("new-video-added", async() => {
    init(playingVideo);
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
    } else {
        player.mute();
        mutedBtn.innerHTML = `<i class="fas fa-volume-mute"></i>`;
    }
}
// var done = false;

// function onPlayerStateChange(event) {
//     if (event.data == YT.PlayerState.PLAYING && !done) {
//         setTimeout(stopVideo, 6000);
//         done = true;
//     }
// }

// function stopVideo() {
//     player.stopVideo();
// }

function updateCount(id) {
    countLikeVideo(id).then(async(response) => {
        const user = await axios.get(`/user/me`);
        const { email } = user.data;
        let elementLike = "";
        elementDislike = ""
        if (response.likes.findIndex(x => x.authorEmail == email) >= 0) {
            elementLike = `<h5><i class="like fas fa-thumbs-up" onclick="unlike('${id}')"></i> <span id="likeCount">${response.likes.length}</span> Like</h5>`
        } else elementLike = `<h5><i class="like fas fa-thumbs-up" onclick="like('${id}')"></i> <span id="likeCount">${response.likes.length}</span> Like</h5>`

        if (response.dislikes.findIndex(x => x.authorEmail == email) >= 0) {
            elementDislike = `<h5><i class="dislike fas fa-thumbs-down" onclick="unDislike('${id}')"></i> <span id="dislikeCount">${response.dislikes.length}</span> Dislike</h5>`
        } else elementDislike = `<h5><i class="dislike fas fa-thumbs-down" onclick="dislike('${id}')"></i> <span id="dislikeCount">${response.dislikes.length}</span> Dislike</h5>`

        let elementReactLike = `<div class="d-inline-flex justify-content-between">
            ${elementLike}
            ${elementDislike}
        </div>`;
        document.getElementById("reactLike").innerHTML = elementReactLike;
    });
}