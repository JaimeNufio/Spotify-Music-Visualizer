  var CurrentSong = {
    "uri": "",
    "coverArt": "",
    "artistName": "",
    "SongName": "",
    "playing":"",
    "valence":0,
    "instrumentalness":0,
    "energy":0,
    "acousticness":0,
    "loudness":0,
    "mode":0,
    "speechiness":0,
    "tempo":0,
    "danceability":0,
    "progress":0,
    "trueLoudness":0,
    "segments":[],
    "amplitudeMod":0,
  };

(function() {

  var loggedin =false;

var col = 950;

  var stateKey = 'spotify_auth_state';
  var Tracks = 1000; //data called from library temporary
  var TracksCollect = [];
  var DumpAttributes = [];

 var CurrSegment={};

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
          $("#foot").hide();
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
     //   $("#foot").hide();
        $("#welcome").show();
      
    }


//Login with Spotify
  document.getElementById('login-button').addEventListener('click', function() {

    var client_id = 'e80925f0ded1400d9e4a8c2ac9c7f449'; // Your client id
    var redirect_uri = "http://www.spotifystats.com/"//"http://localhost:5000"
    //'http://www.spotifystats.com/'; // Your redirect uri

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

//keep a global memory of where the last 
var lastIndex = 0;
function searchForNext(items,time){
 // for (let i = 0; i<items.length; i++){
   //console.log(items[i])
 // }
 //console.log('serch')
  for (let i = lastIndex; i<items.length;i++){
    //console.log(i)
   // console.log(items[i]);
  // console.log(time)
   // console.log(items[i])
   //console.log(items[i]['start']);
// console.log(CurrentSong['progress'])
   if (items[i]['start'] >= CurrentSong['progress']-25){
      lastIndex = i;
     // console.log(items[i]);
      CurrSegment=items[i];
      let effective = ((items[i]['loudness_max']-CurrentSong['trueLoudness'])/CurrentSong['trueLoudness']);
      CurrentSong['amplitudeMod'] = effective;
      console.log(effective);//(items[i]['loudness_max']-(CurrentSong['trueLoudness']/1000))/(CurrentSong['trueLoudness']/1000))
       // $('#loud').css('width', (500*(effective+1))/1000+'%').attr('aria-valuenow', 500*(effective+1) ); 
      //searchForImportant(items[i]['pitches']);
      break;
    }
  }
  //console.log('searched')
}

function searchForImportant(items){
  let found = [];
  for (let i = 0; i<items.length;i++){
    if (items[i] > .85){
      found.push(i);
    }
  }
  console.log(found);
}


//the loop that must run to get updated information on music
setInterval(function(){ if(loggedin){

      $.ajax({
          url: 'https://api.spotify.com/v1/me/player/currently-playing',
          type: 'GET',
          headers: { 
            'Authorization' : 'Bearer ' + access_token
          },
          success: function(data){

            if (CurrentSong['uri'] != data['item']['id'] && data['is_playing']){

               let artist = "";

              for (let i = 0; i<data['item']['artists'].length;i++){

                artist+=data['item']['artists'][i]['name'];

                if(i!=data['item']['artists'].length-1){
                  artist+=",";  
                }
              }

              console.log("song changed");
              lastIndex=0;
              CurrentSong['uri'] = data['item']['id'];
              CurrentSong['coverArt'] = data['item']['album']['images'][0]['url'];
              CurrentSong['artistName'] = artist;
              CurrentSong['SongName'] = data['item']['name'];
              CurrentSong['playing'] = (data['is_playing']&&data['currently_playing_type']=='track');
              //Analysis
               $.ajax({
                url: "https://api.spotify.com/v1/audio-analysis/"+CurrentSong['uri'],
                type: 'GET',
                headers: { 
                  'Authorization' : 'Bearer ' + access_token
                },
                success: function(data){
                  //console.log(data)
                  CurrentSong['segments']=data['segments'];
                //  console.log(CurrentSong['segments'])
                console.log(data['loudness'])
                } 
              });
            }
            if(data['is_playing']){
             // console.log(CurrentSong['progress'])
              CurrentSong['progress'] = data["progress_ms"]/1000;
              searchForNext(CurrentSong['segments'],CurrentSong['progress'])

            }
          },error: function(response){
            /*
            CurrentSong['uri'] = "";
            CurrentSong['coverArt'] = "";
            CurrentSong['artistName'] = "";
            CurrentSong['SongName'] = "";
            CurrentSong['playing'] = false;
            */
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

        //Features
         $.ajax({
          url: "https://api.spotify.com/v1/audio-features/"+CurrentSong['uri'],
          type: 'GET',
          headers: { 
            'Authorization' : 'Bearer ' + access_token
          },
          success: function(data){
          //  CurrentSong['instrumentalness']=data['instrumentalness'];
            CurrentSong['valence']=data['valence']*1000;
            CurrentSong['acousticness']=data['acousticness']*1000;
           // CurrentSong['loudness']=data['loudness'];
            CurrentSong['danceability']=data['danceability']*1000;
            CurrentSong['energy']=data['energy']*1000;
            CurrentSong['tempo']=(data['tempo']/200)*1000;
            CurrentSong['loudness']=((data['loudness']+20)/20)*1000;
            CurrentSong['trueLoudness']=data['loudness'];
           // console.log("Loudness:"+(data['speechiness']));
          } 
        });
         // console.log(CurrentSong)
        
      }else{
        $("#NoMusic").show();
        $("#YesMusic").hide();
        $("#debug").hide();
        CurrentSong['valence']=0;
        CurrentSong['speechiness']=0;
        CurrentSong['danceability']=0;
        CurrentSong['energy']=0;
        CurrentSong['loudness']=0;
        CurrentSong['acousticness']=0;
        CurrentSong['tempo']=0;
        speed = 0*ctx.canvas.width;
      }//*/
        //console.log(getColorFromRange(1000,1000));

        $('#dance').css('width', CurrentSong['danceability']/10+'%').attr('aria-valuenow', CurrentSong['danceability']);
        $('#dance').css('background-color',moodColor(CurrentSong['danceability'],1000));
        $('#energy').css('width', CurrentSong['energy']/10+'%').attr('aria-valuenow', CurrentSong['energy']);
        $('#energy').css('background-color',moodColor(CurrentSong['energy'],1000));
        $('#valence').css('width', CurrentSong['valence']/10+'%').attr('aria-valuenow', CurrentSong['valence']);
        $('#valence').css('background-color',moodColor(CurrentSong['valence'],1000));
        $('#acousticness').css('width', CurrentSong['acousticness']/10+'%').attr('aria-valuenow', CurrentSong['acousticness']);
        $('#acousticness').css('background-color',moodColor(CurrentSong['acousticness'],1000));
        $('#loud').css('width', CurrentSong['loudness']/10+'%').attr('aria-valuenow', CurrentSong['loudness']); 
        $('#loud').css('background-color',moodColor(CurrentSong['loudness'],1000));
        $('#tempo').css('width', CurrentSong['tempo']/10+'%').attr('aria-valuenow', CurrentSong['loudness']); 
        $('#tempo').css('background-color',moodColor(CurrentSong['tempo'],1000));

        if (CurrentSong['tempo']>0){
          ampMax = (CurrentSong['energy']/10);
          speed = (CurrentSong['tempo']/5000)*ctx.canvas.width;
          spd2 = CurrentSong['energy']/500;
          freq = CurrentSong['energy']/200;
        }

   //  $("#foot").show();
    //console.log(CurrentSong);
   }}, 200);
	
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
           //** console.log(data['items'][j]['track']['name']);// console.log(i); 
           //*** TracksCollect.push(data['items'][j]['track'])
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
