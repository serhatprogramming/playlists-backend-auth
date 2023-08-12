const mostLikedPlaylist =
  require("../utils/playlistsAnalysis").mostLikedPlaylist;
const playlist = require("../utils/samplePlaylists");

// Test cases for mostLikedPlaylist method
describe("mostLikedPlaylist", () => {
  // Test case 1: When playlists array is empty or not provided
  it("should return null if the playlists array is empty or not provided", () => {
    expect(mostLikedPlaylist([])).toBeNull();
    expect(mostLikedPlaylist()).toBeNull();
  });

  // Test case 2: When there is only one playlist
  it("should return the playlist object when there is only one playlist", () => {
    const playlists = [playlist[0]];
    expect(mostLikedPlaylist(playlists)).toEqual({
      _id: "60f1a827a9d1f700d89079a1",
      creator: "JohnDoe123",
      numOfSongs: 10,
      likes: 2578,
      name: "Summer Vibes",
    });
  });

  // Test case 3: When there are multiple playlists with different likes
  it("should return the playlist object with the most likes", () => {
    expect(mostLikedPlaylist(playlist)).toEqual({
      _id: "60f1a837a9d1f700d89079a4",
      creator: "MusicLover87",
      numOfSongs: 18,
      likes: 4531,
      name: "Piano Classics",
    });
  });
});
