const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const query = {
      text: 'SELECT p.id, p.name FROM playlists p WHERE p.id = $1',
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(query);

    const songQuery = {
      text: `SELECT s.id, s.title, s.performer
               FROM songs s JOIN playlist_songs ps ON ps.song_id = s.id
               WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const songResult = await this._pool.query(songQuery);

    return {
      id: playlistResult.rows[0].id,
      name: playlistResult.rows[0].name,
      songs: songResult.rows,
    };
  }
}

module.exports = PlaylistsService;
