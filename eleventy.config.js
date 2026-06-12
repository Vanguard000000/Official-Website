module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "animation.js": "animation.js" });
  eleventyConfig.addPassthroughCopy({ "feature.js": "feature.js" });
  eleventyConfig.addPassthroughCopy({ "theme.js": "theme.js" });
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
