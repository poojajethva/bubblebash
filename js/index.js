let subject = document.getElementById('player'),
gameZone = document.getElementById('gameZone'),
score = 0;

function changePosition(code){
    let gameZoneRect = gameZone.getBoundingClientRect(),
    subjectRect = subject.getBoundingClientRect(),
    subjectOffsetTop = subject.offsetTop,
    gameZoneOffsetTop = gameZone.offsetTop;
    
    if (code == '38') {
        // up arrow
        if(subjectOffsetTop > gameZoneOffsetTop){
            subject.style.top = (parseInt(subjectOffsetTop - 10)) + "px";
        } 
    }
    else if (code == '40') {
        // down arrow
        if(subjectRect.bottom < gameZoneRect.bottom - 30 ){
            subject.style.top = (parseInt(subjectOffsetTop + 10)) + "px";
        }
    }
}

document.addEventListener('keydown', function(e){
    changePosition(e.keyCode);
});

document.querySelector('#up').addEventListener('click', function(e){
    changePosition(38);
});

document.querySelector('#down').addEventListener('click', function(e){
    changePosition(40);
});

function createObstacles(){
    let div = document.createElement("div"),
    randomSize = between(50, 150),
    randomPos = between(1,100);
    div.classList.add("obstacle", "posAbso");
    div.style.width = randomSize+"px";
    div.style.height = randomSize+"px";
    div.style.top = randomPos+"%";
    
    gameZone.appendChild(div);
    score++;
}

function showScore(){
    let scoreEle = document.querySelectorAll('.scoreVal').forEach(function(ele){
        ele.innerText = score;
    })
}

function resetScore(){
    document.querySelectorAll('.scoreVal').forEach(function(ele){
        ele.innerText = 0;
    })
    score = 0;
}

function deleteObstacles(){
    let obstacleEles = document.querySelectorAll('.obstacle');
    let randomChildIndex = between(0, obstacleEles.length-1);
    obstacleEles[randomChildIndex].parentNode.removeChild(obstacleEles[randomChildIndex]);
}

function between(min, max) {  
    return Math.floor(Math.random() * (max - min) + min)
}

createObstacles();

(function loop() {
    var rand = Math.round(Math.random() * (3000 - 500)) + 500;
    let obsTimer = setTimeout(function() {
        createObstacles();
        if(document.querySelectorAll('.obstacle').length > 5)
        deleteObstacles();
        loop();  
    }, rand);
    return {
        resetTimer: function(){
            clearTimeout(obsTimer);
        }
    }
}());

function checkCollision() {
    let subjectRect = subject.getBoundingClientRect(),
    obstacleEles = document.querySelectorAll('.obstacle');
    
    for(let i = 0; i < obstacleEles.length; i++){
        if((subjectRect.right >= obstacleEles[i].getBoundingClientRect().left &&
        subjectRect.left <= obstacleEles[i].getBoundingClientRect().right) &&
        (subjectRect.bottom >= obstacleEles[i].getBoundingClientRect().top &&
        subjectRect.top <= obstacleEles[i].getBoundingClientRect().bottom)){
            return true;
        }
        
    }
    return false;
}

function gameOver(){
    document.querySelector('.gameOver').style.display = "flex";
    subject.style.display = "none";
}

document.querySelector('#howtoplay').addEventListener('click', function(e){
    document.querySelector('.howtoplaySec').style.display = "flex";
});

document.querySelector('#close').addEventListener('click', function(e){
    document.querySelector('.howtoplaySec').style.display = "none";
});

document.querySelector('#retry').addEventListener('click', function(e){
    document.querySelector('.gameOver').style.display = "none";
    reset();
});

function reset(){
    subject.style.display = "block";
    resetScore();
    removeAllChildNodes();
    gameStatus = setInterval(checkCollisionInterval, 10);
}
function removeAllChildNodes(parent) {
    let obstacleEles = document.querySelectorAll('.obstacle');
    for(let i=0; i<obstacleEles.length;i++){
        obstacleEles[i].parentNode.removeChild(obstacleEles[i]);
    }
}

let gameStatus = setInterval(checkCollisionInterval, 10);

function checkCollisionInterval(){
    if(checkCollision()){
        gameOver();
        clearInterval(gameStatus);
    } else {
        showScore();
    }
}