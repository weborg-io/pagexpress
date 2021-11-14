const { Page } = require('../models/Page');
const { PageDetails } = require('../models/PageDetails');
const { ComponentPattern } = require('../models/ComponentPattern');
const R = require('ramda');
const { ObjectId } = require('mongoose').Types;

const componentUsage = async (req, res, next) => {
  const { componentName } = req.params;

  try {
    const targetComponent = await ComponentPattern.findOne({
      name: componentName,
    }).exec();

    const pageDetailsWithTargetComponent = await PageDetails.find({
      'components.componentPatternId': { $eq: ObjectId(targetComponent._id) },
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
