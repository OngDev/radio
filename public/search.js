/** @format */
const form = document.querySelector('#form-search');
const searchValue = document.querySelector('#form-search-input');

searchValue.oninput = (e) => {
    searchValue.value = e.target.value;
};

window.onload = async() => {
    updateUI();
}

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

const searchVideo = async(value) => {
    try {
        const response = await axios.get(`/video/search?keyword=${value}`)
        renderListVideo(response.data);
        console.log(response.data);
    } catch (error) {
        console.error(error.message)
    }
};

form.onsubmit = async(e) => {
    e.preventDefault();
    await searchVideo(searchValue.value);
};

function renderListVideo(video) {
    let videoItem = '';
    video.items.map((item) => {
        videoItem += `
		<div class="video__item">
			<img 
                src="https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDQnfzl1FDNNWAUfgjhMY0wZYRiug" 
                alt="" 
                width="160px" height="auto"
            >
			<div class="meta">
                <button class="btn btn-dark add-btn" onclick="createVideo('${item.id.videoId}')">Add</button>
				<div class="title">${item.snippet.title}</div>
			</div>
		</div>
		`;
    });
    $('#video-recent').html(videoItem);
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
        console.log('Success')
        for (btn of addBtns) {
            btn.disabled = false;
        }
    }).catch(error => {
        console.error(error.message)
        alert("Add cái khác giùm cái :((")
    })
}