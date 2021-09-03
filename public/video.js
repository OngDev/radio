const ROUTE = "/video";

let videoList = [];
let videoPlaying = {};

async function getAll() {
  let result = await axios({
    url: ROUTE + "/",
    method: "GET",
  });
  return result.data;
}

async function getById(id) {
  let result = await axios({
    url: ROUTE + "/" + id,
    method: "GET",
  });
  return result.data;
}

async function likeVideo(id) {
  let result = await axios({
    url: ROUTE + "/like/" + id,
    method: "POST",
  });
  return result.data;
}

async function unlikeVideo(id) {
  let result = await axios({
    url: ROUTE + "/like/" + id,
    method: "DELETE",
  });
  return result.data;
}

async function dislikeVideo(id) {
  let result = await axios({
    url: ROUTE + "/dislike/" + id,
    method: "POST",
  });
  return result.data;
}

async function unDislikeVideo(id) {
  let result = await axios({
    url: ROUTE + "/dislike/" + id,
    method: "DELETE",
  });
  return result.data;
}

async function countLikeVideo(id) {
  let result = await axios({
    url: ROUTE + "/count/" + id,
    method: "GET",
  });
  return result.data;
}

function like(id) {
  likeVideo(id)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

function unlike(id) {
  unlikeVideo(id)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

function dislike(id) {
  dislikeVideo(id)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

function unDislike(id) {
  unDislikeVideo(id)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function init() {
  await getAll().then((resposne) => {
    console.log(resposne);
    if (resposne.length == 0) return console.log("Empty");
    let element = "";
    videoList = resposne;
    videoList.map((res) => {
      element += `<div class="item-video">
            <img
              src="https://i.ytimg.com/vi/v3KGcyncXj8/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDQnfzl1FDNNWAUfgjhMY0wZYRiug"
              alt=""
            />
            <div class="meta">
              <span class="title">${res.title}</span>
              <div class="meta__icon">
                <i class="like far fa-thumbs-up"></i><span id="like${res._id}">0</span>
                <i class="dislike far fa-thumbs-down"></i><span id="dislike${res._id}">0</span>
              </div>
            </div>
          </div>`;
    });
    document.getElementById("list-video").innerHTML = element;
  });

  if (videoList.length == 0) return;

  videoPlaying = videoList[0];

  await getById(videoPlaying._id).then((response) => {
    console.log(response);
    let element = `<iframe
          id="video-iframe"
          width="420"
          src="https://www.youtube.com/embed/${response.youtubeVideoId}?controls=0&autoplay=1"
          frameborder="0"
          allow="accelerometer; autoplay; modestbranding; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
      >
      </iframe>`;
    document.getElementById("videoPlaying").innerHTML = element;
  });

  await countLikeVideo(videoPlaying._id).then((response) => {
    // console.log(response);
    document.getElementById("like" + videoPlaying._id).innerHTML =
      response.likes;
    document.getElementById("dislike" + videoPlaying._id).innerHTML =
      response.dislikes;
  });
}

init();
