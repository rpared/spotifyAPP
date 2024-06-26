// Magical Function to get and refresh the token
$.urlParam = function (name) {
  var results = new RegExp("[\?&|#]" + name + "=([^&]*)").exec(window.location.href);
  return results == null ? null : results[1] || 0;
};

let accessToken = $.urlParam("access_token");

if (!accessToken) {
  alert('Access token not found. Please log in again.');
  window.location.href = 'index.html'; // Redirect to your login page
}

let track;  // Define track at the appropriate scope

// Function to check the access token scopes
function checkTokenScopes() {
  $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
      },
      success: function (response) {
          console.log('User info:', response);
          // Ensure the token has the necessary scopes
          // If not, redirect to login page to get a new token with required scopes
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.error('Error checking token scopes:', jqXHR.responseText);
      }
  });
}

// Call this function to ensure proper scopes
checkTokenScopes();

// Function to play or resume track
function playOrResumeTrack(trackId) {
  const currentlyPlayingEndpoint = 'https://api.spotify.com/v1/me/player/currently-playing';

  $.ajax({
      url: currentlyPlayingEndpoint,
      type: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
      },
      success: function (response) {
          console.log('Spotify API Response:', response);
          resumeTrack();
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.error('Error getting currently playing track:', jqXHR.responseText);
      },
  });
}

// Function to resume the currently paused track
function resumeTrack() {
  const endpoint = 'https://api.spotify.com/v1/me/player/play';

  $.ajax({
      url: endpoint,
      type: 'PUT',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
      },
      success: function (response) {
          getCurrentlyPlayingTrack();
          console.log('Resume successful:', response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.error('Error resuming track:', jqXHR.responseText);
      },
  });
}

// Function to get currently playing track
function getCurrentlyPlayingTrack() {
  const endpoint = 'https://api.spotify.com/v1/me/player/currently-playing';

  $.ajax({
      url: endpoint,
      type: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
      },
      success: function (response) {
          console.log('Spotify API Response:', response);

          if (response.item) {
              getTrackPosition(response);
              displayCurrentlyPlaying(response.item);
          } else {
              console.error('Response does not have item property:', response);
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.error('Error getting currently playing track:', jqXHR.responseText);
      },
  });
}

let CurrentlyPlayingId;

// Function to display currently playing track
function displayCurrentlyPlaying(trackData) {
  CurrentlyPlayingId = trackData.id;
  $('#result').html(`
      <p>Currently Playing Track:</p>
      <p>Name: ${trackData.name}</p>
      <p>Artist: ${trackData.artists[0].name}</p>
      <p>Album: ${trackData.album.name}</p>
      <img src="${trackData.album.images[0].url}" alt="Album Cover" style="max-width: 200px; max-height: 200px;">
      <p>Duration: ${track.progress_ms} milliseconds / ${trackData.duration_ms} milliseconds</p>
      <p>Id: ${trackData.id}</p>
  `);
}

// Function to get track position
function getTrackPosition(trackData) {
  track = trackData; 
  console.log(`Track position: ${trackData.progress_ms}`);
}

// Function to seek to a position in the currently playing track
function seekToPosition(offsetMs) {
  const seekEndpoint = 'https://api.spotify.com/v1/me/player/seek';

  $.ajax({
      url: `${seekEndpoint}?position_ms=${offsetMs}`,
      type: 'PUT',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
      },
      success: function (response) {
          console.log('Seek successful:', response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.error('Error seeking to position:', jqXHR.responseText);
      },
  });
}

// Function to pause the currently playing track
function pauseTrack() {
  const endpoint = 'https://api.spotify.com/v1/me/player/pause';

  $.ajax({
      url: endpoint,
      type: 'PUT',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
      },
      success: function (response) {
          console.log('Pause successful:', response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.error('Error pausing track:', jqXHR.responseText);
      },
  });
}

// Event listener for the "Pause" button
$(document).ready(function () {
  $('#buttonPause').on('click', function () {
      pauseTrack();
  });
});

// Event listener for the "Seek" button
$(document).ready(function () {
  $('#buttonSeek').on('click', function () {
      getCurrentlyPlayingTrack();
      seekToPosition(track.progress_ms + 10000);
  });
});

// Event listener for the "Play" button
$(document).ready(function () {
  $('#buttonPlay').on('click', function () {
      const trackId = CurrentlyPlayingId;
      console.log(trackId);
      playOrResumeTrack(trackId);
  });
});
