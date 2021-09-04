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

socket.on("playingVideo", (data) => {
    // console.log(data);
    if (data.playingVideo) {
        let elementPlayingVideo = `<iframe id="video-iframe" src="https://www.youtube.com/embed/${data.playingVideo.youtubeVideoId}?start=${data.playedTime}" frameborder="0" allowfullscreen>`
        // let elementPlayingVideo = `<iframe id="video-iframe" src="https://youtu.be/${data.playingVideo.youtubeVideoId}?t=${data.playedTime}" frameborder="0" allowfullscreen>`
        document.getElementById('videoPlaying').innerHTML = elementPlayingVideo
        document.getElementById('titlePlayingVideo').innerHTML = `<h4>${data.playingVideo.title}</h4>`
        countLikeVideo(data.playingVideo._id).then((response) => {
            // console.log(response);
            let elementReactLike = `<div class="d-inline-flex justify-content-between">
                <h5><i class="like fas fa-thumbs-up" onclick="like('${data.playingVideo._id}')"></i> <span id="likeCount">${response.likes}</span> Like</h5>
                <h5><i class="dislike fas fa-thumbs-down" onclick="dislike('${data.playingVideo._id}')"></i> <span id="dislikeCount">${response.dislikes}</span> Dislike</h5>
            </div>`;
            document.getElementById("reactLike").innerHTML = elementReactLike;
          });
    }
})