require('dotenv').config({ path: '.env' })

const http = require('http')
const url = require('url')
const fs = require('fs')
const tempy = require('tempy')
const { parse } = require('./parser')
const { sendEmail } = require('./email')
const { PORT = 3000 } = process.env

function parseQueryString(req) {
    const urlObj = url.parse(req.url, true)
    const qs = {}
    for (q in urlObj['query']) {
        qs[q] = urlObj['query'][q]
    }

    return qs
}

function reqHandler(req, res) {
    const qs = parseQueryString(req)
    if (!qs.url || !qs.email) {
        res.writeHead(400, { 'Content-Type': 'text/html' })
        res.write('url and email are required')
        res.end()
    } else {
        const { url, email } = qs
        parse(url)
            .then(JSON.parse)
            .then(({ title, content }) => {
                // use Readable Stream instead !?
                const fp = tempy.file({ extension: 'html' })
                fs.writeFileSync(
                    fp,
                    '<html><body>' + content + '</body></html>', // make amazon happy
                    'utf-8'
                )

                return sendEmail({
                    from: 'me@tuananh.org',
                    to: email,
                    subject: `send-to-kindle: ${title}`,
                    text: title,
                    attachment: [fs.createReadStream(fp)]
                }).then(() => res.end('ok'))
            })
            .catch(function(err) {
                console.log(err)
                res.end('not ok')
            })
    }
}

http.createServer(reqHandler).listen(PORT)
