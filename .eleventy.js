const _ = require('lodash');
const underscoreToDash = str => str.replace(/\_/g, '-')
const addId = obj => _.set(obj, 'data.id', underscoreToDash(_.get(obj, 'fileSlug')));

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("./styles/*.*")
  eleventyConfig.addPassthroughCopy("./scripts/*.*")
  // eleventyConfig.addPassthroughCopy("./images/*.*")
  
  eleventyConfig.addCollection("movies", collectionApi => 
    collectionApi
      .getFilteredByGlob("movies/*.md")
      .map(addId))

  // Collection for directors
  eleventyConfig.addCollection("directors", collectionApi => 
    collectionApi
      .getFilteredByGlob("./directors/*.md"));
};