const getTotalSongs = (playlists) => {
  return playlists.reduce(
    (totalSongs, playlist) => totalSongs + playlist.numOfSongs,
    0
  );
};

const mostLikedPlaylist = (playlists) => {
  if (!playlists || !Array.isArray(playlists) || playlists.length === 0) {
    return null; // Return null if the input is invalid or empty
  }
  // Find the maximum number of likes among all playlists
  const maxLikes = Math.max(...playlists.map((playlist) => playlist.likes));
  // Use the filter method to get all playlists with the maximum number of likes
  const mostLikedPlaylists = playlists.filter(
    (playlist) => playlist.likes === maxLikes
  );
  // If there are multiple playlists with the same maximum likes, return the first one
  return mostLikedPlaylists.length > 0 ? mostLikedPlaylists[0] : null;
};

module.exports = { getTotalSongs, mostLikedPlaylist };
