module.exports = function(eleventyConfig) {
  
  eleventyConfig.addCollection("movies", function(collectionApi) {
    
    return collectionApi.getFilteredByGlob("movies/*.md");
  });
};