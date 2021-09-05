window.onload = async() => {
    updateUI();
}

var player;

const updateUI = async() => {
    const fullName = document.getElementById('full-name');
    const avatar = document.getElementById('avatar');
    const response = await axios.get(`/user/me`);
    const { nickname, picture } = response.data;

    const isAuthenticated = nickname && picture;

    document.getElementById("btn-login").style.visibility = isAuthenticated ? 'hidden' : 'visible';
    document.getElementById("btn-logout").style.display = isAuthenticated ? 'block' : 'none';

    if (nickname && picture) {
        fullName.innerHTML = nickname;
        avatar.src = picture;
        fullName.style.visibility = 'visible';
        avatar.style.visibility = 'visible';
    }
};

const socket = io();
socket.on("playingVideo", async(data) => {
    if (data.playingVideo) {
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
        document.getElementById('titlePlayingVideo').innerHTML = `<h4>${data.playingVideo.title}</h4>`
        updateCount(data.playingVideo._id)
        init(data.playingVideo);
    }
})

function onPlayerReady(event) {
    event.target.setVolume(100);
    event.target.playVideo();

}

function changeMute() {
    if (player.isMuted()) player.unMute();
    else {
        player.mute();
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
        let elementLike = ""
        let elementDislike = ""
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