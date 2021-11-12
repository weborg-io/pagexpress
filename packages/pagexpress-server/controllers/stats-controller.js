const { PageDetails } = require('../models/PageDetails');
const { ComponentPattern } = require('../models/ComponentPattern');
const R = require('ramda');

const componentUsage = async (req, res, next) => {
  const { componentName } = req.params;

  try {
    const targetComponent = await ComponentPattern.findOne({
      name: componentName,
    }).exec();

    const pageDetails = await PageDetails.find({}).exec();
    const pagesDetailsWithTargetComponent = pageDetails
      .filter(singlePageDetails =>
        singlePageDetails.components.some(
          component =>
            component.componentPatternId.toString() ===
            targetComponent._id.toString()
        )
      )
      .map(singlePageDetails => singlePageDetails.pageId);

    res.json({ pages: R.uniq(pagesDetailsWithTargetComponent) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  componentUsage,
};
