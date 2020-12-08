const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { setup: axiosSetup } = require("axios-cache-adapter");

const config = JSON.parse(fs.readFileSync("config.json").toString());
const axios = axiosSetup({
  baseURL: "https://adventofcode.com/",
  cache: { maxAge: 15 * 60 * 1000 },
  headers: { cookie: `session=${config.sessionId}` },
});

const app = express();
app.options("*", cors());

config.leadboards.forEach((leadboard) => {
  app.get(leadboard.endpoint, cors({ origin: leadboard.cors }), (req, res) => {
    axios(`/${leadboard.year}/leaderboard/private/view/${leadboard.id}.json`)
      .then((aocResponse) => {
        JSON.parse(JSON.stringify(aocResponse.data));
        res.send(aocResponse.data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  });
});

app.listen(config.port, () => {
  console.log(`⚡️[server]: Server is running at port: ${config.port}`);
});
