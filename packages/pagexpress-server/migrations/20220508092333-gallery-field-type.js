module.exports = {
  async up(db) {
    const galleryFieldType = await db
      .collection('fieldtypes')
      .findOne({ type: 'gallery' });

    if (!galleryFieldType) {
      await db.collection('fieldtypes').insertOne({
        type: 'gallery',
        description: 'Gallery data',
      });
    }
  },

  async down(db) {
    await db.collection('fieldtypes').findOneAndDelete({ type: 'gallery' });
  },
};
