const { Page } = require('../models/Page');
const { PageDetails } = require('../models/PageDetails');
const R = require('ramda');
const { ObjectId } = require('mongoose').Types;

const componentUsage = async (req, res, next) => {
  const { componentId } = req.params;

  try {
    const pageDetailsWithTargetComponent = await PageDetails.find({
      'components.componentPatternId': { $eq: ObjectId(componentId) },
    }).exec();
    const pages = await Page.find({
      _id: {
        $in: R.uniq(
          pageDetailsWithTargetComponent.map(singlePageDetails =>
            singlePageDetails.pageId.toString()
          )
        ),
      },
    });

    res.json(
      pages.map(({ name, url, _id }) => ({
        name,
        url,
        pageId: _id,
        details: pageDetailsWithTargetComponent
          .filter(
            pageDetails => pageDetails.pageId.toString() === _id.toString()
          )
          .map(pageDetails =>
            R.pick(['_id', 'name', 'title', 'description'], pageDetails)
          ),
      }))
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  componentUsage,
};
