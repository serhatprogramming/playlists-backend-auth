const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const apiTest = supertest(app);

const Playlist = require("../models/playlist");
const playlists = require("../utils/samplePlaylists");

beforeEach(async () => {
  await Playlist.deleteMany();
  await Playlist.insertMany(playlists);
});
describe("Playlists API", () => {
  describe("GET /api/playlists", () => {
    test("should return 200 OK", async () => {
      await apiTest.get("/api/playlists").expect(200);
    });
    test("should return an array of playlists", async () => {
      const response = await apiTest.get("/api/playlists").expect(200);
      expect(response.body).toBeInstanceOf(Array);
    });
    test("playlists should return JSON", async () => {
      await apiTest.get("/api/playlists").expect("content-type", /json/);
    });
    test("should have seven playlists in the array", async () => {
      const response = await apiTest.get("/api/playlists");
      expect(response.body.length).toBe(7);
    });
    test("should have an 'id' property in each playlist object", async () => {
      const response = await apiTest.get("/api/playlists");
      const playlists = response.body;

      playlists.forEach((playlist) => {
        expect(playlist).toHaveProperty("id");
      });
    });
  });

  describe("POST /api/playlists", () => {
    test("should return 201 status code when creating a new playlist", async () => {
      const newPlaylist = {
        name: "New Playlist",
        creator: "John Doe",
        likes: 334,
        numOfSongs: 23,
      };

      const response = await apiTest.post("/api/playlists").send(newPlaylist);
      expect(response.status).toBe(201);
    });

    test("should increment the total number of playlists by one after creating a new playlist", async () => {
      const newPlaylist = {
        name: "New Playlist",
        creator: "John Doe",
        likes: 334,
        numOfSongs: 23,
      };
      const initialResponse = await apiTest.get("/api/playlists");
      const initialPlaylistCount = initialResponse.body.length;

      await apiTest.post("/api/playlists").send(newPlaylist);

      const finalResponse = await apiTest.get("/api/playlists");
      const finalPlaylistCount = finalResponse.body.length;

      expect(finalPlaylistCount).toBe(initialPlaylistCount + 1);
    });

    test("should return 400 status code if missing 'creator' or 'name' properties in POST request", async () => {
      const invalidPlaylist = {
        // Missing 'creator' and 'name' properties
        // Add other properties as needed
      };
      const response = await apiTest
        .post("/api/playlists")
        .send(invalidPlaylist);
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE and PUT /api/playlists", () => {
    test("should return 204 status code on successful deletion of a playlist", async () => {
      const getPlaylistsResponse = await apiTest.get("/api/playlists");
      const firstPlaylistId = getPlaylistsResponse.body[0].id;

      const deleteResponse = await apiTest.delete(
        `/api/playlists/${firstPlaylistId}`
      );
      expect(deleteResponse.status).toBe(204);
    });

    test("should return 400 status code when attempting to delete with an invalid ID", async () => {
      const invalidId = "invalidId";
      const response = await apiTest.delete(`/api/playlists/${invalidId}`);
      expect(response.status).toBe(400);
    });

    test("should update the name of the first playlist with a PUT request", async () => {
      const updatedName = "Updated Playlist Name";

      const getPlaylistsResponse = await apiTest.get("/api/playlists");
      const firstPlaylistId = getPlaylistsResponse.body[0].id;

      const response = await apiTest
        .put(`/api/playlists/${firstPlaylistId}`)
        .send({ name: updatedName });

      const updatedPlaylistName = response.body.name;
      expect(updatedPlaylistName).toBe(updatedName);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
