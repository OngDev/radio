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

// Like
async function toggleLikeVideo(id) {
    try {
        await axios.post(`${ROUTE}/${id}/togglelike`);
    } catch (error) {
        console.log(error.message);
    }
}

// Dislike
async function toggleDislikeVideo(id) {
    try {
        await axios.post(`${ROUTE}/${id}/toggledislike`);
    } catch (error) {
        console.log(error.message);
    }
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

async function init() {
    await getAll().then((response) => {
        if (response.length == 0) return;
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
                        <div class="video-voting" id="video-voting-${res._id}">
                    ${updateCount(res._id, res.likes, res.dislikes)}
                </div>
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