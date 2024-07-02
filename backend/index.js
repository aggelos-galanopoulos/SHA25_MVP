// Modules
import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Game } from "./models/gameModel.js";
import cors from 'cors';

// Initializing express and json parser
const app = express();
app.use(express.json());

//Using CORS
app.use(cors());

// Testing the app is working
app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to my app");
});

//Post a game method
app.post("/games", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.description ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, description publishYear",
      });
    }
    const newGame = {
      title: request.body.title,
      description: request.body.description,
      publishYear: request.body.publishYear,
    };
    const game = await Game.create(newGame);

    return response.status(201).send(game);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Get all games method

app.get("/games", async (request, response) => {
  try {
    const games = await Game.find({});
    return response.status(200).json({ count: games.length, data: games });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Get game by ID

app.get("/games/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const game = await Game.findById(id);
    return response.status(200).json(game);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update a game
app.put("/games/:id", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.description ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, description publishYear",
      });
    }
    const { id } = request.params;
    const result = await Game.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).send({ message: "Game not found" });
    }
    return response.status(200).send({ message: "Game updated" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
//Delete a game method

app.delete("/games/:id", async (request, response) => {
    try {
      const { id } = request.params;
      const result = await Game.findByIdAndDelete(id);
      if (!result) {
        return response.status(404).send({ message: "Game not found" });
      }
      return response.status(200).send({ message: "Game deleted" });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

//Connect to MongooseDB
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
