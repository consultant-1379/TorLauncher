var fs = require('fs');
var filePath = 'data.json';

// create file if it does not exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
}

module.exports = function (app) {


    app.post('/rest/service/log', function (req, res) {
        var logs = req.body;

        for (var j = 0; j < logs.length; j++) {
            var log = JSON.stringify(logs[j], null, 4) + '\n';
            fs.appendFile(filePath, log, function (err) {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
        }

        res.send(201, 'Log Reported successfully');
    });

    app.get('/rest/service/retrieveLog', function (req, res) {

        var array = fs.readFileSync(filePath).toString().split('\n');

        array = array.slice(0, array.length - 1);

        res.send(200, array);
    });
};