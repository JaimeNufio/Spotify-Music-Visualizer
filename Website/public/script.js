(function() {

  var loggedin =false;

  var stateKey = 'spotify_auth_state';
  var Tracks = 1000; //data called from library temporary
  var TracksCollect = [];
  var DumpAttributes = [];

  var CurrentSongStats = {
    "valence":0,
    "instrumentalness":0,
    "energy":0,
    "acousticness":0,
    "loudness":0,
    "mode":0,
    "speechiness":0,
    "tempo":0,
    "danceability":0,
  };

  var CurrentSong = {
    "uri": "",
    "coverArt": "",
    "artistName": "",
    "SongName": "",
    "playing":"",
  };

  var averages = {
    "valence":0,
    "instrumentalness":0,
    "energy":0,
    "acousticness":0,
    "loudness":0,
    "mode":0,
    "speechiness":0,
    "tempo":0,
    "danceability":0,
  }

  //Parametrisize between colors
  function paraColor(color1,color2,t,max){
    let R = color1[0];
    let G = color1[1];
    let B = color1[2];

    let Rt = (color2[0]-color1[0])/(max);
    let Gt = (color2[1]-color1[1])/(max);
    let Bt = (color2[2]-color1[2])/(max);

    return "rgba("+((R+(Rt*t)))+","+((G+(Gt*t)))+","+((B+Bt*t))+",255)";

  }

  function moodColor(t,max){
    let colors=["#6626d5","#2689d5","#27d55e","#f4d442","#f44242"];
    let num = (t/max)*1000;

    col = colors[0];
    if (num >250){
      col = colors[1];
    }
    if (num >500){
      col = colors[2];
    }
    if (num >750){
      col = colors[3];
    }
    if (num >850){
      col = colors[4];
    }
    return col;
  }

/*
  for(let i =0;i<1000;i+=10){
  console.log(paraColor([255,0,0],[0,0,255],i,999));
  }
*/
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  $(document).ajaxStop(function () {
     // console.log("done with ajax");
  });

  $('#tempo').css('background-color','rgb(64,178,60)');
  $('#dance').css('background-color','rgb(64,178,60)');
  $('#energy').css('background-color','rgb(64,178,60)');
  $('#valence').css('background-color','rgb(64,178,60)');
  $('#speechiness').css('background-color','rgb(64,178,60)');
  $('#loud').css('background-color','rgb(64,178,60)');


  /*
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  function listOfURI(offset){
    let str = "";
    for (let i=offset; i<offset+100; i++){
      

      if (TracksCollect[i]){
        str+=TracksCollect[i]['id'];
      }

      if (i!=99){
        str+=",";
      }

   } 
    return str;
  }
/*
  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');

      oauthSource = document.getElementById('oauth-template').innerHTML,
      oauthTemplate = Handlebars.compile(oauthSource),
      oauthPlaceholder = document.getElementById('oauth');

*/
  var params = getHashParams();

  var access_token = params.access_token,
      state = params.state,
      storedState = localStorage.getItem(stateKey);

  if (access_token && (state == null || state !== storedState)) {
    alert('There was an error during the authentication');
  } else {
    localStorage.removeItem(stateKey);
    if (access_token) {
      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
           // userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          loggedin = true;
          $('#login').hide();
          $('#loggedin').show();
        //  $("#NoMusic").hide();
          $("#YesMusic").hide();
          $("#welcome").hide();
          }
      });
      //Establish how many Tracks we need to retrieve
      $.ajax({
          url: "https://api.spotify.com/v1/me/tracks?limit=1",
          type: 'GET',
          headers: { 
            'Authorization' : 'Bearer ' + access_token
          },
          success: function(data){Tracks=data['total'];console.log("Tracks:"+Tracks)  } 
        });
    } else {
        $('#login').show();
        $('#loggedin').hide();
        $("#foot").hide();
        $("#welcome").show();
      
    }

