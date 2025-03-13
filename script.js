window.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let background = new Image();
    background.src = "./assets/background.png";
    let bird = new Image();
    bird.src = "./assets/birdy.png";
    bird.onload = function() {
        Animation();
    };
    let birdShift = 0;
    let birdFrameWidth = 100;
    let birdFrameHeight = 100;
    let birdTotalFrames = 2;
    let birdCurrentFrame = 0;
    let birdCanvasPositionX = 350;
    let birdCanvasPositionY = 200;
    let backgroundShift = 0;
    let backgroundFrameWidth = 800;
    let backgroundFrameHeight = 500;
    let backgroundTotalFrames = 15;
    let backgroundCurrentFrame = 0;
    let backgroundCanvasPositionX = 0;
    let backgroundCanvasPositionY = 0;
    function Animation() {
        setInterval(function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(background, 0, backgroundShift, backgroundFrameWidth, backgroundFrameHeight, backgroundCanvasPositionX, backgroundCanvasPositionY, backgroundFrameWidth, backgroundFrameHeight);
            backgroundShift += backgroundFrameHeight;
            if (backgroundCurrentFrame === backgroundTotalFrames) {
                backgroundShift = 0;
                backgroundCurrentFrame = 0;
            };
            backgroundCurrentFrame++;
            ctx.drawImage(bird, 0, birdShift, birdFrameWidth, birdFrameHeight, birdCanvasPositionX, birdCanvasPositionY, birdFrameWidth, birdFrameHeight);
            birdShift += birdFrameWidth;
            if (birdCurrentFrame === birdTotalFrames) {
                birdShift = 0;
                birdCurrentFrame = 0;
            };
            birdCurrentFrame++;
        }, 100);
    };
};