const getTotalSongs = require("../utils/playlistsAnalysis").getTotalSongs;
const playList = require("../utils/samplePlaylists");

describe("Total Songs", () => {
  test("should return 0 for an empty array", () => {
    const emptyPlaylist = [];
    const result = getTotalSongs(emptyPlaylist);
    expect(result).toBe(0);
  });

  test("should return the number of songs for a single song playlist", () => {
    const result = getTotalSongs([playList[0]]);
    expect(result).toBe(10);
  });

  test("should return the correct total number of songs for the sample playlists data", () => {
    const result = getTotalSongs(playList);
    expect(result).toBe(98);
  });
});
