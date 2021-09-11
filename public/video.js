const ROUTE = "/video";

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

function renderTracks(videos, eleId) {
    let element = "",
        counter = 0;
    videos.map((res) => {
        element +=
            (`<div class="videos-container__track-item" style="background: #181818;">
            <div class="row" style="margin: 0;">
                <div class="col-1 videos-container__track-no"  style="${window.playingVideo?._id === res._id? 'color: #ffb347': ''}">${++counter}</div>
                <div class="col-3 videos-container__track-image">
                    <img
                    src="${res.thumbnailUrl}"
                    class="thumbnail"
                    />
                    <div class="video-voting" id="${eleId}-${res._id}">
                ${updateCount(res._id, res.likes, res.dislikes, eleId)}
            </div>
                </div>
                <div class="col-8 videos-container__track-info">
                    <div class="videos-container__track-info__video-name">
                    ${res.title}
                    </div>
                    <div class="videos-container__track-info__suggested">
                    Suggested by <strong>${res.user.nickname}</strong>
                    </div>` +
                (window.email === 'admin@ongdev.com' ? `<button type="button" class="btn btn-danger btn-sm" onclick="deleteVideo('${res._id}')">Delete</button>` : '') +
                `</div>
            </div>
            
        </div>`);
    });
    document.getElementById(eleId).innerHTML = element;
}