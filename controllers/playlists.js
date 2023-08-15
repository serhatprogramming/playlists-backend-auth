const User = require("../models/user");
const express = require("express");
const playlistsRouter = express.Router();
const Playlist = require("../models/playlist");

playlistsRouter.get("/", async (request, response) => {
  const playlists = await Playlist.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(playlists);
});

playlistsRouter.post("/", async (request, response) => {
  const { name, creator, numOfSongs, likes, userId } = request.body;
  const user = await User.findById(userId);
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
  const user = await User.findById(request.body.userId);
  if (!user) {
    return response.status(404).json({ error: "user not found" });
  }
  const ownerCheck = (await Playlist.findById(request.params.id)).user;
  if (request.body.userId !== ownerCheck.toString()) {
    return response.status(401).json({ error: "unauthorized access" });
  }
  const playlist = await Playlist.findByIdAndRemove(request.params.id);
  if (playlist) {
    response.status(200).json({
      message: `The playlist [${playlist.name}] removed successfully`,
    });

    user.playlists = user.playlists.filter(
      (playlist) => playlist._id.toString() !== request.params.id
    );
    user.save();
  } else {
    response.status(404).json({ error: "The playlist not found." });
  }
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
