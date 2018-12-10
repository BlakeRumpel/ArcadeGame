const levelInfo = document.querySelector(".level-info");
const levelText = document.querySelector(".level-info .level");
const flavorText = document.querySelector(".level-info .flavor");

const statLevelText = document.querySelector(".stats .level");
const statHighScoreText = document.querySelector(".stats .high-score");
const statDeathsText = document.querySelector(".stats .deaths");

let lockPlayer = false;
let level = 1;
let highScore = 1;
let deaths = 0;
let prevHighScore = 0;

// Generate a random number from min to max (inclusive)
const randInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Sets and displays a info box for a few seconds
const showText = function() {
    levelText.textContent = "Level " + level;
    flavorText.textContent = "Don't touch the bugs.";
    levelInfo.style.display = "unset";
    lockPlayer = true;
    setTimeout(() => {
        levelInfo.style.display = "none";
        lockPlayer = false;
    }, 2000);
}

// Assigns the current level, high score, and deaths to their respective html text elements
const setStats = function(l) {
    statLevelText.textContent = "Level " + level;
    statHighScoreText.textContent = "High Score: " + highScore;
    statDeathsText.textContent = "Deaths: " + deaths; 
}

// Enemies our player must avoid
class Enemy {
    constructor(x, y) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started
    
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.speed = randInt(300, 800);
        this.x = randInt(x, this.speed);
        this.y = y;
    }
    
    // Speeds up this enemy by a random amount
    addSpeed() {
        this.speed += randInt(30, 80);
        this.x = randInt(this.x, this.speed);
    }
    
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        if (this.x > player.getX() - 61 && this.x < player.getX() + 41 && this.y === player.getY()) {
            die();
        }
        
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += this.speed * dt;
        
        if (this.x > 505) {
            this.x = randInt(-400, -100);
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        this.sprite = 'images/char-cat-girl.png';
        this.row = 1;
        this.column = 3;
    }

    // Gets the current x value based on the column
    getX() {
        return  (5 - this.column) * 101;
    }

    // Gets the current y value based on the row
    getY() {
        return (6 - this.row) * 83 - 41;
    }

    // Re-positions the player back to the starting position
    respawn() {
        this.row = 1;
        this.column = 3;
    }

    update() {

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.getX(), this.getY());
    }

    // Handles keyboard inputs for movement and keeps the player on the map
    handleInput(input) {
        if (!lockPlayer) {
            switch (input) {
                case 'up':
                    if (player.row < 6) {
                        player.row++;
                        if (player.row === 6) {
                            levelUp();
                        }
                    }
    
                    break;
                case 'down':
                    if (player.row > 1) {
                        player.row--;
                    }
    
                    break;
                case 'left':
                    if (player.column < 5) {
                        player.column++;
                    }
    
                    break;
                case 'right':
                    if (player.column > 1) {
                        player.column--;
                    }
    
                    break;
            }
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [
    new Enemy(0, 42),
    new Enemy(0, 125),
    new Enemy(0, 208)
];

// The player
const player = new Player();

// Called when the player reaches the ned of the level
// It will increment the level, move the player back to the beginning, update stats,
// and increase the speed of the nemies
const levelUp = function() {
    level++;
    if (level > highScore) {
        highScore = level;
    }
    player.respawn();
    showText()
    setStats();
    allEnemies.forEach(enemy => enemy.addSpeed());
}

// Called when the player collides with a bug
// It will reset stats, position, level, and enemy speeds
// It will also save the high score if necessary
const die = function() {
    level = 1;
    deaths++;
    player.respawn();
    allEnemies.forEach(enemy => {
        enemy.speed = randInt(300, 500);
        enemy.x = randInt(enemy.x, enemy.speed);
    });
    levelText.textContent = "You died!";
    flavorText.textContent = highScore > prevHighScore ? "You got a new high score!" : "That's the way it goes!";
    levelInfo.style.display = "unset";
    lockPlayer = true;
    if (highScore > prevHighScore) {
        prevHighScore = highScore;
    }
    setTimeout(showText, 2500);
    setStats();
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', e => {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }

    player.handleInput(allowedKeys[e.keyCode]);
});

showText();