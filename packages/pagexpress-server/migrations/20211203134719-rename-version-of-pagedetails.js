module.exports = {
  async up(db) {
    await db
      .collection('pagedetails')
      .updateMany({ version: { $exists: false } }, [{ $set: { version: 1 } }, { $unset: ['__v'] }]);
  },

  async down(db) {
    await db
      .collection('pagedetails')
      .updateMany({ version: { $exists: true } }, [{ $set: { __v: 1 } }, { $unset: ['version'] }]);
  },
};