//Login with Spotify
  document.getElementById('login-button').addEventListener('click', function() {

    var client_id = 'e80925f0ded1400d9e4a8c2ac9c7f449'; // Your client id
    var redirect_uri = 'http://localhost:8888'; // Your redirect uri

    var state = generateRandomString(16);

    localStorage.setItem(stateKey, state);
    var scope ="user-library-read user-read-private user-read-email user-read-currently-playing user-read-playback-state";

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);
    window.location = url;


  }, false);

    setInterval(function(){ if(loggedin){
      $.ajax({
          url: 'https://api.spotify.com/v1/me/player/currently-playing',
          type: 'GET',
          headers: { 
            'Authorization' : 'Bearer ' + access_token
          },
          success: function(data){
            let artist = "";

            for (let i = 0; i<data['item']['artists'].length;i++){

              artist+=data['item']['artists'][i]['name'];

              if(i!=data['item']['artists'].length-1){
                artist+=",";  
              }
            }
            CurrentSong['uri'] = data['item']['id'];
            CurrentSong['coverArt'] = data['item']['album']['images'][0]['url'];
            CurrentSong['artistName'] = artist;
            CurrentSong['SongName'] = data['item']['name'];
            CurrentSong['playing'] = (data['is_playing']&&data['currently_playing_type']=='track');
          },error: function(response){
            CurrentSong['uri'] = "";
            CurrentSong['coverArt'] = "";
            CurrentSong['artistName'] = "";
            CurrentSong['SongName'] = "";
            CurrentSong['playing'] = false;
          },statusCode:{
            500:function(){
            //console.log(CurrentSong);
          }
        }
      });
      ///*

      if (CurrentSong['playing']){

        $("#Title").html(CurrentSong['SongName']);
        $("#Artist").html(CurrentSong['artistName']);
        $("#AlbumImage").attr("src",CurrentSong['coverArt']);
        $("#NoMusic").hide();
        $("#YesMusic").show();

         $.ajax({
          url: "https://api.spotify.com/v1/audio-features/"+CurrentSong['uri'],
          type: 'GET',
          headers: { 
            'Authorization' : 'Bearer ' + access_token
          },
          success: function(data){
          //  CurrentSongStats['instrumentalness']=data['instrumentalness'];
            CurrentSongStats['valence']=data['valence']*1000;
            CurrentSongStats['acousticness']=data['acousticness']*1000;
           // CurrentSongStats['loudness']=data['loudness'];
            CurrentSongStats['danceability']=data['danceability']*1000;
            CurrentSongStats['energy']=data['energy']*1000;
            CurrentSongStats['tempo']=(data['tempo']/200)*1000;
            CurrentSongStats['loudness']=((data['loudness']+20)/20)*1000;
           // console.log("Loudness:"+(data['speechiness']));
          } 
        });
         // console.log(CurrentSongStats)
        
      }else{
        $("#NoMusic").show();
        $("#YesMusic").hide();
        CurrentSongStats['valence']=0;
        CurrentSongStats['speechiness']=0;
        CurrentSongStats['danceability']=0;
        CurrentSongStats['energy']=0;
        CurrentSongStats['loudness']=0;
        CurrentSongStats['acousticness']=0;
        CurrentSongStats['tempo']=0;
      }//*/
        $('#dance').css('width', CurrentSongStats['danceability']/10+'%').attr('aria-valuenow', CurrentSongStats['danceability']);
        $('#dance').css('background-color',moodColor(CurrentSongStats['danceability'],1000));
        $('#energy').css('width', CurrentSongStats['energy']/10+'%').attr('aria-valuenow', CurrentSongStats['energy']);
        $('#energy').css('background-color',moodColor(CurrentSongStats['energy'],1000));
        $('#valence').css('width', CurrentSongStats['valence']/10+'%').attr('aria-valuenow', CurrentSongStats['valence']);
        $('#valence').css('background-color',moodColor(CurrentSongStats['valence'],1000));
        $('#acousticness').css('width', CurrentSongStats['acousticness']/10+'%').attr('aria-valuenow', CurrentSongStats['acousticness']);
        $('#acousticness').css('background-color',moodColor(CurrentSongStats['acousticness'],1000));
        $('#loud').css('width', CurrentSongStats['loudness']/10+'%').attr('aria-valuenow', CurrentSongStats['loudness']); 
        $('#loud').css('background-color',moodColor(CurrentSongStats['loudness'],1000));
        $('#tempo').css('width', CurrentSongStats['tempo']/10+'%').attr('aria-valuenow', CurrentSongStats['loudness']); 
        $('#tempo').css('background-color',moodColor(CurrentSongStats['tempo'],1000));
   //  $("#foot").show();
    //console.log(CurrentSongStats);
   }}, 900);
	
