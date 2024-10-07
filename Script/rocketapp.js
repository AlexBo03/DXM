const app = new PIXI.Application();
document.body.appendChild(app.view);
const ufoList = [];
const rakete = PIXI.Sprite.from('../Images/rocket.png');
rakete.x = 350;
rakete.y = 520;
rakete.scale.x = 0.05;
rakete.scale.y = 0.05;
app.stage.addChild(rakete);

gameInterval(function() {
    const ufo = PIXI.Sprite.from('../Images/ufo' + random(1, 2) + '.png');
    ufo.x = random(0, 700);
    ufo.y = -25;
    ufo.scale.x = 0.1;
    ufo.scale.y = 0.1;
    app.stage.addChild(ufo);
    ufoList.push(ufo);
    flyDown(ufo, 1);

    waitForCollision(ufo, rakete).then(function() {
        app.stage.removeChild(rakete);
        stopGame(); 
    });
}, 1000);

function leftKeyPressed() {
    rakete.x = rakete.x - 5;
}

function rightKeyPressed() {
    rakete.x = rakete.x + 5;
}

function spaceKeyPressed() {
    const bullet = PIXI.Sprite.from('../Images/bullet.png');
    bullet.x = rakete.x + 13;
    bullet.y = 500;
    bullet.scale.x = 0.02;
    bullet.scale.y = 0.02;
    app.stage.addChild(bullet);
    flyUp(bullet);

    waitForCollision(bullet, ufoList).then(function([bullet, ufo]) {
        app.stage.removeChild(ufo);
        app.stage.removeChild(bullet);
        // Remove the UFO from the ufoList
        const index = ufoList.indexOf(ufo);
        if (index > -1) {
            ufoList.splice(index, 1);
        }
    });
}

function waitForCollision(sprite1, sprite2) {
    return new Promise((resolve) => {
        const checkCollision = () => {
            if (Array.isArray(sprite2)) {
                for (let i = 0; i < sprite2.length; i++) {
                    if (hitTestRectangle(sprite1, sprite2[i])) {
                        resolve([sprite1, sprite2[i]]);
                        return;
                    }
                }
            } else {
                if (hitTestRectangle(sprite1, sprite2)) {
                    resolve([sprite1, sprite2]);
                    return;
                }
            }
            requestAnimationFrame(checkCollision);
        };
        checkCollision();
    });
}

function hitTestRectangle(r1, r2) {
    const r1Bounds = r1.getBounds();
    const r2Bounds = r2.getBounds();
    return r1Bounds.x + r1Bounds.width > r2Bounds.x &&
           r1Bounds.x < r2Bounds.x + r2Bounds.width &&
           r1Bounds.y + r1Bounds.height > r2Bounds.y &&
           r1Bounds.y < r2Bounds.y + r2Bounds.height;
}
