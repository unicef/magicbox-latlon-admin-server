import {Pool} from 'pg'
// import Cursor from 'pg-cursor'
import * as config from '../config'
const pool_countries = new Pool(config.db_countries)

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool_countries.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

/**
 * Returns admin id per coordinates
 * @param  {array} coordinates lat and lon
 * @return {Object} admin
 */
exports.search = function(coordinates) {
  return new Promise((resolve, reject) => {
    pool_countries.connect((err, client, done) => {
      if (err) return reject(err)
      client.query(
        `select
        GID_0,NAME_0,
        GID_1, NAME_1,
        GID_2, NAME_2,
        GID_3, NAME_3,
        GID_4, NAME_4,
        GID_5, NAME_5
        from highest_level_admin ` +
      'WHERE ST_Within (ST_Transform (ST_GeomFromText (\'POINT(' +
      coordinates.lon + ' ' + coordinates.lat +
      ')\',4326),4326), highest_level_admin.geom);', [], (error, res) => {
        done()
        if (error) {
          return reject(error)
        } else {
          if (res.rows.length < 1) {
            return resolve(
              {error: {message: 'No results'}}
            )
          }
          console.log(res)
          let enriched_record = add_admin_id(
                                  remove_pesky_quote(res)
                                )
          resolve(
            Object.assign(enriched_record, coordinates)
          )
        }
      })
    })
  })
}

/**
 * Returns admin id per coordinates
 * @param  {Object} object admin
 * @return {Object} admin
 */
function remove_pesky_quote(object) {
  return Object.keys(object.rows[0]).reduce((h, key) => {
    if (object.rows[0][key]) {
      h[key] = object.rows[0][key].replace(/('|\s+)/g, '');
    }
    return h
  }, {});
}


/**
 * Returns admin id per coordinates
 * @param  {Object} shape_obj admin
 * @return {Object} admin
 */
function add_admin_id(shape_obj) {
  console.log(shape_obj)
  const IDs = Object.keys(shape_obj).filter(
    k => {
      return k.match(/^gid_\d+/i)
    }
  )
  const admin_ID = shape_obj[IDs.reverse()[0]]
  console.log(admin_ID)
  IDs.forEach(ID => {
    delete(shape_obj[ID])
  })
  shape_obj.admin_id = admin_ID + '_gadm36';
  return shape_obj;
}

// /**
//  * Returns admin id per coordinates
//  * @param  {Object} shape_obj admin
//  * @return {Object} admin
//  */
// function add_admin_id(shape_obj) {
//   let iso = shape_obj.iso.toLowerCase();
//   let ids = Object.keys(shape_obj).filter(k => {
//     return k.match(/^ID_\d+/i);
//   }).map(k => {
//     return shape_obj[k]
//   }).join('_')
//   let admin_id = [iso, ids, 'gadm2-8'].join('_');
//   shape_obj.admin_id = admin_id;
//   return shape_obj;
// }
