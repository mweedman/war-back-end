const statsServices = {
  dbCreateStats(db, userid) {
    return db('stats')
      .insert({userid})
      .returning('*')
      .then(([stats]) => stats)
      .catch(error => error);
  },
};

module.exports = statsServices;