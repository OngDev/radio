/** @format */
const form = document.querySelector('#form-search');
const searchValue = document.querySelector('#search-video');

searchValue.oninput = (e) => {
    searchValue.value = e.target.value;
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
		<div class="item-video">
			<img src="https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDQnfzl1FDNNWAUfgjhMY0wZYRiug" alt="">
			<div class="meta">
				<span class="title">${item.snippet.title}</span>
				<button class="add-btn">Add</button>
			</div>
		</div>
		`;
    });
    $('#list-video').html(videoItem);
}