//Collect songs from USER LIBRARY
//TODO: Write versions for Album, Playlists, and Individual Songs (Next: Current Song)
//TODO: Don't individual songs have a listing for Albums? Perhaps there's a genre track there

  document.getElementById('test').addEventListener('click',function(){
	//let time = 50;
  let songs=[]
  let next = "https://api.spotify.com/v1/me/tracks?limit=50&offset=0";
  let count = 0;
	for(let i = 0; i<(Tracks/50)+1;i++) {
			 $.ajax({
				url: "https://api.spotify.com/v1/me/tracks?limit=50&offset="+((i)*50),
				type: 'GET',
				headers: { 
					'Authorization' : 'Bearer ' + access_token
				},
				success: function(data){
          for (let j = 0; j<data['items'].length;j++){
          //  console.log("FUCK");
            console.log(data['items'][j]['track']['name']);// console.log(i); 
            TracksCollect.push(data['items'][j]['track'])
            count++;
          }

        }	
			});
	      
	}
 // console.log("DONE");
  },false);	


//Requires an array of URI's, but should work no matter the sequence
document.getElementById('analyze').addEventListener('click',function(){
    let base = "https://api.spotify.com/v1/audio-features/?ids=";
    for(let i = 0; i<(TracksCollect.length/100)+1; i++) {
        setTimeout(function() {
         $.ajax({
          url: base+listOfURI(100*i),
          type: 'GET',
          headers: { 
            'Authorization' : 'Bearer ' + access_token
          },
          success: function(data){
              //console.log(data['audio_features']);
              //console.log(i);
              for (let j = 0; j<100;j++){
                if (data['audio_features'][j]){
                  DumpAttributes.push(data['audio_features'][j]);
                  console.log(i);
                }
              }
          } 
        });
        },5*i);
    }
    },false); 


//TODO: chain these functions, probably keep a count of Tracks and check to trigger this part
//This function is independent on what process is used to collect songs
document.getElementById('averages').addEventListener('click',function(){

/*
"valence":0,
"instrumentals":0,
"energy":0,
"acousticness":0,
"loudness":0,
"mode":0,
"speechiness":0,
"tempo":0,
*/    

  for (let i = 0; i<DumpAttributes.length; i++){
    averages['valence']+=DumpAttributes[i]['valence'];
    averages['instrumentalness']+=DumpAttributes[i]['instrumentalness'];
    averages['energy']+=DumpAttributes[i]['energy'];
    averages['acousticness']+=DumpAttributes[i]['acousticness'];
    averages['loudness']+=DumpAttributes[i]['loudness'];
    averages['mode']+=DumpAttributes[i]['mode'];
    averages['speechiness']+=DumpAttributes[i]['speechiness'];
    averages['tempo']+=DumpAttributes[i]['tempo'];
    averages['danceability']+=DumpAttributes[i]['danceability'];
  }
  averages['valence']/=Tracks;
  averages['instrumentalness']/=Tracks;
  averages['energy']/=Tracks;
  averages['acousticness']/=Tracks;
  averages['loudness']/=Tracks;
  averages['mode']/=Tracks;
  averages['speechiness']/=Tracks;
  averages['tempo']/=Tracks;
  averages['danceability']/=Tracks;
  console.log(averages);
  },false); 


  }
})();