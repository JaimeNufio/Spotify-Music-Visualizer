(function() {

  var stateKey = 'spotify_auth_state';
  var Tracks = 1000; //data called from library temporary
  var TracksCollect = [];
  var DumpAttributes = [];

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
      console.log("done with ajax");
  });

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

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');

      oauthSource = document.getElementById('oauth-template').innerHTML,
      oauthTemplate = Handlebars.compile(oauthSource),
      oauthPlaceholder = document.getElementById('oauth');

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
            userProfilePlaceholder.innerHTML = userProfileTemplate(response);

      //      $('#login').hide();
        //    $('#loggedin').show();
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
      //  $('#login').show();
       // $('#loggedin').hide();
    }

    document.getElementById('login-button').addEventListener('click', function() {

      var client_id = 'e80925f0ded1400d9e4a8c2ac9c7f449'; // Your client id
      var redirect_uri = 'http://localhost:8888'; // Your redirect uri

      var state = generateRandomString(16);

      localStorage.setItem(stateKey, state);
      var scope ="user-library-read user-read-private user-read-email";

      var url = 'https://accounts.spotify.com/authorize';
      url += '?response_type=token';
      url += '&client_id=' + encodeURIComponent(client_id);
      url += '&scope=' + encodeURIComponent(scope);
      url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
      url += '&state=' + encodeURIComponent(state);
      window.location = url;
 

    }, false);
	
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
	

document.getElementById('analyze').addEventListener('click',function(){
    //let time = 50;
    let songs=[]
    let base = "https://api.spotify.com/v1/audio-features/";
    let count = 0;
    for(let i = 0; i<TracksCollect.length;i++) {
        setTimeout(function() {
         $.ajax({
          url: base+TracksCollect[i]['id'],
          type: 'GET',
          headers: { 
            'Authorization' : 'Bearer ' + access_token
          },
          success: function(data){
              console.log(data);
              DumpAttributes.push(data);
             // count++;
          } 
        });
        },105*i);
    }
    },false); 


  

  }
})();