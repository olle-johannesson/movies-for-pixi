const _ = require('lodash');
const underscoreToDash = str => str.replace(/\_/g, '-')
const addId = obj => _.set(obj, 'data.id', underscoreToDash(_.get(obj, 'fileSlug')));

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("./styles/*.*")
  eleventyConfig.addPassthroughCopy("./scripts/*.*")
  
  // Collection for movies (index)
  eleventyConfig.addCollection("movies", collectionApi => 
    collectionApi
      .getFilteredByGlob("movies/*.md")
      .map(addId))

  eleventyConfig.addCollection("moviesByDecade", collectionApi => {
    const allMovies = collectionApi
      .getFilteredByGlob("movies/*.md")
      .map(addId)
      .map(n => n.data)
    
    return Object.entries(_.groupBy(allMovies, (item) => Math.floor(item.year / 10) * 10)).map(([decade, movies]) => ({ decade, movies }));
  });

  // Collection for directors
  eleventyConfig.addCollection("directors", collectionApi => 
    collectionApi
      .getFilteredByGlob("./directors/*.md"));
};