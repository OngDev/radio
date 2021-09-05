/** @format */
const form = document.querySelector("#form-search");
const searchValue = document.querySelector("#form-search-input");

window.onload = function () {};

searchValue.oninput = (e) => {
  searchValue.value = e.target.value;
};

const searchVideo = async (value) => {
  try {
    const response = await axios.get(`/video/search?keyword=${value}`);
    renderListVideo(response.data);
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
  }
};

form.onsubmit = async (e) => {
  e.preventDefault();
  await searchVideo(searchValue.value);
};

function renderListVideo(video) {
  let videoItem = "";
  video.items.map((item) => {
    videoItem += `
		<div class="item-video">
			<img src="https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDQnfzl1FDNNWAUfgjhMY0wZYRiug" alt="">
			<div class="meta">
				<span class="title">${item.snippet.title}</span>
				<button class="add-btn" onclick="createVideo('${item.id.videoId}')">Add</button>
			</div>
		</div>
		`;
  });
  $("#list-video").html(videoItem);
}

async function createVideo(youtubeVideoId) {
  axios({
    url: "/video",
    method: "POST",
    data: {
      youtubeVideoId,
    },
  })
    .then(() => {
      console.log("Success");
    })
    .catch((error) => {
      console.error(error.response.data.message);
      alert(error.response.data.message);
    });
}

// Update UI
window.addEventListener("load", (event) => {
    renderVideoHTML([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
});

function renderVideoHTML(video) {
  let videoItem = "";
  video.map((item) => {
    videoItem += `
    <div class="video__item">
    <div class="video__thumbnail">
      <img
        src="https://i.ytimg.com/vi/dfas/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDQnfzl1FDNNWAUfgjhMY0wZYRiug"
        alt=""
      />
    </div>
    <div class="video__info">
      <div class="video__title">
        <p>Cưới Thôi - Masiu x Masew</p>
        <div class="video__author">
          <em>Dinh Sy Hung,20-02-2022</em>
        </div>
      </div>
      <div class="video__data">
      <i class="like fas fa-thumbs-up text-primary"> 10</i>
      <i class="like fas fa-thumbs-down text-danger"> 20</i>
      <i class="view fas fa-eye text-secondary"> 100</i>
      </div>
    </div>
  </div>
		`;
  });
  $("#video-wait").html(videoItem);
  $("#video-recent").html(videoItem);
}


