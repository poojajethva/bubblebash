let subject = document.getElementById('player'),
gameZone = document.getElementById('gameZone');


document.addEventListener('keydown', function(e){
    e = e || window.event;
    let gameZoneRect = gameZone.getBoundingClientRect(),
    subjectRect = subject.getBoundingClientRect(),
    subjectOffsetTop = subject.offsetTop,
    gameZoneOffsetTop = gameZone.offsetTop;
    
    if (e.keyCode == '38') {
        // up arrow
        if(subjectOffsetTop > gameZoneOffsetTop){
            subject.style.top = (parseInt(subjectOffsetTop - 10)) + "px";
        } 
    }
    else if (e.keyCode == '40') {
        // down arrow
        if(subjectRect.bottom < gameZoneRect.bottom - 30 ){
            subject.style.top = (parseInt(subjectOffsetTop + 10)) + "px";
        }
    }
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
}

function deleteObstacles(){
    let obstacleEles = document.querySelectorAll('.obstacle');
    let randomChildIndex = between(0, obstacleEles.length-1);
    obstacleEles[randomChildIndex].parentNode.removeChild(obstacleEles[randomChildIndex]);
}

function between(min, max) {  
    return Math.floor(Math.random() * (max - min) + min)
}

(function loop() {
    var rand = Math.round(Math.random() * (3000 - 500)) + 500;
    setTimeout(function() {
        createObstacles();
        if(document.querySelectorAll('.obstacle').length > 5)
            deleteObstacles();
        loop();  
    }, rand);
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

let gameStatus = setInterval(function(){
    if(checkCollision()){
        gameOver();
        clearInterval(gameStatus);
    }
}, 10);
