import axios from 'axios';
import youtubeSearchApi from 'youtube-search-api';
import get from '../configs/env.config.js';
const YOUTUBE_API_URL = get('youtube_api_url');
const YOUTUBE_API_KEY = get('youtube_api_key');
export async function getYoutubeVideo(youtubeVideoId) {
    try {
        const response = await axios.get(`${YOUTUBE_API_URL}/videos?part=snippet,contentDetails&key=${YOUTUBE_API_KEY}&id=${youtubeVideoId}`)
        const { snippet: { title, thumbnails: { default: { url: thumbnailUrl } } }, contentDetails: { duration } } = response.data.items[0];
        return {
            title,
            thumbnailUrl,
            duration: extractDurationFromYoutube(duration)
        };
    } catch (error) {
        console.error(error.message)
        throw error;
    }
}

export async function searchYoutube(keyword) {
    try {
        const response = await youtubeSearchApi.GetListByKeyword(keyword);
        return response.items.slice(0, 5);
    } catch (error) {
        console.error(error)
        throw error;
    }
}

function extractDurationFromYoutube(durationStr) {
    // Prototype: PT2H12M38S
    const startIndex = 2
    const sIndex = durationStr.indexOf('S');
    const mIndex = durationStr.indexOf('M');
    const hIndex = durationStr.indexOf('H');

    const sec = durationStr.substring(mIndex !== -1 ? mIndex + 1 : startIndex, sIndex);
    const min = mIndex !== -1 ? durationStr.substring(hIndex !== -1 ? hIndex + 1 : startIndex, mIndex) : 0;

    if (hIndex !== -1 || min > 10) throw new Error("Too long video!");

    return (min * 60) + +sec;
}