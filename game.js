const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let x = 400;
let y = 500;
const speed = 5;
let mx = 0;
let my = 0;

const tankImage = new Image();
const bulletImage = new Image();
const bloodImage = new Image();
const explosionImage = new Image();
const enemyTankImage = new Image();
const enemyTankImage2 = new Image();

// Массив для отслеживания загрузки изображений
const imagesToLoad = [
    { img: tankImage, src: './images/IS.png' },
    { img: bulletImage, src: 'images/shaurma.jpg' },
    { img: bloodImage, src: 'images/blood.gif' },
    { img: explosionImage, src: 'images/explosion.gif' },
    { img: enemyTankImage, src: 'images/army.jpg' },
    { img: enemyTankImage2, src: 'images/TigerH1.png' }
];

let imagesLoaded = 0;
const totalImages = imagesToLoad.length;

const tank = {
    width: 65,
    height: 65,
    lives: 10
};

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

// Функция для загрузки изображений
function loadImages() {
    imagesToLoad.forEach(imageData => {
        imageData.img.onload = () => {
            imagesLoaded++;
            console.log(`Загружено: ${imageData.src}`);
            
            if (imagesLoaded === totalImages) {
                console.log('Все изображения загружены!');
                // Запускаем игру только после загрузки всех изображений
                update();
            }
        };
        
        imageData.img.onerror = () => {
            console.error(`Ошибка загрузки: ${imageData.src}`);
        };
        
        imageData.img.src = imageData.src;
    });
}

document.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;
    shootBullet(targetX, targetY);
});

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
    x += mx;
    y += my;
    
    // Ограничение движения в пределах canvas
    x = Math.max(0, Math.min(canvas.width - tank.width, x));
    y = Math.max(0, Math.min(canvas.height - tank.height, y));
    
    ctx.drawImage(tankImage, x, y, tank.width, tank.height);
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
        ctx.fillText(`Lives: ${enemyTank.lives}`, enemyTank.x + enemyTank.width/2, enemyTank.y - 5);
    }
    if (enemyTank2.alive) {
        ctx.fillText(`Lives: ${enemyTank2.lives}`, enemyTank2.x + enemyTank2.width/2, enemyTank2.y - 5);
    }
}

function checkBulletCollision() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        if (enemyTank.alive && 
            bullet.x < enemyTank.x + enemyTank.width &&
            bullet.x + bullet.width > enemyTank.x &&
            bullet.y < enemyTank.y + enemyTank.height &&
            bullet.y + bullet.height > enemyTank.y) {
            
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
            continue; // Прерываем проверку для этой пули
        }
        
        if (enemyTank2.alive && 
            bullet.x < enemyTank2.x + enemyTank2.width &&
            bullet.x + bullet.width > enemyTank2.x &&
            bullet.y < enemyTank2.y + enemyTank2.height &&
            bullet.y + bullet.height > enemyTank2.y) {
            
            enemyTank2.lives -= 1;
            bullets.splice(i, 1);

            if (enemyTank2.lives <= 0) {
                enemyTank2.alive = false;
                explosion = {
                    x: enemyTank2.x + enemyTank2.width / 2 - 37.5,
                    y: enemyTank2.y + enemyTank2.height / 2 - 37.5,
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

        if (blood.duration <= 0) {
            blood = null;
        }
    }
}

function drawEXP() {
    if (explosion) {
        ctx.drawImage(explosionImage, explosion.x, explosion.y, explosion.size, explosion.size);
        explosion.duration -= 1;

        if (explosion.duration <= 0) {
            explosion = null;
        }
    }
}

function keyDownHandler(event) {
    const keyName = event.key;
    if (keyName == "w" || keyName == "W" || keyName == 'ц' || keyName == 'Ц') {
        my = -speed;
    }
    if (keyName == "s" || keyName == "S" || keyName == 'ы' || keyName == 'Ы') {
        my = speed;
    }
    if (keyName == "a" || keyName == "A" || keyName == 'ф' || keyName == 'Ф') {
        mx = -speed;
    }
    if (keyName == "d" || keyName == "D" || keyName == 'в' || keyName == 'В') {
        mx = speed;
    }
}

function keyUpHandler(event) {
    const keyName = event.key;
    
    if (keyName === "a" || keyName === "A" || keyName === 'ф' || keyName === 'Ф') {
        mx = 0;
    } else if (keyName === "d" || keyName === "D" || keyName === 'в' || keyName === 'В') {
        mx = 0;
    } else if (keyName === "w" || keyName === "W" || keyName === 'ц' || keyName === 'Ц') { 
        my = 0;
    } else if (keyName === "s" || keyName === "S" || keyName === 'ы' || keyName === 'Ы') {
        my = 0;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function update() {
    updateBullets();
    checkBulletCollision();
    
    // Движение вражеских танков
    if (enemyTank.alive) {
        enemyTank.x += enemyTank.moveSpeed * enemyTank.direction;
        if ((enemyTank.x >= canvas.width - enemyTank.width && enemyTank.direction === 1) ||
            (enemyTank.x <= 0 && enemyTank.direction === -1)) {
            enemyTank.direction *= -1; 
        }
    }
    
    if (enemyTank2.alive) {
        enemyTank2.x += enemyTank2.moveSpeed * enemyTank2.direction;
        if ((enemyTank2.x >= canvas.width - enemyTank2.width && enemyTank2.direction === 1) ||
            (enemyTank2.x <= 0 && enemyTank2.direction === -1)) {
            enemyTank2.direction *= -1; 
        }
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

// Запуск загрузки изображений при загрузке страницы
window.onload = () => {
    loadImages();
};