const {url, login, password, protocol, timeout, comment_url} = require('./config');
const request = require('request');
const express = require("express");
const app = express();
const BP = require('bp-api');
const bp = new BP(url, login, password, protocol, timeout);

app.use(express.json());

app.post('/', function (req, res) {
    switch (req.body.hook.event) {
        case 'record.updated':
            request(
                comment_url,
                async (err, response, body) => {
                    if (err) return res.status(500).send({ message: err });
                    const {payload} = req.body;
                    const content = JSON.parse(body);
                    bp.patchRecord(11, payload.recordId, {
                        '3': content.value
                    })
                }
            );
            break;
        case 'record.created':
            const {timestamp, payload} = req.body;
            bp.postRecord(12, {
                '2': timestamp,
                '3': [{
                    "catalogId": payload.catalogId,
                    "recordId": payload.recordId
                }],
                '4': payload.values[3]
            });
            break;
    }
});
app.listen(8000);