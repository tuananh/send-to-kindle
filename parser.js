const request = require('request-promise-native')
const mercuryApiKey = process.env.MERCURY_APIKEY

function parse(url) {
    return request.get({
        url: `https://mercury.postlight.com/parser?url=${url}`,
        headers: {
            'x-api-key': mercuryApiKey
        }
    })
}

module.exports = { parse }
