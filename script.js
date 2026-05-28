//  Waiting for the assets to be downloaded

const GameMap = document.getElementById("map");
const Board = document.getElementById("board");
const startScreen = document.getElementById("startScreen");

startScreen.style.display = 'none';
GameMap.style.display = 'none';
Board.style.display = 'none';


// Sleep function that pauses the execution for given MS of time
function sleep(ms=100) {

    return new Promise((resolve) => {

        setTimeout(resolve, ms);

    });
}

sleep(2000).then(() => {

    document.getElementById("loading-screen").style.display = "none";

    startScreen.style.display = "block";
});


// Background setup
GameMap.style.width = '100%';
GameMap.style.height = '100%';
GameMap.style.backgroundSize = "cover";
GameMap.style.backgroundRepeat = "no-repeat";
GameMap.style.backgroundPosition = "center";
GameMap.style.backgroundImage = "url('./Assets/bg.png')";

let img = new Image();
img.src = "./Assets/Bird.png"



//  Canvas setup and finding Maximum value of X - Y coordinates
Board.width = window.innerWidth;
Board.height = window.innerHeight;


let ctx = Board.getContext("2d");
ctx.imageSmoothingEnabled = false;


// Generating particels dimentions
const particles = [];

for (let i = 0; i < 120; i++) {
    
    particles.push({
        x: Math.random() * Board.width,
        y: Math.random() * Board.height,

        size: Math.random() * 2 + 1,

        speed: Math.random() * 0.7 + 0.2,

        alpha: Math.random() * 0.5
    });
}

//  Function to render particles (idk how this is working)
function drawParticles() {

    for (let p of particles) {

        ctx.beginPath();

        ctx.fillStyle = `rgba(255,180,0,${p.alpha})`;

        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fill();

        p.y -= p.speed;
        
        if (p.y < 0) {
            
            p.y = Board.height;
            
            p.x = Math.random() * Board.width;
        }
    }
}

const startBtn = document.getElementById("startBtn");
let gameStarted = false;

startBtn.addEventListener("click", () => {


    if (gameStarted) return;

    gameStarted = true;

    // idk why i am doing this 
    generatePipePos();
    // hide intro screen
    startScreen.style.display = "none";
    
    GameMap.style.display = 'block';
    Board.style.display = 'block';

    // start game
    gameLoop();
});



// This function generates position of the PIPE obstacles.

// Game Objects
const Bird = {
    
    x: 400,
    y: Board.height / 2,
    
    width: 0,
    height: 0,
    velocityY : 0,
    gravity : 0.10,
    jumpPower : -3
    
};


let tpIMG = new Image();
tpIMG.src = "./Assets/barDOWN.png"

let bIMG = new Image();
bIMG.src = "./Assets/barUP.png";


const topPIPE =  {
    
    x : Board.width,
    y : 0,
    
    height : 0,
    width : 0
    
};
tpIMG.onload = () => {
    topPIPE.height = tpIMG.height - 200;
    topPIPE.width = tpIMG.width - 100;
};

const bottomPIPE =  {
    
    x : Board.width,
    y : 0,
    
    height : 0,
    width : 0
};
bIMG.onload = () => {
    bottomPIPE.height = bIMG.height - 180;
    bottomPIPE.width = bIMG.width - 100;
};


let topPipeY = 0;
let bottomPipeY = 0;
const velocityX = -4;
const gap = 200;
let gameOver = false;
let score = 0;
const birdHitboxPadding = 20;
const pipeHitboxPadding = 10;
const topBorderPadding = 10;
const bottomBorderPadding = 15;


let generatePipePos = () => {
    
    topPipeY = 0 - topPIPE.height/4 - Math.random() * (topPIPE.height/2);
    bottomPipeY = topPipeY + topPIPE.height + gap;
    
};

function drawScore() {

    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial";

    ctx.fillText(
        "Score: " + score,
        30,
        60
    );
}
function drawPIPEs() {

    ctx.drawImage(
        tpIMG,
        topPIPE.x,
        topPipeY,
        topPIPE.width,
        topPIPE.height
    );
    ctx.drawImage(
        bIMG,
        bottomPIPE.x,
        bottomPipeY,
        bottomPIPE.width,
        bottomPIPE.height
    );

    topPIPE.x += velocityX;
    bottomPIPE.x += velocityX;

    // TOP PIPE COLLISION

    if (

        Bird.x + birdHitboxPadding <
            topPIPE.x + topPIPE.width - pipeHitboxPadding &&

        Bird.x + Bird.width - birdHitboxPadding >
            topPIPE.x + pipeHitboxPadding &&

        Bird.y + birdHitboxPadding <
            topPipeY + topPIPE.height - pipeHitboxPadding &&

        Bird.y + Bird.height - birdHitboxPadding >
            topPipeY + pipeHitboxPadding

    ) {

        gameOver = true;
    }


    // BOTTOM PIPE COLLISION

    if (

        Bird.x + birdHitboxPadding <
            bottomPIPE.x + bottomPIPE.width - pipeHitboxPadding &&

        Bird.x + Bird.width - birdHitboxPadding >
            bottomPIPE.x + pipeHitboxPadding &&

        Bird.y + birdHitboxPadding <
            bottomPipeY + bottomPIPE.height - pipeHitboxPadding &&

        Bird.y + Bird.height - birdHitboxPadding >
            bottomPipeY + pipeHitboxPadding

    ) {

        gameOver = true;
    }

    if (topPIPE.x + topPIPE.width < 0) {
    
        score++;
        topPIPE.x = Board.width;    
        bottomPIPE.x = Board.width;

        generatePipePos();
    }
}


img.onload = () => {

    Bird.width = img.width;
    Bird.height = img.height;

    resizeGame();
};

function drawBird() {

    
    ctx.filter = `
        drop-shadow(0 0 8px #ff8800)
        drop-shadow(0 0 16px #ff4400)
        brightness(1.2)
    `;

    Bird.velocityY += Bird.gravity;
    Bird.y += Bird.velocityY;
    ctx.drawImage(
        img,
        Bird.x,
        Bird.y,
        Bird.width,
        Bird.height
    );

    ctx.filter = `none`;

}



function resizeGame() {

    Board.width = window.innerWidth;
    Board.height = visualViewport?.height || window.innerHeight;

    Bird.x = Board.width * 0.25;
    Bird.y = (Board.height / 2) - (Bird.height / 2);
}

window.addEventListener("resize", resizeGame);



function gameLoop() {

    if (

        Bird.y + topBorderPadding < 0 ||
    
        Bird.y + Bird.height - bottomBorderPadding >
        Board.height
    
    ) {
    
        gameOver = true;
    }

    ctx.clearRect(0, 0, Board.width, Board.height);

    drawParticles();
    drawBird();
    drawPIPEs();
    drawScore();

    if (gameOver) {

        ctx.fillStyle = "red";
    
        ctx.font = "80px Arial";
    
        ctx.fillText(
            "GAME OVER",
            Board.width / 2 - 220,
            Board.height / 2
        );
    
        return;
    }

    requestAnimationFrame(gameLoop);
}




// Full screen using 'F' && '<Space>' to jump
document.addEventListener("keydown", (e) => {

    if (e.code === "Space") {

        Bird.velocityY = Bird.jumpPower;
    }

    if (e.key.toLowerCase() === "f") {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

        } else {

            document.exitFullscreen();
        }
    }
});

document.addEventListener("click", () => {
    Bird.velocityY = Bird.jumpPower;
});