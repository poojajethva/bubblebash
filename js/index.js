function bubbleBash(){
    let eleObj = {
        player : document.getElementById('player'),
        gameZone : document.getElementById('gameZone'),
        upKey: document.querySelector('#up'),
        downKey: document.querySelector('#down'),
        rightKey: document.querySelector('#right'),
        leftKey: document.querySelector('#left'),
        howToPlay: document.querySelector('#howtoplay'),
        closeBtn: document.querySelector('#close'),
        retryBtn: document.querySelector('#retry'),
        howToPlaySec: document.querySelector('.howtoplaySec'),
        gameOverSec: document.querySelector('.gameOver'),
        scoreVal: document.querySelectorAll('.scoreVal'),
        highScoreVal: document.querySelector('.highScoreVal'),
        upKeyCode: 38,
        downKeyCode: 40,
        leftKeyCode: 37,
        rightKeyCode: 39,
        score: 0,
        gameStatus: '',
        mouseInterval: ['','','',''],
        maxObstaclesAtTime: 5,
        collisionInterval: 10,
        movingSteps: 10,
        initialPlayerPosition: {
            top: '30%',
            left: '10px'
        }
    };
    
    function changePosition(code){
        let gameZoneRect = eleObj.gameZone.getBoundingClientRect(),
        playerRect = eleObj.player.getBoundingClientRect(),
        playerOffsetTop = eleObj.player.offsetTop,
        gameZoneOffsetTop = eleObj.gameZone.offsetTop;
        
        if (code == eleObj.upKeyCode) {
            if(playerOffsetTop > gameZoneOffsetTop - 35){
                eleObj.player.style.top = (parseInt(playerOffsetTop - eleObj.movingSteps)) + "px";
            } 
        }
        else if (code == eleObj.downKeyCode) {
            if(playerRect.bottom < gameZoneRect.bottom - 20 ){
                eleObj.player.style.top = (parseInt(playerOffsetTop + eleObj.movingSteps)) + "px";
            }
        }
        else if (code == eleObj.rightKeyCode) {
            if(playerRect.right < gameZoneRect.right - 20){
                eleObj.player.style.left = (parseInt(playerRect.left + eleObj.movingSteps)) + "px";
            }
        }
        else if (code == eleObj.leftKeyCode) {
            if(playerRect.left > gameZoneRect.left + 20 ){
                eleObj.player.style.left = (parseInt(playerRect.left - eleObj.movingSteps)) + "px";
            }
        }
    }
    
    function createObstacles(){
        let div = document.createElement("div"),
        randomSize = between(20, 150),
        randomPos = between(1,100);
        div.classList.add("obstacle", "posAbso");
        let divStyle = div.style;
        divStyle.width = randomSize+"px";
        divStyle.height = randomSize+"px";
        divStyle.top = randomPos+"%";
        
        eleObj.gameZone.appendChild(div);
        eleObj.score++;
    }
    
    function showScore(){
        eleObj.scoreVal.forEach(function(ele){
            ele.innerText = eleObj.score;
        })
    }
    
    function resetScore(){
        eleObj.scoreVal.forEach(function(ele){
            ele.innerText = 0;
        })
        eleObj.score = 0;
    }
    
    function deleteObstacles(){
        let obstacleEles = document.querySelectorAll('.obstacle'), 
        randomChildIndex = between(0, obstacleEles.length-1);
        obstacleEles[randomChildIndex].parentNode.removeChild(obstacleEles[randomChildIndex]);
    }
    
    function between(min, max) {  
        return Math.floor(Math.random() * (max - min) + min)
    }
    
    function getObstaclesLoop() {
        let rand = Math.round(Math.random() * (3000 - 500)) + 500,
        obstacleEles = document.querySelectorAll('.obstacle');
        setTimeout(function() {
            createObstacles();
            if(obstacleEles.length > eleObj.maxObstaclesAtTime)
            deleteObstacles();
            getObstaclesLoop();  
        }, rand);
    }
    
    function checkCollision() {
        let playerRect = player.getBoundingClientRect(),
        obstacleEles = document.querySelectorAll('.obstacle'),
        extraPad = 10;
        
        for(let i = 0; i < obstacleEles.length; i++){
            let obstacleRectPos = obstacleEles[i].getBoundingClientRect();
            if((playerRect.right >= obstacleRectPos.left + extraPad && playerRect.left + extraPad <= obstacleRectPos.right) && (playerRect.bottom >= obstacleRectPos.top + extraPad && playerRect.top + extraPad <= obstacleRectPos.bottom)){
                return true;
            }
            
        }
        return false;
    }
    
    function gameOver(){
        eleObj.gameOverSec.style.display = "flex";
        eleObj.player.style.display = "none";
    }
    
    function reset(){
        let playerStyle = eleObj.player.style;
        playerStyle.display = "block";
        playerStyle.top = eleObj.initialPlayerPosition.top;
        playerStyle.left = eleObj.initialPlayerPosition.left;
        clearAllMouseInterval();
        resetScore();
        removeAllObstaclesEle();
        eleObj.gameStatus = setInterval(checkCollisionInterval, eleObj.collisionInterval);
    }
    
    function setHighestScore(){
        let storeScore = localStorage.getItem('bubbleScore');
        if(!storeScore){
            storeScore = eleObj.score;
            storeScore = storeScore > 0 ? storeScore : 0;
        } else if(eleObj.score > storeScore) {
            storeScore = eleObj.score;
        }
        localStorage.setItem('bubbleScore', storeScore);
        eleObj.highScoreVal.innerText = storeScore;
    }
    
    function setInitialHighestScore(){
        let storeScore = localStorage.getItem('bubbleScore');
        if(!storeScore){
            storeScore = 0;
        }
        eleObj.highScoreVal.innerText = storeScore;
    }
    
    function removeAllObstaclesEle() {
        let obstacleEles = document.querySelectorAll('.obstacle');
        for(let i=0; i<obstacleEles.length;i++){
            obstacleEles[i].parentNode.removeChild(obstacleEles[i]);
        }
    }
    
    function checkCollisionInterval(){
        if(checkCollision()){
            setHighestScore();
            gameOver();
            clearInterval(eleObj.gameStatus);
        } else {
            showScore();
        }
    }
    
    function addListenerMulti(element, eventNames, listener) {
        var events = eventNames.split(' ');
        for (var i=0, iLen=events.length; i<iLen; i++) {
            element.addEventListener(events[i], listener, false);
        }
    }
    
    function clearAllMouseInterval(){
        for(let i=0;i<eleObj.mouseInterval.length;i++)
        clearIntervalTouchEvent(i);
    }
    
    let changePositionMouseAndTouchEvent = function (code, interValNo){
        eleObj.mouseInterval[interValNo] = setInterval(function(){
            changePosition(code)
        }, 50);
    }
    
    let clearIntervalTouchEvent = function(interValNo){
        clearInterval(eleObj.mouseInterval[interValNo]);  
    }
    
    function eventListners(){
        document.addEventListener('keydown', function(e){
            changePosition(e.keyCode);
        });
        
        addListenerMulti(eleObj.upKey, 'touchstart mousedown', () => changePositionMouseAndTouchEvent(eleObj.upKeyCode, 0));
        addListenerMulti(eleObj.upKey, 'touchend mouseup', () => clearIntervalTouchEvent(0));
        
        addListenerMulti(eleObj.downKey, 'touchstart mousedown', ()=> changePositionMouseAndTouchEvent(eleObj.downKeyCode, 1));
        addListenerMulti(eleObj.downKey, 'touchend mouseup', () => clearIntervalTouchEvent(1));
        
        addListenerMulti(eleObj.rightKey, 'touchstart mousedown', ()=> changePositionMouseAndTouchEvent(eleObj.rightKeyCode), 2);
        addListenerMulti(eleObj.rightKey, 'touchend mouseup', () => clearIntervalTouchEvent(2));
        
        addListenerMulti(eleObj.leftKey, 'touchstart mousedown', ()=> changePositionMouseAndTouchEvent(eleObj.leftKeyCode, 3));
        addListenerMulti(eleObj.leftKey, 'touchend mouseup', () => clearIntervalTouchEvent(3));
        
        eleObj.howToPlay.addEventListener('click', function(e){
            eleObj.howToPlaySec.style.display = "flex";
        });
        
        eleObj.closeBtn.addEventListener('click', function(e){
            eleObj.howToPlaySec.style.display = "none";
        });
        
        eleObj.retryBtn.addEventListener('click', function(e){
            eleObj.gameOverSec.style.display = "none";
            reset();
        });
    }
    
    return{
        init: function(){
            createObstacles();
            getObstaclesLoop();
            setInitialHighestScore();
            eventListners();
            eleObj.gameStatus = setInterval(checkCollisionInterval, eleObj.collisionInterval);
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) { 
    bubbleBash().init();
});