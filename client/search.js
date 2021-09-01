/** @format */

const baseURL = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAoLqPULiJ7dIltlMArI08b6VOK6ECue8k&type=video';

const form = document.querySelector('#form-search');
const searchValue = document.querySelector('#search-video');

searchValue.oninput = (e) => {
	searchValue.value = e.target.value;
};

const searchVideo = (value) => {
	$.ajax({
		type: 'GET',
		url: baseURL,
		data: { q: value },
		success: function (data) {
			renderListVideo(data);
			console.log(data);
		},
		error: function (err) {
			console.log(err);
		},
	});
};
form.onsubmit = async (e) => {
	e.preventDefault();
	searchVideo(searchValue.value);
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
