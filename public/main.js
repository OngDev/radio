appConfig = {
    YOUTUBE_API_URL: 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAoLqPULiJ7dIltlMArI08b6VOK6ECue8k&type=video'
}

window.onload = async() => {
    updateUI();
}

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
socket.on("connect", () => {
    // console.log(socket.id);
})

socket.on("playingVideo", async (data) => {
    // console.log(data);
    if (data.playingVideo) {
        let elementPlayingVideo = `<iframe id="video-iframe" src="https://www.youtube.com/embed/${data.playingVideo.youtubeVideoId}?autoplay=1&start=${data.playedTime}" allow="autoplay" allowfullscreen>`
        // let elementPlayingVideo = `<iframe id="video-iframe" src="https://youtu.be/${data.playingVideo.youtubeVideoId}?t=${data.playedTime}" frameborder="0" allowfullscreen>`
        document.getElementById('videoPlaying').innerHTML = elementPlayingVideo
        document.getElementById('titlePlayingVideo').innerHTML = `<h4>${data.playingVideo.title}</h4>`
        updateCount(data.playingVideo._id)
    }
})

function updateCount(id) {
    countLikeVideo(id).then(async (response) => {
        const user = await axios.get(`/user/me`);
        const { email } = user.data;
        let elementLike = ""
        let elementDislike = ""
        if (response.likes.findIndex(x => x.authorEmail == email) >= 0) {
            elementLike = `<h5><i class="like fas fa-thumbs-up" onclick="unlike('${id}')"></i> <span id="likeCount">${response.likes.length}</span> Like</h5>`
        }
        else elementLike = `<h5><i class="like fas fa-thumbs-up" onclick="like('${id}')"></i> <span id="likeCount">${response.likes.length}</span> Like</h5>`
    
        if (response.dislikes.findIndex(x => x.authorEmail == email) >= 0) {
            elementDislike = `<h5><i class="dislike fas fa-thumbs-down" onclick="unDislike('${id}')"></i> <span id="dislikeCount">${response.dislikes.length}</span> Dislike</h5>`
        }
        else elementDislike = `<h5><i class="dislike fas fa-thumbs-down" onclick="dislike('${id}')"></i> <span id="dislikeCount">${response.dislikes.length}</span> Dislike</h5>`

        let elementReactLike = `<div class="d-inline-flex justify-content-between">
            ${elementLike}
            ${elementDislike}
        </div>`;
        document.getElementById("reactLike").innerHTML = elementReactLike;
    });
}