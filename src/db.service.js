module.exports = {
  all: async function all(query, db, params) {
    return new Promise(function (resolve, reject) {
      db.all(query, params && params, function (err, rows) {
        if (err) { return reject(err); }
        resolve(rows);
      });
    });
  },
  run: async function all(query, db, params) {
    return new Promise(function (resolve, reject) {
      db.run(query, params && params, function (err) {
        if (err) { return reject(err); }
        resolve(this);
      });
    });
  },
  get: async function all(query, db, params) {
    return new Promise(function (resolve, reject) {
      db.get(query, params && params, function (err, rows) {
        if (err) { return reject(err); }
        resolve(rows);
      });
    });
  },
};