const _ = require('lodash');
const underscoreToDash = str => str.replace(/\_/g, '-')
const addId = obj => _.set(obj, 'data.id', underscoreToDash(_.get(obj, 'fileSlug')));

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("./src/styles/*.*")
  eleventyConfig.addPassthroughCopy("./src/scripts/*.*")
  eleventyConfig.addPassthroughCopy("./src/head/*.*")
  
  eleventyConfig.addCollection("movies", collectionApi => 
    _.shuffle(collectionApi
      .getFilteredByGlob("./src/movies/*.md")
      .map(addId)))

  eleventyConfig.addCollection("directors", collectionApi => 
    _.shuffle(collectionApi
      .getFilteredByGlob("./src/directors/*.md")));

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};