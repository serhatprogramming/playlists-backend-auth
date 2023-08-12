const express = require("express");
const playlistsRouter = express.Router();
const Playlist = require("../models/playlist");

playlistsRouter.get("/", async (request, response) => {
  const playlists = await Playlist.find({});
  response.json(playlists);
});

playlistsRouter.post("/", async (request, response) => {
  const playlist = new Playlist(request.body);
  const savedPlaylist = await playlist.save();
  response.status(201).json(savedPlaylist);
});

playlistsRouter.delete("/:id", async (request, response) => {
  await Playlist.findByIdAndDelete(request.params.id);
  response.status(204).json({ message: "Deletion successful" });
});

playlistsRouter.put("/:id", async (request, response) => {
  const { name } = request.body;
  // This code only handles the name parameter, not the other parameters
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    request.params.id,
    { name },
    { new: true, runValidators: true }
  );
  response.json(updatedPlaylist);
});

module.exports = playlistsRouter;
