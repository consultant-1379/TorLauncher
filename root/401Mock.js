module.exports = function (app) {
    app.use("/rest", function (req, res) {
        res.send(401, "");
    });
};