module.exports = {
  async up(db) {
    const imageFieldType = await db
      .collection('fieldtypes')
      .findOne({ type: 'image' });

    if (!imageFieldType) {
      await db.collection('fieldtypes').insertOne({
        type: 'image',
        description: 'Image data',
      });
    }
  },

  async down(db) {
    await db.collection('fieldtypes').findOneAndDelete({ type: 'image' });
  },
};
