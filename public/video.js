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

async function like(id) {
  await likeVideo(id);
  updateCount(id);
}

async function unlike(id) {
  await unlikeVideo(id);
  updateCount(id);
}

async function dislike(id) {
  await dislikeVideo(id);
  updateCount(id);
}

async function unDislike(id) {
  await unDislikeVideo(id);
  updateCount(id);
}

async function init() {
  await getAll().then((resposne) => {
    // console.log(resposne);
    if (resposne.length == 0) return console.log("Empty");
    let element = "";
    videoList = resposne;
    videoList.map((res) => {
      element += `<div id="item-video">
          <img class="rounded" src="${res.thumbnailUrl}" width="200" height="100%" />
          <div id="video-detail">
              <h5 class="title" style="color: #ffb347">${res.title}</h5>
              <small class="author">Add by: ${res.authorEmail}</small>
              <p>${res.views} lượt xem</p>
          </div>
      </div>`;
    });
    document.getElementById("list-video").innerHTML = element;
  });
}

init();
