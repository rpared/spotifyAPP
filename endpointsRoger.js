$(document).ready(function(){
    //To be changed every 3600 secs!!!!!!!! This sucks!!!!! 
    //const token = 'BQBHPRB5PXOEplS21WJ1BQ4gHfWaLuogDHwBYOvUyckA21xaWRLRSHPsQoAxPhGOLtaFM3pB1znp-mEGRzHxhRPKxC-mDj9Bpssa4mTT2NNqtDyi8FQ';


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


/////User info Endpoint
    $('#buttonUser').on('click', function(){
        let url = `https://api.spotify.com/v1/me`;
            $.ajax({
                url: url,
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
                success: function(result) {
                    console.log(result);
                    $("#result").html("<br>" + result.display_name + "<br>" + "Country: " + result.country + "<br><br>");
                    //let FavButton = `<button id="buttonFav" class="btn btn-primary" >${result.display_name} Top Tracks</button>`;
                   // $("#result").append(FavButton);
                   //Creating a button to retrieve followed artists
                   $("#result").append(`<br>`)
                   $("#result").append(`<button id="buttonTracks" class="btn btn-primary" >${result.display_name} Top Track</button>`)
                   
                    $("#buttonTracks").on('click', function() {
                        console.log("getTopTrack called");
                        getTopTrack();
                        });

                },
                error: function() {
                    alert('Request failed!');
                }
            });
    });
/////Followed Artists Endpoint  

$("#buttonFollowers").on('click', function() {
    console.log("getFollows called");
    getFollows();
    });

let getFollows = () => {
    $.ajax({
        url: 'https://api.spotify.com/v1/me/following?type=artist',
        headers: { Authorization: "Bearer " + accessToken },
        success: function (response) {
            console.log('Followed artists:', response);
            $("#result").empty();
            // Create a container div for all artist cards
            $("#result").append('<h3>Artists Followed</h3>');
            let followingsDiv = $("<div>").css({
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "left"
            });

            response.artists.items.forEach(artist => {
                // Create a div for each artist card
                const artistCard = $("<div>").addClass('artist-card');

                // Artist Name
                const nameElement = $("<h3>").text(artist.name);

                // Artist Image
                const imageElement = $("<img>").attr({
                    src: artist.images[0].url,
                    alt: artist.name,
                    style: 'width: 150px',
                });

                // Followers Count
                const followersElement = $("<p>").text(`Followers: ${artist.followers.total}`);

                // Genres
                const genresElement = $("<p>").text(`Genre: ${artist.genres[0]}`);

                // Append elements to the artist card
                artistCard.append(nameElement, imageElement, followersElement, genresElement);

                // Append artist card to the container
                followingsDiv.append(artistCard);
            });

            // Append the container to the result element
            $("#result").append(followingsDiv);
        },
        error: function (status, error) {
            console.error('Error fetching followed artists:', status, error);
            alert('Followed Artists request failed!', status, error);
        }
    });
};



/////Favorite Track Endpoint
    let getTopTrack = () => {
            $.ajax({
                url: 'https://api.spotify.com/v1/me/top/tracks',
                headers: {Authorization: "Bearer " + accessToken ,},
                success: function (response) {
                    console.log('Top Tracks:', response);
                    let items = response.items;

                if (items.length > 0) {
                    let firstItem = items[0];
                    let album = firstItem.album;
                    let artists = album.artists;
                    let trackName = firstItem.name;
                    let trackURL = firstItem.preview_url;

                    if (artists.length > 0) {
                        
                        let firstArtist = artists[0];
                        let artistName = firstArtist.name;
                        let artistExternalUrl = firstArtist.external_urls.spotify;
                        let albumExternalUrl = album.external_urls.spotify;
                        let albumImage = album.images.length > 0 ? album.images[0].url : '';

                        // Display the extracted information in the HTML
                        let htmlContent = `
                        <br><br>
                            <div>
                                <h4>Track Name: ${trackName}</h4>
                                <p>Artist Name: ${artistName}</p>
                                <p>Track External URL: <a href="${trackURL}" target="_blank">${trackURL}</a></p>
                                <p>Artist External URL: <a href="${artistExternalUrl}" target="_blank">${artistExternalUrl}</a></p>
                                <p>Album External URL: <a href="${albumExternalUrl}" target="_blank">${albumExternalUrl}</a></p>
                                <img src="${albumImage}" alt="Album Image" width="200">
                            </div>
                        `;
                        // Append the HTML content to an element with the ID 'result'
                        $("#result").append(htmlContent);
                    }
                }
                },
                error: function () {
                    
                    alert('Top Tracks request failed!');
                }
            });
    };

////Top Artist Endpoint
$('#buttonFav').on('click', function(){
    let url = `https://api.spotify.com/v1/me/top/artists`;
    $.ajax({
        url: url,
        headers: {Authorization: "Bearer " + accessToken,},
        success: function(result) {
            $("#result").empty();
            const artists = result.items;

            artists.forEach((artist, index) => {
                const artistName = artist.name;
                const artistExternalUrl = artist.external_urls.spotify;
                const genres = artist.genres;
                const artistImage = artist.images.length > 0 ? artist.images[0].url : '';
                const albums = artist.albums; // Assuming there is an 'albums' property in the artist object
            
                // Display the extracted information in the HTML
                const favArtist = `
                    <div>
                        <h2>Artist ${index + 1}</h2>
                        <p>Artist Name: ${artistName}</p>
                        <p>Artist External URL: <a href="${artistExternalUrl}" target="_blank">${artistExternalUrl}</a></p>
                        <p>Genres: ${genres.join(', ')}</p>
                        <img src="${artistImage}" alt="Artist Image" width="200">
                    </div>
                    
                    
                `;
                
                $("#result").append(favArtist);
            });
      



            
        },
        error: function () {
            alert('Request failed!');
        }
    });
});

/////Favorite Set Artist Endpoint
    let artistName = 'Batushka';
        
    $('#buttonFav1').on('click', function(){
        let url = `https://api.spotify.com/v1/search?q=${artistName}&type=artist`;
        $.ajax({
            url: url,
            headers: {Authorization: "Bearer " + accessToken,},
            success: function(result) {
                // Extract information about the artist
                let artistInfo = result.artists.items[0];
                let artistId = artistInfo.id;
    
                // Display artist name and genres
                console.log(`Artist Name: ${artistInfo.name}`);
                $("#result").html("<br>" + `Favorite artist is:  ${artistInfo.name}` + "<br>");
                let artistGenres = artistInfo.genres;
                console.log(`Artist genre is: ${artistGenres.join(', ')}`);
                $("#result").append("<br>" + `Artist genres are:   ${artistGenres.join(', ')}` + "<br>");
    
                // Retrieve albums
                $.ajax({
                    url: `https://api.spotify.com/v1/artists/${artistId}/albums`,
                    headers: { Authorization: "Bearer " + accessToken },
                    success: function (albumsResult) {
                        // Extract information about albums
                        let albums = albumsResult.items;
                        console.log("Albums:");
                        $("#result").append("<br>" + "Albums:");
                        let favoriteDiv = $("<div>").css({
                            display: "flex", // Flexbox container
                            flexWrap: "wrap",
                            justifyContent: "left"
                        });
                        albums.forEach(album => {
                            console.log(album.name);
                
                            // Display album name and image
                            if (album.images.length > 0) {
                                let albumImage = album.images[0].url;
                                let favAlbum = $("<div>").css({
                                    margin: "6px",
                                    padding: "10px",
                                    width: "140px",
                                    height: "180px",
                                    textAlign: "center",
                                    backgroundColor: "#222222",
                                    borderRadius: "5px",
                                    display:"inline"
                                });
                
                                favAlbum.append($("<img>").attr({
                                    src: albumImage,
                                    alt: album.name
                                }).css({
                                    width: "100px",
                                    height: "100px"
                                }));
                
                                //favAlbum.append("<br><br>");
                                favAlbum.append("<br>" + `${album.name}` + "<br>");
                                favoriteDiv.append(favAlbum);
                            }
                        });
                        $("#result").append(favoriteDiv);
                    },
                    error: function () {
                        alert('Failed to retrieve albums!');
                    }
                });
                
            },
            error: function () {
                alert('Request failed!');
            }
        });
    });

/////Search Endpoint
        $('#buttonSearch').on('click', function(){
            let searchTerm = $("#search-input").val();
            let searchType = $("#searchType").val();
            $.ajax({
            url: "https://api.spotify.com/v1/search",
            method: "GET",
            headers: {Authorization: "Bearer " + accessToken,},
            data: {
                q: searchTerm,
                type: searchType,
            },
            success: function (result) {
                displaySearchResults(result, searchType);
                console.log(result);
            },
            error: function (error) {
                console.error("Error fetching data from Spotify API:", error);
            },
            });
        });

        function displaySearchResults(response, type) {
            var resultsContainer = $("#result");
            resultsContainer.empty();
            let searchType = type;

            if(searchType == 'artist'){
                if (response.artists && response.artists.items.length > 0) {
                    let resultTitle = $("<h3>").html( " Artists search results: ");       
                    resultsContainer.append(resultTitle);
                    var artists = response.artists.items;
                    
                    artists.forEach(function (artist) {
                        var artistName = artist.name;
                        var artistPopularity = artist.popularity;//not using this
        
                        let resultItem = $("<div>").html( " - " + artistName);       
                        resultsContainer.append(resultItem);

                    });
                    let clearButton = '<br> <button id="buttonClear">Clear</button>';
                    resultsContainer.append(clearButton);
                    $("#buttonClear").on("click", function(){
                        resultsContainer.empty();
                    });
                    
                    } else {
                    resultsContainer.text("No results found.");
                    }
            }

            if(searchType == 'album'){
                if (response.albums && response.albums.items.length > 0) {
                    let resultTitle = $("<h3>").html( " Albums search results: ");       
                    resultsContainer.append(resultTitle);
                    let albums = response.albums.items;
                    
                    
                    albums.forEach(function (record) {
                        let albumName = record.name;
                        let albumArtist = record.artists[0].name;
                        let resultItem = $("<div>").html( " - " + albumName + "<em> by: " +albumArtist + "</em>");       
                        resultsContainer.append(resultItem);

                    });
                    let clearButton = ' <br> <button id="buttonClear">Clear</button>';
                    resultsContainer.append(clearButton);
                    $("#buttonClear").on("click", function(){
                        resultsContainer.empty();
                    });
                    
                    } else {
                    resultsContainer.text("No results found.");
                    }
            }

            if(searchType == 'track'){
                if (response.tracks && response.tracks.items.length > 0) {
                    let resultTitle = $("<h3>").html( " Tracks search results: ");       
                    resultsContainer.append(resultTitle);
                    let tracks = response.tracks.items;
                    
                    
                    tracks.forEach(function (song) {
                        let songName = song.name;
                        let songArtist = song.artists[0].name;
                        let resultItem = $("<div>").html( " - " + songName + "<em> by: " + songArtist + "</em>");       
                        resultsContainer.append(resultItem);

                    });
                    let clearButton = '<br> <button id="buttonClear">Clear</button>';
                    resultsContainer.append(clearButton);
                    $("#buttonClear").on("click", function(){
                        resultsContainer.empty();
                    });
                    
                    } else {
                    resultsContainer.text("No results found.");
                    }
            }

            
            
        }


        
/////Get Queue Endpoint
        $('#buttonQueue').on('click', function(){
            let url = `https://api.spotify.com/v1/me/player/queue`;
                $.ajax({
                    url: url,
                    headers: {Authorization: "Bearer " + accessToken,},
                    success: function(result) {
                        console.log(result);
                        let queueContainer = $('#result');
                        queueContainer.empty(); // Clear previous results
                
                        if (queueData && queueData.queue && queueData.queue.length > 0) {
                            let queueItems = queueData.queue;
                
                            // Iterate through the queue items and append relevant information to the container
                            for (let i = 0; i < queueItems.length; i++) {
                                let track = queueItems[i];
                                let artists = track.artists.map(artist => artist.name).join(', ');
                                let songName = track.name;
                                let genres = track.artists[0].genres.join(', ');
                                let imageUrl = track.album.images.length > 0 ? track.album.images[0].url : 'placeholder.jpg';
                
                                // Create HTML elements for each track
                                let trackHtml = `<div class="track">
                                                    <img src="${imageUrl}" alt="${songName}">
                                                    <p>Artists: ${artists}</p>
                                                    <p>Song: ${songName}</p>
                                                    <p>Genre(s): ${genres}</p>
                                                </div>`;
                
                                queueContainer.append(trackHtml);
                            }
                        } else {
                            // Display a message when no results are found
                            queueContainer.html('No tracks in the queue.');
                        }
            
                    },
                    error: function() {
                        alert('Request failed!');
                    }
                });
        })

/////Get User Playlists Endpoint
        $('#buttonPlaylist').on('click', function(){
            let url = `https://api.spotify.com/v1/users/31ng3kgcvywnzl3tvtc2pgzx3dli/playlists?user_id=31ng3kgcvywnzl3tvtc2pgzx3dli`;
                $.ajax({
                    url: url,
                    headers: {Authorization: "Bearer " + accessToken,},
                    success: function(result) {
                        console.log(result);
                        let container = $('#result');
                        container.empty(); // Clear previous results
                        console.log(result);
                        
                        result.items.forEach(function (playlist) {
                            // Get playlist information
                            let playlistName = playlist.name;
                            let playlistDescription = playlist.description;
                            let playlistUrl = playlist.external_urls.spotify;
                            let playlistImageUrl = playlist.images.length > 0 ? playlist.images[0].url : "";
                            let playlistId = playlist.id;
                               
                            // Add playlist information to the container
                            container.append(`<h3>${playlistName}</h3>`);
                            container.append(`<p>Description: ${playlistDescription}</p>`);
                            container.append(`<p><a href="${playlistUrl}" target="_blank">Open on Spotify</a></p>`);
                            container.append(`<img src="${playlistImageUrl}" alt="${playlistName}" width="300" height="300">`);
                            container.append(`<br><br>`);
                        
                        //Creating a button to retrieve tracks
                            container.append(`<button class="btn btn-primary buttonTracks" data-playlist-id="${playlistId}">Get Tracks</button>`) 
                            container.append(`<br><br>`);
                            let playlistInfoDiv = document.createElement("div");
                                container.append(playlistInfoDiv);

                            $('.buttonTracks').on('click', function() {
                                console.log("getTracks called");
                                let playlistId = $(this).data('playlist-id');
                                
                                getTracks(playlistId, playlistInfoDiv);

                            });

                        });
                    },
                    error: function() {
                        alert('Request failed!');
                    }
                
            });
        });
        
    //////GET tracks from a playlist  

    function getTracks(playlistId, playlistInfoDiv) {
        let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        $.ajax({
            url: url,
            headers: { Authorization: "Bearer " + accessToken, },
            success: function (result) {
                console.log(result);
                let container = $('#result');
    
                //let playlistInfoDiv = document.createElement("div");
                playlistInfoDiv.style.display = "flex"; // Flexbox
                playlistInfoDiv.style.flexWrap = "wrap";
                playlistInfoDiv.style.justifyContent = "left";
    
                result.items.forEach(function (item) {
                    
                    let track = item.track;
                    let album = track.album;
                    let artists = track.artists;
                    let images = album.images;

                    // Display track information
                    let trackInfo = document.createElement("div");
                    trackInfo.style.margin = "6px";
                    trackInfo.style.padding = "10px";
                    trackInfo.style.Width = "180px"; 
                    trackInfo.style.maxWidth = "180px";
                    trackInfo.style.height = "350px";
                    trackInfo.style.textAlign = "center";
                    trackInfo.style.backgroundColor = "#222222";
                    trackInfo.style.borderRadius = "5px";

                    // Images
                    let imagesContainer = document.createElement("div");
    
                    let img = document.createElement("img");
                    img.src = images[1].url;
                    img.alt = "Album Cover";
                    img.width = 150;
                    img.height = 150;
    
                    imagesContainer.appendChild(img);
                    trackInfo.appendChild(imagesContainer);

    
                    // Track Name Artist and ALbum
                    let trackName = document.createElement("p");
                    trackName.innerHTML = "Track Name: " + "<br>" + track.name;
                    let artistsNames = artists.map(function (artist) {
                        return artist.name;
                    }).join(", ");
                    

                    trackInfo.append(trackName);
                    trackInfo.append("Artists: " + artistsNames);
                    let lineBreakElement = document.createElement("br");
                    trackInfo.appendChild(lineBreakElement);
                    trackInfo.append("Album: " + album.name);

                    // Add a line break between tracks
                    let lineBreak = document.createElement("hr");
                    trackInfo.appendChild(lineBreak);
    
                    playlistInfoDiv.appendChild(trackInfo);
                });
                /*Not working
                    // A button to clear tracklist
                    let clearButton1 = $('<br> <button id="buttonClear1">Clear</button>');
                    playlistInfoDiv.append(clearButton1);
                    $("#buttonClear1").on("click", function(){
                        playlistInfoDiv.empty();
                    });
                */
            },
            error: function () {
                alert('Request failed!');
            }
    
        });
    };
    



    /////Get Developers of this app
        $('#buttonDevelopers').on('click', function(){
            let url = "group.json";
                $.ajax({
                    url: url,
                    dataType: 'json',
                    success: function(result) {
                        let containerDevs = $('#result');
                        containerDevs.empty(); // Clear previous results
                        
                            result.developers.forEach(function (member) {
                                containerDevs.append('<p>' + member + '</p>');
                            });
                    },
                    error: function (xhr, status, error) {
                        console.error("Error loading JSON:", status, error);
                    }
                });
         })
            



});