// YouTube API video uploader using JavaScript/Node.js
// You can find the full visual guide at: https://www.youtube.com/watch?v=gncPwSEzq1s
// You can find the brief written guide at: https://quanticdev.com/articles/automating-my-youtube-uploads-using-nodejs
//
// Upload code is adapted from: https://developers.google.com/youtube/v3/quickstart/nodejs

const fs = require('fs');
const assert = require('assert')
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const TOKEN_PATH = './' + 'client_oauth_token.json';
const Data = require('./videos.json')
const data = require('./data.json')

// video category IDs for YouTube:
const categoryIds = {
    Entertainment: 24,
    Education: 27,
    ScienceTechnology: 28,
    TravelEvents: 19,
    News: 25
}


const Upload = async ({ title, description, videoFilePath, thumbFilePath, tag }, callback) => {
    assert(fs.existsSync(videoFilePath))
    assert(fs.existsSync(thumbFilePath))
    fs.readFile('./client_secret.json', async (err, content) => {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        await authorize(JSON.parse(content), async (auth) => {
            const response = await uploadVideo(auth, title, description, videoFilePath, thumbFilePath, tag)
            callback(response)
        })
    });
}

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function uploadVideo(auth, title, description, videoFilePath, thumbFilePath, tag) {
    try {
        const service = google.youtube('v3')
        const response = await service.videos.insert({
            auth: auth,
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title,
                    description,
                    tags: tag,
                    categoryId: categoryIds.News,
                    defaultLanguage: 'en',
                    defaultAudioLanguage: 'en'
                },
                status: {
                    privacyStatus: "private"
                },
            },
            media: {
                body: fs.createReadStream(videoFilePath)
            },
        })
        const thumbNail = await service.thumbnails.set({
            auth: auth,
            videoId: response.data.id,
            media: {
                body: fs.createReadStream(thumbFilePath)
            },
        })
        return { response, thumbNail };
    } catch (error) {
        console.log('error', error);
        return { success: false }
    }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback) {
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    fs.readFile(TOKEN_PATH, function (err, token) {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client)
    })
}

async function deploy() {
    for (let index = 1; index < 1; index++) {
        const element = Data[index];
        element.description = data.newstitle[index].description
        Upload(element, function (result) {
            console.log("final result", result)
        });
    }
}

deploy();



