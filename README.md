# Movies for Pixi
This is the repository for [moviespixishouldwatch.com](www.moviespixishouldwatch.com), where we list excellent movies that we think Pixi should watch. If you don't know Pixi but care about good movies, don't worry; these movies are for you too!

## The Setup
Movies and directors are described in `.md` files. These are processed through Eleventy to produce a website. For each movie, two files are generated: An `index.html` under the `/movies` slug, and an additional `a-<movie>-<year>.html` for the lazy-loaded progressive enhancement of the main page.

## Run This
Scripts are provided in the package.json to start a dev server, build the files, and bundle the output.

## Grok This Workflow
Movies and Director markdowns are processed through Eleventy and produce:

- A main page
- A page for each director
- A page for each movie
- A list page for all directors
- A list page for all movies
- A movie article markup file for each movie

The progressive enhancement JavaScript currently consumes a list of all movie articles through the magic of Parcel Bundler and lazy-loads them into the main page. This weighs about the same as an article manifest would in KB, so until there is a need for one, this works just fine.

## Why These Tools?
Repositories usually don't justify their tech decisions, but since you're here, you're probably curious...

- [Eleventy](https://www.11ty.dev/): It's a simple, fast, and very flexible tool for static content pages.
- [Parcel](https://parceljs.org/): A no-config bundler for minifying, transpiling, and content-hashing - assets.
- [Tachyons](https://tachyons.io/): A great framework for standardizing style across a page. Though not ideal for blog-esque static rendering, most of these pages are generated through template HTML, so it still works great.
- [PurgeCSS](https://purgecss.com/): A great fit for functional CSS. Do check out the size of the stylesheets after bundling.
- Not rendering movie articles on the client: We're already using Eleventy for turning data into HTML, and the file size overhead is not significant. Any conditional logic and errors are managed in the build step, keeping runtime errors to a minimum.

## Contribute to This
Everyone is welcome to submit pull requests, but they will be closely reviewed by Adam and Olle.