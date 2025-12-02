const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let x = 400;
let y = 500;
const speed = 5;
let mx = 0;
let my = 0;

const tankImage = new Image();
tankImage.src = 'photo/IS.png';

const bulletImage = new Image();
bulletImage.src = 'photo/bullet.png';

const bloodImage = new Image();
bloodImage.src = 'photo/blood.gif';

const explosionImage = new Image();
explosionImage.src = 'photo/explosion.gif';

const enemyTankImage = new Image();
enemyTankImage.src = 'photo/army.jpg';

const enemyTankImage2 = new Image();
enemyTankImage2.src = 'photo/TigerH1.png';

const tank = {
    x: 400, // ДОБАВЬТЕ ЭТО
    y: 500, // ДОБАВЬТЕ ЭТО
    width: 65,
    height: 65,
    lives: 10
};

let gameOver = false;

const bullets = [];
let blood = null;
let explosion = null;

const enemyTank = {
    x: 400,
    y: 100,
    width: 50,
    height: 50,
    lives: 10,
    alive: true,
    moveSpeed: 5,
    direction: 1 
};

const enemyTank2 = {
    x: 400,
    y: 200,
    width: 50,
    height: 50,
    lives: 20,
    alive: true,
    moveSpeed: 3,
    direction: 1
};

// Загрузка изображений
let imagesLoaded = 0;
const images = [tankImage, bulletImage, bloodImage, explosionImage, enemyTankImage, enemyTankImage2];

images.forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        console.log(`Загружено: ${img.src}`);
    };
    img.onerror = () => {
        console.error(`Ошибка: ${img.src}`);
    };
});

document.addEventListener('click', (event) => {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;
    shootBullet(targetX, targetY);
});

// УНИВЕРСАЛЬНАЯ функция проверки столкновений
function checkCollisionBetween(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// УДАЛИТЕ ВТОРУЮ ФУНКЦИЮ checkCollision() в конце файла!

function showGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '48px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('ИГРА ОКОНЧЕНА', canvas.width/2, canvas.height/2 - 50);
    
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Обновите страницу для новой игры', canvas.width/2, canvas.height/2 + 20);
}

function shootBullet(targetX, targetY) {
    const startX = x + tank.width / 2;
    const startY = y + tank.height / 2;
    const angle = Math.atan2(targetY - startY, targetX - startX);
    bullets.push({
        x: startX,
        y: startY,
        width: 30,
        height: 30,
        speed: 5,
        dx: Math.cos(angle) * 5,
        dy: Math.sin(angle) * 5
    });
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
        
        if (bullet.x + bullet.width < 0 || bullet.x > canvas.width ||
            bullet.y + bullet.height < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
        }
    }
}

function drawTank() {
    // Обновляем координаты
    x += mx;
    y += my;
    
    // Ограничиваем движение
    x = Math.max(0, Math.min(canvas.width - tank.width, x));
    y = Math.max(0, Math.min(canvas.height - tank.height, y));
    
    // Обновляем координаты в объекте tank
    tank.x = x;
    tank.y = y;
    
    // Рисуем
    ctx.drawImage(tankImage, x, y, tank.width, tank.height);
    ctx.font = '16px Arial';
    ctx.fillStyle = 'green';
    ctx.fillText(`Жизни: ${tank.lives}`, x, y - 10);
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x - bullet.width/2, bullet.y - bullet.height/2, bullet.width, bullet.height);
    });
}

function drawEnemyTank() {
    if (enemyTank.alive) {
        ctx.drawImage(enemyTankImage, enemyTank.x, enemyTank.y, enemyTank.width, enemyTank.height);
    }
    if (enemyTank2.alive) {
        ctx.drawImage(enemyTankImage2, enemyTank2.x, enemyTank2.y, enemyTank2.width, enemyTank2.height);
    }
}

function drawEnemyLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    
    if (enemyTank.alive) {
        ctx.fillText(`Lives: ${enemyTank.lives}`, enemyTank.x + enemyTank.width/2, enemyTank.y - 10);
    }
    if (enemyTank2.alive) {
        ctx.fillText(`Lives: ${enemyTank2.lives}`, enemyTank2.x + enemyTank2.width/2, enemyTank2.y - 10);
    }
}

