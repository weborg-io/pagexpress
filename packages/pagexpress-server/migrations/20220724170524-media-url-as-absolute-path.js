module.exports = {
  async up(db) {
    await db
      .collection('media')
      .find({})
      .forEach(item => {
        const [baseMediaPathPart, getImagePathPart, mediaId] = item.url
          .split('/')
          .slice(-3);

        db.collection('media').update(
          {
            _id: item._id,
          },
          {
            $set: {
              url: `/${baseMediaPathPart}/${getImagePathPart}/${mediaId}`,
            },
          }
        );
      });
  },

  async down(db) {
    await db
      .collection('media')
      .find({})
      .forEach(item => {
        const [baseMediaPathPart, getImagePathPart, mediaId] = item.url;
        const imagePath = `${baseMediaPathPart}/${getImagePathPart}/${mediaId}`;

        db.collection('media').update(
          {
            _id: item._id,
          },
          {
            $set: {
              url: `http://localhost:4000/${imagePath}`,
            },
          }
        );
      });
  },
};
