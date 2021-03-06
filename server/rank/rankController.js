var Rank = require('./rankModel').model;
var Error = require('../../config/error');
var fs = require('fs');


module.exports = {
    create: function(req, res) {
        if (!req.body.title || !req.body.icon || !req.body.maxPoints || !req.body.index)
            return res.status(400).json({ error: Error.invalidRequest });
        var rank = new Rank({
            title: req.body.title,
            index:     req.body.index,
            maxPoints: req.body.maxPoints,
            icon: {
                data: fs.readFileSync(req.body.icon),
                contentType: 'image/png'
            }
            
        });
        rank.save(rank, function(err, rank) {
            if (err) return res.status(409).json({ error: Error.unknownError });
            else if (rank) return res.status(201).json({ rank });
            else return res.status(400).json({ error: Error.createFail('rank') });
        });
    },
    get: function(req, res) {
        Rank.findOne({ _id: req.params.id }, function(err, rank) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (rank) return res.status(200).json({ rank });
            else return res.status(404).json({ error: Error.notFound('Rank') });
        });
    },
    getAll: function(req, res) {
        Rank.find(function(err, ranks) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else return res.status(200).json({ ranks });
        });
    },
    update: function(req, res) {
        Rank.findById(req.params.id, function(err, rank) {
            if (err) return res.status(409).json({ error: Error.alreadyExists('rank') });
            else if (!rank) return res.status(400).json({ error: Error.notFound('Rank') });
            else {
                rank.title = req.body.name ? req.body.name : rank.name;
                rank.icon.data = req.body.icon.data ? fs.readFile(req.body.icon) : rank.icon.data;
                rank.maxPoints = req.body.maxPoints ? req.body.maxPoints : rank.maxPoints;
                rank.index = req.body.index ? req.body.index : rank.index;
                rank.save(function (err, rank) {
                    if (err) return res.status(500).json({ error: Error.updateFail('rank') });
                    return res.status(200).json({ error: Error.updateSuccess('Rank') });
                });
            }
        });
    },
    delete: function(req, res) {
        Rank.findById(req.params.id).exec(function(err, rank) {
            if (err) return res.status(500).json({ error: Error.unknownError });
            else if (!rank) return res.status(404).json({ error: Error.notFound('Rank') });
            else {
                rank.remove(function(err) {
                    if (err) return res.status(500).json({ error: Error.unknownError });
                    else return res.status(200).json({ error: Error.deleteSuccess('Rank') });
                });
            }
        });
    }
};