let width=window.innerWidth;
let height=window.innerHeight;

let ball={
    ball: document.getElementById("ball"),
    currPosX: (width/2-20),
    currPosY: (height-40-28),
    direction: 90
};
  
let bat1={
    bat: document.getElementById("player-1-bat"),
    currPos: (width/2-100)
};
let bat2={
    bat: document.getElementById("player-2-bat"),
    currPos: (width/2-100)
};

// if there is no data for user scores in the local storage thaan set them to zero
if(!localStorage.getItem("player1"))
    localStorage.setItem("player1",0);
if(!localStorage.getItem("player2"))
    localStorage.setItem("player2",0);

let hasGameStarted = false;
let losingSound = new sound("https://pic.pikbest.com/00/23/22/84B888piCge9.mp3");
let cheering = new sound("http://www.orangefreesounds.com/wp-content/uploads/2017/02/Large-crowd-cheering-and-clapping-sound-effect.mp3?_=1");
//for changing with any change in the view port

var lastAlertTime=Date.now()-5001;
function patientAlert(message){
    if(Date.now()-lastAlertTime>5000){
        this.window.alert(message);
        lastAlertTime=Date.now();
    }
}

function monitorViewport(){
    if(window.innerWidth!=width){
        width=window.innerWidth;
        centerStuff();
				if(document.hasFocus())
      		patientAlert("hey don't change the browser dimensions its cheating !!!!");
    }
    else if(window.innerHeight!=height){
        height=window.innerHeight;
        centerStuff();
				if(document.hasFocus())
      		patientAlert("hey don't change the browser dimensions its cheating !!!!");
    }
}
setInterval(monitorViewport, 200);


function centerStuff(){
    bat1.currPos = (width/2-100);
    bat1.bat.style.left = bat1.currPos+"px";

    bat2.currPos = (width/2-100);
    bat2.bat.style.left = bat2.currPos+"px";

    ball.currPosX = (window.innerWidth/2-20);
    ball.currPosY = (window.innerHeight-40-28);
    ball.ball.style.left=ball.currPosX+"px";
    ball.ball.style.top=ball.currPosY+"px";

}

function newGame(){
    localStorage.setItem("player1",0);
    localStorage.setItem("player2",0);
    initialize();
}

initialize();
function initialize(){
    

    document.getElementById("score-player-1").innerHTML =  localStorage.getItem("player1");
    document.getElementById("score-player-2").innerHTML =  localStorage.getItem("player2");
    
    ball.direction = 90;

    //to add start Game overlay
    document.getElementById("overlay").classList.add("overlay");


    // game will start on the overlay sreen no matter where you click
    document.addEventListener('click', startGame);
    function startGame(){
        document.getElementById("overlay").classList.remove("overlay");
        console.log('start')
        if(!hasGameStarted){
            hasGameStarted=true;
            playGame();
            centerStuff();
        }
        document.removeEventListener('click', startGame)
    }
}

addControls();
function addControls(){
    function addBatFunctionality(){
        const left=-22.5;
        const right=22.5;
        let keysPressed = {};

        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            keysPressed[event.key] = false;
        });
        function checkKeysPressed(){
            if(keysPressed["a"] || keysPressed["A"])
                moveBat(bat1,left);
            if(keysPressed["d"] || keysPressed["D"])
                moveBat(bat1,right);
            if(keysPressed["ArrowLeft"])
                moveBat(bat2,left);
            if(keysPressed["ArrowRight"])
                moveBat(bat2,right);
        }
        setInterval(checkKeysPressed, 15);
        function moveBat(bat, direction){
            let willBatReamainInBoundry = (bat.currPos+direction+200<width && bat.currPos+direction>0);
            if(willBatReamainInBoundry)
                bat.currPos+=direction;
            bat.bat.style.left = bat.currPos+"px";
        }
    }
    addBatFunctionality();
}

function playGame(){

    
    var ballMoving = setInterval(moveBall, 8);
    distancePerFrame=5;
    function moveBall(){
        var factorToConvertToDegreeFromRadians = Math.PI/180
        let x = distancePerFrame * Math.cos(ball.direction * factorToConvertToDegreeFromRadians);
        let y = -distancePerFrame * Math.sin(ball.direction * factorToConvertToDegreeFromRadians);

        if(ball.currPosX+x+40>width){
            x = width-ball.currPosX-40;
            ball.direction = 180-ball.direction; 
            let wallHittingSound = new sound("https://audio-previews.elements.envatousercontent.com/files/158715032/preview.mp3");
            wallHittingSound.makeVolume(0.4);
            wallHittingSound.play();
        }
        else if(ball.currPosX+x<-10){
            x = -ball.currPosX-10;
            ball.direction = 180-ball.direction; 
            let wallHittingSound = new sound("https://audio-previews.elements.envatousercontent.com/files/158715032/preview.mp3");
            wallHittingSound.makeVolume(0.4);
            wallHittingSound.play();
        }
        if(ball.currPosY+y+40>height-20){
            y = height-ball.currPosY-40-20;
            var distance = ball.currPosX+20-bat2.currPos-100;1
            distancePerFrame+=0.1;
            if(Math.abs(distance)>120){
                won("player1");
            }
            else{
                ball.direction = 90 - distance*(80/120);
                let batHitSound = new sound("https://sounds.pond5.com/ping-pong-table-tennis-bat-sound-effect-049590987_prev.m4a");
                batHitSound.play();
            }
        }
        else if(ball.currPosY+y < 20){
            y = -ball.currPosY+20;
            var distance = ball.currPosX+20-bat1.currPos-100;
            distancePerFrame+=0.1;
            if(Math.abs(distance)>120){
                won("player2");
            }
            else{
                ball.direction = 270 + distance*(80/120);
                let batHitSound = new sound("https://sounds.pond5.com/ping-pong-table-tennis-bat-sound-effect-049590987_prev.m4a");
                batHitSound.play();
            }
        }
        
            moveBallBy(x, y);
    }

    function won(player){
        losingSound.play();
        localStorage.setItem(player, parseInt(localStorage.getItem(player))+1);
        clearInterval(ballMoving);
        hasGameStarted = false;
        initialize();
        setTimeout(function(){
            cheering.play();
            setTimeout(function(){
                cheering.reduceVolumeGradually(2500, 0);
            }, 1500);
        }, 1000);
    }

    function moveBallBy(x,y){
        ball.currPosX+=x;
        ball.currPosY+=y;
        ball.ball.style.left=ball.currPosX+"px";
        ball.ball.style.top=ball.currPosY+"px";
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
    this.makeVolume = function(volume){
        this.sound.volume = volume;
    }
    this.reduceVolumeGradually = function(time,endVolume){
        if(!endVolume)
            endVolume=0;
        if(!time)
            time=2000;
        let interval = 50*(this.sound.volume-endVolume)/time;
        let decreasingVolume = setInterval( ()=>{
            if(this.sound.volume<interval){
                clearInterval(decreasingVolume);
                this.sound.pause();
                this.sound.volume = 1;
            }
            else
            this.sound.volume -= interval;
        },50);
        
    }
  } 
