module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "css/styles.css": "css/styles.css" });
  eleventyConfig.addPassthroughCopy({ "js/animation.js": "js/animation.js" });
  eleventyConfig.addPassthroughCopy({ "js/feature.js": "js/feature.js" });
  eleventyConfig.addPassthroughCopy({ "js/theme.js": "js/theme.js" });
  eleventyConfig.addPassthroughCopy({ "404.html": "404.html" });
  eleventyConfig.addPassthroughCopy({ "mediapipe-lab": "mediapipe-lab" });
  eleventyConfig.ignores.add("src/404.html");
  eleventyConfig.ignores.add("src/assets/**/*");
  return {
    pathPrefix: "/Official-Website/",
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
    },
    htmlTemplateEngine: "njk",
  };
};
