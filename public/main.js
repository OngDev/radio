var player;

const updateUI = async() => {
    const fullName = document.getElementById('full-name');
    const avatar = document.getElementById('avatar');

    try {
        const response = await axios.get(`/user/me`);
        const { nickname, picture, email: userEmail } = response.data;
        window.email = userEmail;
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
updateUI();

var socket = io();
var playingVideo = null;
socket.on("playingVideo", async(data) => {
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
    document.getElementById('titlePlayingVideo').innerHTML = `${data.playingVideo.title}`
        // updateCount(data.playingVideo._id);
    init();
})

socket.on("new-video-added", async() => {
    init();
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
    countLikeVideo(id)
        .then(async(response) => {
            const user = await axios.get(`/user/me`);
            const { email } = user.data;
            let upvoted = "",
                downvoted = "";
            if (response.likes.findIndex(x => x.authorEmail == email) >= 0) {
                upvoted = `<i class="fas fa-arrow-alt-up" onclick="unlike('${id}')></i>`
            } else {
                upvoted = `<i class="fas fa-arrow-alt-up" onclick="like('${id}')></i>`
            }
            if (response.dislikes.findIndex(x => x.authorEmail == email) >= 0) {
                downvoted = `<i class="fas fa-arrow-alt-down" onclick="unDislike('${id}')></i>`
            } else {
                downvoted = `<i class="fas fa-arrow-alt-down" onclick="unDislike('${id}')></i>`
            }

            let upvoteCounter = response.likes.length,
                downvoteCounter = response.dislikes.length;
            document.getElementById("video-voting").innerHTML = `
                ${upvoted}
                <h6 class="mx-1" style="padding-right: 0.4333em;">${upvoteCounter - downvoteCounter}</h6>
                ${downvoted}
            `;
        })
        .catch((err) => {
            console.log(err);
        });
}