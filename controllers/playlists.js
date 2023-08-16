const User = require("../models/user");
const express = require("express");
const playlistsRouter = express.Router();
const Playlist = require("../models/playlist");
const jwt = require("jsonwebtoken");

playlistsRouter.get("/", async (request, response) => {
  const playlists = await Playlist.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(playlists);
});

playlistsRouter.post("/", async (request, response) => {
  const { name, creator, numOfSongs, likes } = request.body;

  const tokenPayload = jwt.verify(request.token, process.env.PRIVATE_KEY);
  if (!tokenPayload.id) {
    return response.status(401).json({ error: "invalid token" });
  }
  const user = request.user;
  if (!user) {
    return response.status(404).json({ error: "user not found" });
  }
  const playlist = new Playlist({
    name,
    creator,
    numOfSongs: numOfSongs ?? 0,
    likes: likes ?? 0,
    user: user.id,
  });
  const savedPlaylist = await playlist.save();
  user.playlists = [...user.playlists, savedPlaylist._id];
  await user.save();
  response.status(201).json(savedPlaylist);
});

playlistsRouter.delete("/:id", async (request, response) => {
  const playlist = await Playlist.findById(request.params.id);
  if (!playlist) {
    return response.status(404).json({ error: "Playlist not found" });
  }
  const tokenPayload = jwt.verify(request.token, process.env.PRIVATE_KEY);
  if (!tokenPayload.id) {
    return response.status(401).json({ error: "invalid token" });
  }
  const user = request.user;
  if (!user) {
    return response.status(404).json({ error: "user not found" });
  }
  // Check if the owner requested the deletion
  if (tokenPayload.id !== playlist.user.toString()) {
    return response.status(401).json({ error: "unauthorized access" });
  }

  const removedPlaylist = await Playlist.findByIdAndRemove(request.params.id);
  user.playlists = user.playlists.filter(
    (playlist) => playlist._id.toString() !== request.params.id
  );
  user.save();

  response.status(200).json({
    message: `The playlist [${removedPlaylist.name}] removed successfully`,
  });
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
