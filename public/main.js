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
    console.log(socket.id);
})

socket.on("playingVideo", (data) => {
    console.log(data);
})