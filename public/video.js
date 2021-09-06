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

async function deleteVideo(id) {
    try {
        let result = await axios({
            url: ROUTE + `/${id}`,
            method: "DELETE",
        });
        return result.data;
    } catch (error) {
        console.error(error.message);
    }
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
    await getAll().then((response) => {
        if (response.length == 0) return console.log("Empty");
        let element = "",
            counter = 0;
        videoList = response;
        videoList.map((res) => {
            element +=
                (`<div class="videos-container__track-item" style="background: #181818">
                <div class="row" style="padding-bottom: 0.3333em;">
                    <div class="col-1 videos-container__track-no">${++counter}</div>
                    <div class="col-3 videos-container__track-image">
                        <img
                        src="${res.thumbnailUrl}"
                        class="thumbnail"
                        />
                    </div>
                    <div class="col-8 videos-container__track-info">
                        <div class="videos-container__track-info__video-name">
                        ${res.title}
                        </div>
                        <div class="videos-container__track-info__suggested">
                        Suggested by <strong>${res.authorEmail}</strong>
                        </div>` +
                    (window.email === 'admin@ongdev.com' ? `<button type="button" class="btn btn-danger btn-sm" onclick="deleteVideo('${res._id}')">Delete</button>` : '') +
                    `</div>
                </div>
            </div>`);
        });
        document.getElementById("videos-container__tracks").innerHTML = element;
    });
}