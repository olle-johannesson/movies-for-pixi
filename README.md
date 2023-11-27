# Movies for Pixi
This is the repository for [moviespixishouldwatch.com](www.moviespixishouldwatch.com), where we list excellent movies that we think Pixi should watch. If you don't know Pixi but care about good movies, don't worry; these movies are for you too!

## The Setup
Movies and directors are described in `.md` files. These are processed through Eleventy to produce a website. For each movie, two files are generated: An `index.html` under the `/movies` slug, and an additional `a-<movie>-<year>.html` for the lazy-loaded progressive enhancement of the main page.

## Run This
Scripts are provided in the package.json to start a dev server, build the files, and bundle the output.

