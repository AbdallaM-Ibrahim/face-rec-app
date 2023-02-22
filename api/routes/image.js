const express = require("express");
const router = express.Router();
require("dotenv").config();

const Clarifai = require("clarifai");
const db = require("../utils/db");

const clarifai = new Clarifai.App({
  apiKey: "a232b6a439044d01857bb0d61b000fc3",
});

const myPredict = async (imageUrl) => {
  const result = [];
  await clarifai.models
    .predict(
      {
        id: "face-detection",
        name: "face-detection",
        version: "6dc7e46bc9124c5c8824be4822abe105",
        type: "visual-detector",
      },
      imageUrl
    )
    .then((response) => {
      response.outputs[0].data.regions.forEach((item) => {
        result.push(item.region_info);
      });
    })
    .catch((err) => {
      console.log("error in img processing");
    });
  return result;
};

router.post("/", async (req, res) => {
  const { id, imageUrl } = req.body;
  if (!id) return res.status(400).json("bad request");
  const regions = await myPredict(imageUrl);
  if (!regions.length) return res.status(400).json("error in image processing");
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((data) => {
      res.json({
        entries: data[0].entries,
        regions,
      });
    })
    .catch((err) => console.log("unable to get entries"));
});

module.exports = router;
