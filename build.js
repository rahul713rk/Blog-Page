const path = require("path");
const esbuild = require("esbuild");
const { createSiteBuilder } = require("./lib/site/site-builder");

async function runBuild() {
  const rootDir = __dirname;
  const builder = createSiteBuilder(rootDir);
  builder.build();

  console.log("Bundling and minifying assets...");
  try {
    await esbuild.build({
      entryPoints: [
        path.join(rootDir, "assets/js/site.js"),
        path.join(rootDir, "assets/js/search.js")
      ],
      bundle: true,
      minify: true,
      sourcemap: true,
      outdir: path.join(rootDir, "public/assets/js"),
      target: ["es2020"]
    });

    await esbuild.build({
      entryPoints: [path.join(rootDir, "assets/css/site.css")],
      bundle: true,
      minify: true,
      outfile: path.join(rootDir, "public/assets/css/site.css"),
    });
    console.log("Asset optimization complete.");
  } catch (err) {
    console.error("Asset optimization failed:", err);
  }
}

runBuild();