function checkBulletCollision() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        if (enemyTank.alive && checkCollisionBetween(bullet, enemyTank)) {
            enemyTank.lives -= 1;
            bullets.splice(i, 1);

            if (enemyTank.lives <= 0) {
                enemyTank.alive = false;
                blood = {
                    x: enemyTank.x + enemyTank.width / 2 - 25,
                    y: enemyTank.y + enemyTank.height / 2 - 25,
                    size: 50,
                    duration: 50
                };
            }
            continue;
        }
        
        if (enemyTank2.alive && checkCollisionBetween(bullet, enemyTank2)) {
            enemyTank2.lives -= 1;
            bullets.splice(i, 1);

            if (enemyTank2.lives <= 0) {
                enemyTank2.alive = false;
                explosion = {
                    x: enemyTank2.x + enemyTank2.width / 2 - 25,
                    y: enemyTank2.y + enemyTank2.height / 2 - 25,
                    size: 75,
                    duration: 50
                };
            }
        }
    }
}

function drawBlood() {
    if (blood) {
        ctx.drawImage(bloodImage, blood.x, blood.y, blood.size, blood.size);
        blood.duration -= 1;
        if (blood.duration <= 0) blood = null;
    }
}

function drawEXP() {
    if (explosion) {
        ctx.drawImage(explosionImage, explosion.x, explosion.y, explosion.size, explosion.size);
        explosion.duration -= 1;
        if (explosion.duration <= 0) explosion = null;
    }
}

function keyDownHandler(event) {
    if (gameOver) return;
    const keyName = event.key;
    if (keyName == "w" || keyName == "W" || keyName == 'ц' || keyName == 'Ц') my = -speed;
    if (keyName == "s" || keyName == "S" || keyName == 'ы' || keyName == 'Ы') my = speed;
    if (keyName == "a" || keyName == "A" || keyName == 'ф' || keyName == 'Ф') mx = -speed;
    if (keyName == "d" || keyName == "D" || keyName == 'в' || keyName == 'В') mx = speed;
}

function keyUpHandler(event) {
    const keyName = event.key;
    if (keyName === "a" || keyName === "A" || keyName === 'ф' || keyName === 'Ф') mx = 0;
    else if (keyName === "d" || keyName === "D" || keyName === 'в' || keyName === 'В') mx = 0;
    else if (keyName === "w" || keyName === "W" || keyName === 'ц' || keyName === 'Ц') my = 0;
    else if (keyName === "s" || keyName === "S" || keyName === 'ы' || keyName === 'Ы') my = 0;
}

// УДАЛИТЕ всё отсюда до конца:
// function checkCollision() {
//     if (x < enemyTank.x + enemyTank.width && x + 50 > enemyTank.x && y < enemyTank.y + enemyTank.height && y + 50 > enemyTank.y || x < enemyTank2.x + enemyTank2.width && x + 50 > enemyTank2.x && y < enemyTank2.y + enemyTank2.height && y + 50 > enemyTank2.y) { + enemyHeight && y + 50 > enemyY;} {
//         stopGame();
//     }
// }
// function stopGame() { ... }
// function animate() { ... }

function checkPlayerCollision() {
    if (enemyTank.alive && checkCollisionBetween(tank, enemyTank)) {
        tank.lives -= 1;
        // Отталкивание
        x -= mx * 2;
        y -= my * 2;
        if (tank.lives <= 0) {
            gameOver = true;
            showGameOver();
        }
    }
    
    if (enemyTank2.alive && checkCollisionBetween(tank, enemyTank2)) {
        tank.lives -= 1;
        // Отталкивание
        x -= mx * 2;
        y -= my * 2;
        if (tank.lives <= 0) {
            gameOver = true;
            showGameOver();
        }
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function update() {
    if (gameOver) return;
    
    updateBullets();
    checkBulletCollision();
    checkPlayerCollision();
    
    enemyTank.x += enemyTank.moveSpeed * enemyTank.direction;
    if ((enemyTank.x >= canvas.width - enemyTank.width && enemyTank.direction === 1) ||
        (enemyTank.x <= 0 && enemyTank.direction === -1)) {
        enemyTank.direction *= -1; 
    }
    
    enemyTank2.x += enemyTank2.moveSpeed * enemyTank2.direction;
    if ((enemyTank2.x >= canvas.width - enemyTank2.width && enemyTank2.direction === 1) ||
        (enemyTank2.x <= 0 && enemyTank2.direction === -1)) {
        enemyTank2.direction *= -1; 
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTank();
    drawBullets();
    drawEnemyTank();
    drawEnemyLives();
    drawBlood();
    drawEXP();
    
    requestAnimationFrame(update);
}

window.onload = () => {
    const checkImagesLoaded = setInterval(() => {
        if (imagesLoaded === images.length) {
            console.log('Все изображения загружены!');
            clearInterval(checkImagesLoaded);
            update();
        }
    }, 100);
};