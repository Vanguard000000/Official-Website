module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "styles.css": "css/styles.css" });
  eleventyConfig.addPassthroughCopy({ "animation.js": "js/animation.js" });
  eleventyConfig.addPassthroughCopy({ "feature.js": "js/feature.js" });
  eleventyConfig.addPassthroughCopy({ "theme.js": "js/theme.js" });
  eleventyConfig.addPassthroughCopy({ "404.html": "404.html" });
  eleventyConfig.ignores.add("src/404.html");
  eleventyConfig.ignores.add("src/assets/**/*");
  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
    },
    htmlTemplateEngine: "njk",
  };
};
