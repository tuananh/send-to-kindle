const request = require('request-promise-native')
const apiKey = process.env.MAILGUN_APIKEY
const auth = 'Basic ' + new Buffer(apiKey).toString('base64')
const baseUrl = process.env.MAILGUN_BASE_URL

function sendEmail(data) {
    return request.post({
        url: baseUrl,
        headers: {
            Authorization: auth
        },
        formData: data
    })
}

module.exports = { sendEmail }
