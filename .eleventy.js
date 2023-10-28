module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./styles.css")
  
  eleventyConfig.addCollection("movies", function(collectionApi) {
    return collectionApi.getFilteredByGlob("movies/*.md");
  });
};