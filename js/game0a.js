class Circle {
    constructor(imageName, radius, v) {
        this.radius = radius;
        this.v = v;

        //let circle = new PIXI.Graphics();
        let circle = PIXI.Sprite.from(imageName);
        circle.height = radius;
        circle.width = radius
        //circle.beginFill(color);
        //circle.drawCircle(0, 0, radius);
        //circle.endFill();
        circle.x = radius;
        circle.y = radius;
        app.stage.addChild(circle);

        this.circle = circle;
    }

    remove() {
        app.stage.removeChild(this.circle);
    }

    collide(other) {
        let dx = other.circle.x - this.circle.x;
        let dy = other.circle.y - this.circle.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        return dist < (this.radius + other.radius);
    }
}

class Monster extends Circle {
    update() {
        this.circle.x += this.v.x;
        this.circle.y += this.v.y;

        if (this.circle.x >= w - this.radius) {
            shake("right");
            this.v.x *= -1;
        }

        else if (this.circle.x <= this.radius) {
            shake("left");
            this.v.x *= -1;
        }

        if (this.circle.y >= h - this.radius) {
            shake("down");
            this.v.y *= -1;
        }
        else if (this.circle.y <= this.radius) {
            shake("up");
            this.v.y *= -1;
        }
    }
}

class Player extends Circle {
    constructor(imageName, radius, v) {
        super(imageName, radius, v);
        this.reset();
    }

    reset() {
        this.circle.x = w / 2;
        this.circle.y = h / 2;
        this.speed = 2;
    }

    update() {
        let x = this.circle.x + this.v.x;
        let y = this.circle.y + this.v.y;

        this.circle.x = Math.min(Math.max(x, this.radius), w - this.radius);
        this.circle.y = Math.min(Math.max(y, this.radius), w - this.radius);


        monsters.forEach(m => {
            if (this.collide(m)) {
                reset();
                return;
            }
        });

        // // coin
        if (this.collide(coin)) {
            updateCoins(coins + 1);
            coin.random();
            addMonster();
            this.speed = Math.min(4, this.speed + 0.2);
            ClickEvent("coins");

            return;
        }
    }
}

class Coin extends Circle {
    random() {
        this.circle.x = this.radius + Math.random() * (w - 2 * this.radius);
        this.circle.y = this.radius + Math.random() * (h - 2 * this.radius);
    }

    update() {
        let s = 1 + Math.sin(new Date() * 0.01) * 0.2;
        this.circle.scale.set(s, s);
    }
}


function shake(className) {
    return;

    app.view.className = className;
    setTimeout(() => { app.view.className = "" }, 50);
}

function addMonster() {
    monsters.push(new Monster("images/MirandaBailey.png", 40, { x: 2 + Math.random(), y: 2 + Math.random() }));
}

function onkeydown(ev) {
    switch (ev.key) {
        case "ArrowLeft":
        case "a":
            player.v.x = -player.speed;
            pressed['left'] = true;
            break;

        case "ArrowRight":
        case "d":
            player.v.x = player.speed;
            pressed['right'] = true;
            break;

        case "ArrowUp":
        case "w":
            player.v.y = -player.speed;
            pressed['up'] = true;
            break;

        case "ArrowDown":
        case "s":
            player.v.y = player.speed;
            pressed['down'] = true;
            break;
    }
}

function onkeyup(ev) {
    switch (ev.key) {
        case "ArrowLeft":
        case "a":
            player.v.x = pressed['right'] ? player.speed : 0;
            pressed['left'] = false;
            break;

        case "ArrowRight":
        case "d":
            player.v.x = pressed['left'] ? -player.speed : 0;
            pressed['right'] = false;
            break;

        case "ArrowUp":
        case "w":
            player.v.y = pressed['down'] ? player.speed : 0;
            pressed['up'] = false;
            break;

        case "ArrowDown":
        case "s":
            player.v.y = pressed['up'] ? -player.speed : 0;
            pressed['down'] = false;
            break;
    }
}

//function onspeak(word) {
//    switch (word) {
//        case "left":
//        case "Left":
//            player.v.x = -player.speed;
//            pressed['left'] = true;
//            break;
////
//        case "Right":
//        case "right":
//            player.v.x = player.speed;
//            pressed['right'] = true;
//            break;
//
//        case "Up":
//        case "up":
//            player.v.y = -player.speed;
//            pressed['up'] = true;
//            break;
//
//        case "Down":
//        case "down":
//            player.v.y = player.speed;
//            pressed['down'] = true;
//            break;
//    }
//}

function setupControls() {
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
    //    recognition.addEventListener('end', recognition.start);
    //    recognition.addEventListener('result', e => {
    //        var transcript = e.results[0][0].transcript;
    //        if (e.results[0].isFinal) {
    //            onspeak(transcript);
    //        }
    //   });
}

function reset() {
    monsters.forEach(m => {
        m.remove();
    });

    monsters = [];
    addMonster();
    player.reset();
    coin.random();
    updateCoins(0);
}

function updateCoins(num) {
    coins = num;
    document.querySelector('#score span').innerHTML = coins;
}

function gameLoop() {
    player.update();
    coin.update();
    monsters.forEach(c => {
        c.update();
    });
}

// resize
window.onresize = () => {
    let d = document.querySelector("div#canvas");
    w = d.clientWidth;
    h = w;
    app.renderer.resize(w, h);
    reset();
}

//window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//const recognition = new SpeechRecognition();
//recognition.interimResults = true;
//recognition.lang = 'en-US';
//const words = document.querySelector('.words');

let w = 512, h = 512;
let app = new PIXI.Application({ width: w, height: h, antialias: true });
let monsters = [];
let pressed = {};
let player = new Player("images/MeredithGrey.png", 40, { x: 0, y: 0 });
let coin = new Coin("images/DerekShephard.png", 1, { x: 0, y: 0 });
let coins;

app.renderer.backgroundColor = 0x456268;
document.querySelector("div#canvas").appendChild(app.view);
setInterval(gameLoop, 1000 / 60);
setupControls();
//recognition.start();
window.onresize();