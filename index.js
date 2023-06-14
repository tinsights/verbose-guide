const cheerio = require("cheerio");
const axios = require("axios");

async function main() {
  try {
    axios.get("https://theprojector.sg/themes/movies-at-the-cinema/").then((response) => {
      const $ = cheerio.load(response.data);
      const grid = $(
        "main > div > div.theme-module--theme-body--3Rz4y > div.event-list-module--events--3jC_9.theme-module--event-list--3LEts.event-list-module--grid--3HVrf"
      );
      const movies = [];
      const movieElements = $(grid).find("div.event-list-item-module--content--2jLuQ");
      movieElements.each((index, movieEl) => {
        const title = $(movieEl).find("h3 a").text();
        const rating = $(movieEl).find("h3 span").text();
        const description = $(movieEl).find("p").text();
        movies.push({
          title,
          rating,
          description,
        });
      });
      console.log(movies);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
