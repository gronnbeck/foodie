var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/foodie');

var Location = mongoose.model('locations', {
  name: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

var app = express();

app.post('/locations', function(req, res) {
  var body = req.body;
  console.log(body);
  var location = new Location(body);
  location.save(function(err) {
    if (err) return res.status(500).send({ success: false, err: err });
    return res.send({ success: true });
  });
});

app.get('/locations', function(req, res) {
  Location.find({}).exec(function(err, docs) {
    if (err) return res.status(500).send({ success: false, err: err });
    var locations = _.chain(docs)
    .map(function(doc) {
      return {
        name: doc.name,
        address: doc.address,
        lat: doc.lat,
        lng: doc.lng
      }
    })
    .reject(function(doc) {
      return _.isEmpty(doc) || doc.name == null || doc.address == null ||
      doc.lat == null || doc.lng == null;
    })
    .value();
    return res.send(locations);
  });
});

module.exports = app;
