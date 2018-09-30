

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
setInterval(function(){


  col=col+10>1000?0:col+10;

 // $("#0").css("background-color",getColorFromRange(col,1000));
 // $("#1").css("background-color",getCompliment(col,1000));

  let set=getPalette(col,1000,.7,4);
  console.log("Percent: "+(col/1000)*100);
  for (let i = 0; i<8; i++){
    //console.log(set[i])
    $("#"+i).css("background-color",set[i]);
  }

},500)
*/

  $('#tempo').css('background-color','rgb(64,178,60)');
  $('#dance').css('background-color','rgb(64,178,60)');
  $('#energy').css('background-color','rgb(64,178,60)');
  $('#valence').css('background-color','rgb(64,178,60)');
  $('#speechiness').css('background-color','rgb(64,178,60)');
  $('#loud').css('background-color','rgb(64,178,60)');

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

    let colo = colors[0];
    if (num >250){
      colo = colors[1];
    }
    if (num >500){
      colo = colors[2];
    }
    if (num >750){
      colo = colors[3];
    }
    if (num >850){
      colo = colors[4];
    }
    return colo;
  }


  function dst(a,b){
    return Math.abs(a-b);
  }


  function getColorFromRange(t,max,sat,lit){
    if (arguments.length == 2){
      let p1=50,p2=50;
      return "hsl("+(360*(t/max))+","+p1+"%,"+p2+"%)";
    } 
    return "hsl("+(360*(t/max))+","+sat*100+"%,"+lit*100+"%)";
  }

  function getCompliment(t, max){
    return getColorFromRange((t+(max/2))%max,max);
  }

  function getTriad(t,max){
    let pair = [];
    pair.push(getColorFromRange(t,max));
    for (let i =1;i<3;i++){
      pair.push(getColorFromRange((t+(max/3)*i)%max,max));
    }

    return pair;
  }

  function getPalette(t,max,tether,count){
    let pair = [];
    pair.push(getColorFromRange(t,max));
    tether*=90,
    upper=.4,
    lower=.7;
    for (let i =0; i<~~(count/2);i++){
      pair.push(getColorFromRange((t-(tether*i))%max,max,
        Math.random()*(upper-lower)+lower,
        Math.random()*(upper-lower)+lower));
    }
    for (let i =~~(count/2); i<count;i++){
      pair.push(getColorFromRange((t+(tether*i))%max,max,
        Math.random()*(upper-lower)+lower,
        Math.random()*(upper-lower)+lower));
    }
    return pair;
  }
