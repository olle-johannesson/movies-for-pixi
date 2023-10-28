module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./styles/*.*")
  
  eleventyConfig.addCollection("movies", function(collectionApi) {
    return collectionApi.getFilteredByGlob("movies/*.md");
  });
};