import express from 'express'

const router = express.Router();
import bluebird from 'bluebird'
import search from './search'
import helper from './helper'
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({message: 'Instructions to come!'});
});

router.route('/coordinates/:coordinates')
  .get(function(req, res) {
    var coordinates = req.params.coordinates.split(',')
    .map(function(e) { return parseFloat(e); });

    if (coordinates.length % 2 === 1) {
      return res.json({
        error: 'Uneven number of coordinates. You must supply an even number of coordinates'
      });
    }

    if (coordinates.length > 500) {
      return res.json({
        error: 'Only 500 points allowed per request.'
      });
    }

    var pairs = helper.splitPairs(coordinates);

    bluebird.map(pairs, function(coords) {
      return search.search({
        lon: coords[1],
        lat: coords[0]
      });
    }).then(ary => {
      return res.json(ary);
    }, {concurrency: 2})
    .catch(err => {
      console.log(err)
      return res.json({error: `Exception: ${err}`})
    });
  });

module.exports = router;
