const cheerio = require("cheerio");
const axios = require("axios");
const app = require("express")();

const PORT = process.env.PORT || 3070;

async function main() {
  app.get("/", (req, res) => res.send("MOVIES!~"));
  app.get("/movies/all", async function (req, res) {
    const movies = await allMovies();
    res.json(movies);
  });

  app.listen(PORT, () => console.log(`App started on http://localhost:${PORT}`));
}

async function allMovies() {
  const movies = [];
  const response = await axios.get("https://theprojector.sg/themes/movies-at-the-cinema/");
  const $ = cheerio.load(response.data);
  const grid = $(
    "main > div > div.theme-module--theme-body--3Rz4y > div.event-list-module--events--3jC_9.theme-module--event-list--3LEts.event-list-module--grid--3HVrf"
  );
  const movieElements = $(grid).find("div.event-list-item-module--content--2jLuQ");
  movieElements.each((index, movieEl) => {
    const title = $(movieEl).find("h3 a").text();
    const rating = $(movieEl).find("h3 span").text();
    let categories = "";
    $(movieEl)
      .find("div.event-list-item-module--title-wrapper--8AnPt > p > span")
      .each((idx, cat) => {
        if (idx > 0) categories += ", ";
        categories += $(cat).text();
      });

    movies.push({
      title,
      rating,
      categories,
    });
  });
  return movies;
}

main();
