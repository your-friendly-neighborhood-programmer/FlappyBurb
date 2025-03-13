const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let lastTime = performance.now();
let lastDelta = 0;
let paused = true;
let score = 0;
let highScore = 0;

// Player controls
document.addEventListener('keydown', function(e) {
    if (e.code = 'Space') {
        bird.flap = true;
        paused = false;
    }
});

// blueprint for objects in the game
class GameObject {
    constructor(name, src, frameWidth, frameHeight, totalFrames, canvasPositionX, canvasPositionY, timePerFrame) {
        this.name = name;
        this.src = src;
        this.sprite = new Image();
        this.sprite.src = this.src;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.totalFrames = totalFrames;
        this.canvasPositionX = canvasPositionX;
        this.canvasPositionY = canvasPositionY;
        this.homeX = canvasPositionX;
        this.homeY = canvasPositionY;
        this.timePerFrame = timePerFrame;
        this.frameCounter = 0;
        this.currentFrame = 0;
        this.shift = 0;
    }
    update(deltaTime) {
        this.frameCounter += deltaTime;
        if (this.frameCounter >= this.timePerFrame) {
            this.frameCounter = 0;
            this.currentFrame++;
        };
        if (this.currentFrame >= this.totalFrames) {
            this.currentFrame = 0;
        };
        this.shift = this.currentFrame * this.frameHeight;
    }
    draw(deltaTime) {
        ctx.drawImage(this.sprite, 0, this.shift, this.frameWidth, this.frameHeight, this.canvasPositionX, this.canvasPositionY, this.frameWidth, this.frameHeight);
    }
    right() {
        return (this.canvasPositionX + this.frameWidth -15)
    }
    bottom() {
        return (this.canvasPositionY + this.frameHeight -10);
    }
    collidingWith(obs) {
        if (this.right() >= obs.canvasPositionX && this.canvasPositionX <= obs.right()) {
            if (this.bottom() >= obs.canvasPositionY && (this.canvasPositionY + 15) <= obs.bottom()) {
                return true;
            }
        } 
        return false;
    }
    reset() {
        this.canvasPositionX = this.homeX;
        this.canvasPositionY = this.homeY;
    }
}

class Obstacle extends GameObject {
    constructor(name, src, frameWidth, frameHeight, totalFrames, canvasPositionX, canvasPositionY, timePerFrame, interval, changeRate, maxY, minY) {
        super(name, src, frameWidth, frameHeight, totalFrames, canvasPositionX, canvasPositionY, timePerFrame);
        this.interval = interval;
        this.changeRate = changeRate;
        this.maxY = maxY;
        this.minY = minY;
    }
    update(deltaTime) {
        this.canvasPositionX -= this.changeRate * deltaTime / 1000;
        if (this.canvasPositionX < -250) {
            this.canvasPositionX = canvas.width * 2;
            this.canvasPositionY = Math.random() * (this.maxY - this.minY) + this.minY;
        }
    }
}

class Player extends GameObject {
    constructor(name, src, frameWidth, frameHeight, totalFrames, canvasPositionX, canvasPositionY, timePerFrame) {
        super(name, src, frameWidth, frameHeight, totalFrames, canvasPositionX, canvasPositionY, timePerFrame);
        this.liftRate = -350;
        this.drop = 150;
        this.flap = false;
    }
    update(deltaTime) {
        this.canvasPositionY += this.drop * deltaTime / 1000;
        if (this.flap) {
            this.canvasPositionY += this.liftRate * deltaTime / 1000;

        }
        if (this.canvasPositionY <= 0) {
            this.canvasPositionY = 0;
        }
        this.frameCounter += deltaTime;
        if (this.frameCounter >= this.timePerFrame && this.flap) {
            this.frameCounter = 0;
            this.currentFrame++;
        }
        if (this.currentFrame >= this.totalFrames) {
            this.currentFrame = 0;
            this.flap = false;
        }
        this.shift = this.currentFrame * this.frameHeight;
    }
}

const background = new GameObject('background', './assets/background.png', 800, 500, 15, 0, 0, 1000/6);
const treeTrunk = new Obstacle('treeTrunk', './assets/treeTrunk.png', 150, 250, 1, canvas.width * 3, canvas.height - 250, 1000, 1000, 250, 250, 500);
const balloon = new Obstacle('balloon', './assets/balloon.png', 80, 150, 1, canvas.width * 1.5, 0, 1000, 1000, 250, 0, 250);
const bird = new Player('bird', './assets/birdy.png', 100, 100, 2, 350, 200, 1000/4);

// Handles Game Logic for each frame and Animation
function gameLoop(timestamp) {
    let deltaTime = (timestamp - lastTime);
    lastTime = timestamp;
    update(deltaTime);
    draw(deltaTime);
    requestAnimationFrame(gameLoop);
    if (bird.collidingWith(treeTrunk) || bird.collidingWith(balloon) || bird.bottom() > canvas.height) {
        gameOver();
    }
};

// Updates the game logic
function update(deltaTime) {
    if (paused) return;
    score += deltaTime;
    lastDelta = deltaTime;
    background.update(deltaTime);
    bird.update(deltaTime);
    treeTrunk.update(deltaTime);
    balloon.update(deltaTime);
};

// Draws the game
function draw(deltaTime) {
    background.draw(deltaTime);
    treeTrunk.draw(deltaTime);
    balloon.draw(deltaTime);
    bird.draw(deltaTime);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + Math.floor(score / 10), 20, 20);
    ctx.fillText("High score: " + Math.floor(highScore / 10), 20, 40);
};

// Game over function 
function gameOver() {
    paused = true;
    background.reset();
    treeTrunk.reset();
    balloon.reset();
    bird.reset();
    highScore = highScore > score ? highScore : score;
    score = 0;
    localStorage.setItem("High Score", highScore);
}
highScore = localStorage.getItem("High Score") || 0;
requestAnimationFrame(gameLoop);