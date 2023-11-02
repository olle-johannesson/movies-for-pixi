const _ = require('lodash');
const underscoreToDash = str => str.replace(/\_/g, '-')
const addId = obj => _.set(obj, 'data.id', underscoreToDash(_.get(obj, 'fileSlug')));

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./styles/*.*")
  
  eleventyConfig.addCollection("movies", function(collectionApi) {
    let c = collectionApi.getFilteredByGlob("movies/*.md").map(addId)
    console.log(c) 
    return collectionApi.getFilteredByGlob("movies/*.md");
  });
};