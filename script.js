const gameContainer = document.getElementById('game-container');
const airplane = document.getElementById('airplane');
const scoreboard = document.getElementById('score-board');
const bulletContainer = document.getElementById('bullet-container');
const gameover = document.getElementById('gameover');
const gamepass = document.getElementById('gamepass')

//defination
let score = 1
let positionX = 400;
let positionY = 600;
const speed = 45;
const bullet_speed = 3;
const enemy_speed = 8;

let bullets = [];
let enemies = [];
let gamerunning = true;

//function
function generateEnemy() {
    if (!gamerunning) return;

    const enemyType = Math.random() < 0.5 ? 'enemy' : 'enemy2';
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.transform = `translate(${Math.random() * 800}px, 0px)`;
    gameContainer.appendChild(enemy);

    enemies.push({
        element: enemy,
        x: Math.random() * 800,
        y: 0,
        active: true


        
    });
}

// Function to handle keydown events
function thereisKeyDown(event) {
    if (!gamerunning) return;
    

    // Get the key code of the pressed key
    const keyCode = event.keyCode;

    // Update the airplane position based on the arrow key pressed
    if (keyCode === 37) { // Left arrow
        if ((positionX - speed) >= 0) {
            positionX -= speed;
        }
    } else if (keyCode === 38) { // Up arrow
        if ((positionY - speed) >= 0) {
            positionY -= speed;
        }
    } else if (keyCode === 39) { // Right arrow
        if ((positionX + speed) <= 800) {
            positionX += speed;
        }
    } else if (keyCode === 40) { // Down arrow
        if ((positionY + speed) <= 600) {
            positionY += speed;
        }
    }

    // Update the position of the airplane element
    airplane.style.transform = `translate(${positionX}px, ${positionY}px)`;

    // Shoot bullet when space button is pressed
    if (event.keyCode === 32) { // Space button
        // Create a new bullet element
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        //bullet.style.transform = `translate(${positionX + 23}px, ${positionY}px)`; // Position the bullet at the tip of the airplane
        //bullet.style.left = `${positionX + 15}px`;
        //bullet.style.top = `${positionY - 15}px`;
        bullet.style.transform = `translate(${positionX + airplane.offsetWidth / 2}px, ${positionY - bullet.offsetHeight}px)`;
        bulletContainer.appendChild(bullet);

        // Add the new bullet to the bullets array
        bullets.push({
            element: bullet,
            x: positionX + airplane.offsetWidth / 2,
            y: positionY - bullet.offsetHeight,
            active: true
        });
    }
}

// Function to move the bullets and enemy aircraft
function moveBulletsAndEnemies() {
    if (!gamerunning) return;

    bullets.forEach((bullet, index) => {
        
        if (bullet.active) {
            bullet.y -= bullet_speed; // Move the bullet upwards
  
            // Update the position of the bullet element
            bullet.element.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;
  
            // Check if the bullet is beyond the canvas, mark it as inactive and remove it from the DOM
            if (bullet.y < 0) {
                bullet.active = false;
                bulletContainer.removeChild(bullet.element);
            }
        }

        // Check for collisions with enemy aircraft
        enemies.forEach((enemy, enemyIndex) => {

            const bulletRect = bullet.element.getBoundingClientRect();
            const enemyRect = enemy.element.getBoundingClientRect();

            if (bullet.active && enemy.active && 
                bulletRect.x < enemyRect.x + enemyRect.width &&
                bulletRect.x + bulletRect.width > enemyRect.x &&
                bulletRect.y < enemyRect.y + enemyRect.height &&
                bulletRect.y + bulletRect.height > enemyRect.y) {
                    // Collision detected, remove bullet and enemy
                    bullet.active = false;
                    bulletContainer.removeChild(bullet.element);
                    enemy.active = false;
                    gameContainer.removeChild(enemy.element);

                    if (enemy.type === 'enemy2') {
                        score--;
                    } else {
                        score++;
                    }

                   
                    scoreboard.textContent = "score: " + score;

                    if (score > 29) {
                        gamerunning = false;
                        gamepass.style.display = 'block';
                    }
            }
//            }
        });

    });

    // Move the enemy aircraft
    enemies.forEach((enemy, index) => {
        if (enemy.active) {
            enemy.y += enemy_speed;
            enemy.element.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;

            // Remove enemy if it goes off the bottom of the screen
            if (enemy.y > 600) {
                enemy.active = false;
                gameContainer.removeChild(enemy.element);

                score--;
                scoreboard.textContent = "score: " + score;

                if (score < 0) {
                    gamerunning = false;
                    gameover.style.display = 'block'; 
                }

        
                
            }
        }
    });
    
    // Remove inactive bullets and enemies from the array
    bullets = bullets.filter(bullet => bullet.active);
    enemies = enemies.filter(enemy => enemy.active);



    

}
    
    
    
    
    


// Add event listener for keydown events
document.addEventListener('keydown', thereisKeyDown);

// Set the interval at which the bullets are updated
const updateInterval = 1000 / 60; // 60 frames per second

// Generate a new enemy aircraft every 2 seconds
setInterval(generateEnemy, 2000);

// Move the bullets every 1/60th of a second
//setInterval(moveBullets, updateInterval);
setInterval(moveBulletsAndEnemies, updateInterval);



// Set the initial position of the airplane element when the page loads
window.onload = function() {
    airplane.style.transform = `translate(${positionX}px, ${positionY}px)`;
};
  