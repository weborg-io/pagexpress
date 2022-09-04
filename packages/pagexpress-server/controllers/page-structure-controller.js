const { Page } = require('../models/Page');
const { NotFound } = require('../utils/errors');
const { getPageStructureData } = require('../utils/page-structure');

const enrichPageData = async pageData =>
  pageData
    .select('name slug url pageDetails attributes')
    .populate({
      path: 'pageDetails',
      model: 'PageDetails',
      select:
        'name country default title description components createdAt updatedAt',
      populate: {
        path: 'country',
        select: 'name code language -_id',
      },
    })
    .populate({
      path: 'type',
      select: 'name -_id',
    })
    .exec();

const getPageStructure = async (req, res, next) => {
  const { pageId } = req.params;

  try {
    const pageData = Page.findById(pageId);
    const enrichedPageData = await enrichPageData(pageData);

    if (!pageData) {
      next(new NotFound(`Page with ID ${pageId} doesn't exist`));
    }

    const pageStructure = await getPageStructureData(enrichedPageData);

    res.json(pageStructure);
  } catch (err) {
    next(err);
  }
};

const getPageStructureBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const pageData = Page.findOne({ slug });
    const enrichedPageData = await enrichPageData(pageData);

    if (!pageData) {
      next(new NotFound(`Page with slug ${slug} doesn't exist`));
    }

    const pageStructure = await getPageStructureData(enrichedPageData);

    res.json(pageStructure);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPageStructure,
  getPageStructureBySlug,
};
