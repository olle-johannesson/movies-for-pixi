const _ = require('lodash');
const underscoreToDash = str => str.replace(/\_/g, '-')
const addId = obj => _.set(obj, 'data.id', underscoreToDash(_.get(obj, 'fileSlug')));

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("./styles/*.*")
  
  // Collection for movies (index)
  eleventyConfig.addCollection("movies", collectionApi => 
    collectionApi
      .getFilteredByGlob("movies/*.md")
      .map(addId))

  // Collection for directors
  eleventyConfig.addCollection("directors", collectionApi => 
    (console.log(collectionApi
      .getFilteredByGlob("./directors/*.md")), collectionApi
      .getFilteredByGlob("./directors/*.md")));
};