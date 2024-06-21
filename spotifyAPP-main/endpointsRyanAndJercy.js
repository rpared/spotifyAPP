let track; // Declare track at a higher scope
//let accessToken = 'BQAhSvQpK7v9yOQlYiaFPC-C_HHWKk9v5TqLDynK9pfLoQrSx_bcLZ6De3vXC8rQR3o5cEt3Tp4U6N8pe2OLojs0d-kodZJwJSOb0RIex1mhPhlxfRkHWGhpNi4ZjueWFbrV__rJ59MNqOhHl55JM9iviSzGS_8MkXbZUHs63cEKNBZVIPaiF66mMuSRAdA';

// Magical Function to get and refresh the token
$.urlParam = function (name) {
  var results = new RegExp("[\?&|#]" + name + "=([^&]*)").exec(
  window.location.href
  );
  if (results == null) {
  return null;
  } else {
  return results[1] || 0;
   }
 };
 let access_token = $.urlParam("access_token");
 let accessToken = access_token;


// Function to play a track
function playOrResumeTrack(trackId) {
  // Spotify API endpoint for getting currently playing track
  const currentlyPlayingEndpoint = 'https://api.spotify.com/v1/me/player/currently-playing';

  // Manually input your access token for testing
  

  // Make a GET request to the Spotify API to get currently playing track
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
      console.error('Error getting currently playing track:');
      console.log('Status:', textStatus);
      console.log('Error Thrown:', errorThrown);
      console.log('Response Text:', jqXHR.responseText);
    },
  });
}

// Function to resume the currently paused track
function resumeTrack() {
  // Spotify API endpoint for resuming a track
  const endpoint = 'https://api.spotify.com/v1/me/player/play';

  // Manually input your access token for testing
 

  // Make a PUT request to the Spotify API to resume the track
  $.ajax({
    url: endpoint,
    type: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    success: function (response) {
      getCurrentlyPlayingTrack();
      // Handle success, you can log or perform additional actions if needed
      console.log('Resume successful:', response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error resuming track:');
      console.log('Status:', textStatus);
      console.log('Error Thrown:', errorThrown);
      console.log('Response Text:', jqXHR.responseText);
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
      console.error('Error getting currently playing track:');
      console.log('Status:', textStatus);
      console.log('Error Thrown:', errorThrown);
      console.log('Response Text:', jqXHR.responseText);
    },
  });
}

let CurrentlyPlayingId
// Function to display currently playing track
function displayCurrentlyPlaying(trackData) {
  CurrentlyPlayingId = trackData.id;
  $('#result2').html(`
    <p>Currently Playing Track:</p>
    <p>Name: ${trackData.name}</p>
    <p>Artist: ${trackData.artists[0].name}</p>
    <p>Album: ${trackData.album.name}</p>
    <img src="${trackData.album.images[0].url}" alt="Album Cover" style="max-width: 200px; max-height: 200px;">
    <p>Duration:  ${track.progress_ms} miliseconds /${trackData.duration_ms} miliseconds</p>
    <p>Id:  ${trackData.id} </p>
    
  `);
}


// Function to get track position
function getTrackPosition(trackData) {
  track = trackData; 
  `${trackData.progress_ms}`;
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
      console.error('Error seeking to position:');
      console.log('Status:', textStatus);
      console.log('Error Thrown:', errorThrown);
      console.log('Response Text:', jqXHR.responseText);
    },
  });
}
function pauseTrack() {
  // Spotify API endpoint for pausing a track
  const endpoint = 'https://api.spotify.com/v1/me/player/pause';


  // Make a PUT request to the Spotify API to pause the track
  $.ajax({
    url: endpoint,
    type: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    success: function (response) {
      // Handle success, you can log or perform additional actions if needed
      console.log('Pause successful:', response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error pausing track:');
      console.log('Status:', textStatus);
      console.log('Error Thrown:', errorThrown);
      console.log('Response Text:', jqXHR.responseText);
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

// Event listener for the play button

$(document).ready(function () {
  $('#buttonPlay').on('click', function () {
    const trackId = CurrentlyPlayingId; 
    console.log(trackId);
    playOrResumeTrack(trackId);
  });
})