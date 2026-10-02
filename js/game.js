// Main Game Loop, Input Handler, HUD, and State Manager

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Internal Retro Resolution (400 x 240)
        this.width = 400;
        this.height = 240;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.imageSmoothingEnabled = false;

        // Game State: 'TITLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY'
        this.state = 'TITLE';

        // Player Stats
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('mario_high_score') || '0', 10);
        this.coins = 0;
        this.lives = 3;
        this.timeLeft = 400;
        this.timeTimer = 0;
        this.currentWorld = '1-1';

        // Camera
        this.cameraX = 0;

        // Inputs
        this.input = {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
            jumpJustPressed: false,
            run: false,
            fireJustPressed: false
        };

        this.lastTime = 0;
        this.initInputs();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Level & Player
        this.level = null;
        this.player = null;

        // Start Loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    resizeCanvas() {
        const container = document.getElementById('game-container');
        if (!container) return;

        const windowW = window.innerWidth;
        const windowH = window.innerHeight;
        const aspect = this.width / this.height;

        let scale = Math.min(windowW / this.width, windowH / this.height);
        // Ensure integer scaling when possible or smooth fit
        scale = Math.max(1, Math.floor(scale * 10) / 10);

        this.canvas.style.width = `${Math.floor(this.width * scale)}px`;
        this.canvas.style.height = `${Math.floor(this.height * scale)}px`;
    }

    startNewGame() {
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.currentWorld = '1-1';
        this.loadLevel(this.currentWorld);
        this.state = 'PLAYING';
        window.sound.startMusic();
    }

    loadLevel(worldName) {
        this.currentWorld = worldName;
        this.level = new Level(worldName);
        this.player = new Player(40, 180);
        this.cameraX = 0;
        this.timeLeft = 400;
        this.timeTimer = 0;
    }

    initInputs() {
        const keys = {};

        window.addEventListener('keydown', (e) => {
            // First user interaction initializes Web Audio
            window.sound.init();

            if (this.state === 'TITLE') {
                if (e.code === 'Space' || e.code === 'Enter' || e.key === 'z' || e.key === 'Z') {
                    this.startNewGame();
                    return;
                }
            } else if (this.state === 'GAMEOVER' || this.state === 'VICTORY') {
                if (e.code === 'Space' || e.code === 'Enter' || e.key === 'r' || e.key === 'R') {
                    this.startNewGame();
                    return;
                }
            }

            if (e.code === 'KeyP' || e.code === 'Escape') {
                if (this.state === 'PLAYING') {
                    this.state = 'PAUSED';
                    window.sound.stopMusic();
                } else if (this.state === 'PAUSED') {
                    this.state = 'PLAYING';
                    window.sound.startMusic();
                }
                return;
            }

            if (e.code === 'KeyM') {
                const muted = window.sound.toggleMute();
                const muteBtn = document.getElementById('btn-mute');
                if (muteBtn) muteBtn.textContent = muted ? '🔇' : '🔊';
                return;
            }

            if (e.code === 'KeyR' && this.state === 'PLAYING') {
                this.loadLevel(this.currentWorld);
                return;
            }

            // Game controls
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.input.left = true;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.input.right = true;
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.input.down = true;
            if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space' || e.key === 'z' || e.key === 'Z') {
                if (!this.input.jump) this.input.jumpJustPressed = true;
                this.input.jump = true;
            }
            if (e.shiftKey || e.code === 'KeyX' || e.code === 'KeyJ') {
                this.input.run = true;
                if (!keys[e.code]) {
                    this.input.fireJustPressed = true;
                }
            }
            keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.input.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.input.right = false;
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.input.down = false;
            if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space' || e.key === 'z' || e.key === 'Z') {
                this.input.jump = false;
            }
            if (!e.shiftKey && e.code !== 'KeyX' && e.code !== 'KeyJ') {
                this.input.run = false;
            }
            delete keys[e.code];
        });

        // Touch / Virtual On-Screen Controls
        this.bindTouchButton('btn-left', 'left');
        this.bindTouchButton('btn-right', 'right');
        this.bindTouchButton('btn-down', 'down');
        this.bindTouchAction('btn-jump', 'jump');
        this.bindTouchAction('btn-run', 'run');

        const muteBtn = document.getElementById('btn-mute');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                const muted = window.sound.toggleMute();
                muteBtn.textContent = muted ? '🔇' : '🔊';
            });
        }

        const pauseBtn = document.getElementById('btn-pause');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.state === 'PLAYING') {
                    this.state = 'PAUSED';
                    window.sound.stopMusic();
                } else if (this.state === 'PAUSED') {
                    this.state = 'PLAYING';
                    window.sound.startMusic();
                }
            });
        }
    }

    bindTouchButton(id, keyName) {
        const btn = document.getElementById(id);
        if (!btn) return;
        const setVal = (v) => {
            window.sound.init();
            this.input[keyName] = v;
        };
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); setVal(true); });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); setVal(false); });
        btn.addEventListener('mousedown', (e) => { e.preventDefault(); setVal(true); });
        btn.addEventListener('mouseup', (e) => { e.preventDefault(); setVal(false); });
    }

    bindTouchAction(id, action) {
        const btn = document.getElementById(id);
        if (!btn) return;
        const start = (e) => {
            e.preventDefault();
            window.sound.init();
            if (this.state === 'TITLE' || this.state === 'GAMEOVER' || this.state === 'VICTORY') {
                this.startNewGame();
                return;
            }
            if (action === 'jump') {
                this.input.jump = true;
                this.input.jumpJustPressed = true;
            } else if (action === 'run') {
                this.input.run = true;
                this.input.fireJustPressed = true;
            }
        };
        const end = (e) => {
            e.preventDefault();
            if (action === 'jump') this.input.jump = false;
            if (action === 'run') this.input.run = false;
        };
        btn.addEventListener('touchstart', start);
        btn.addEventListener('touchend', end);
        btn.addEventListener('mousedown', start);
        btn.addEventListener('mouseup', end);
    }

    addScore(pts, x, y, customText = null) {
        this.score += pts;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('mario_high_score', this.highScore.toString());
        }
        if (x !== undefined && y !== undefined) {
            this.level.particles.push(new ScorePopup(x, y - 6, customText || `+${pts}`));
        }
    }

    addCoin(x, y) {
        this.coins++;
        this.addScore(200, x, y);
        if (this.coins >= 100) {
            this.coins = 0;
            this.lives++;
            this.level.particles.push(new ScorePopup(x, y - 16, "1UP"));
            window.sound.playPowerup();
        }
    }

    spawnSmoke(x, y) {
        this.level.particles.push(new SmokeParticle(x, y));
    }

    spawnFireball(x, y, dir) {
        // Count active fireballs
        const count = this.level.items.filter(it => it instanceof Fireball).length;
        if (count < 2) {
            this.level.items.push(new Fireball(x, y, dir));
        }
    }

    onPlayerDied() {
        this.lives--;
        if (this.lives > 0) {
            this.loadLevel(this.currentWorld);
            window.sound.startMusic();
        } else {
            this.state = 'GAMEOVER';
            window.sound.stopMusic();
        }
    }

    onLevelCompleted() {
        if (this.currentWorld === '1-1') {
            this.loadLevel('1-2');
            window.sound.startMusic();
        } else {
            this.state = 'VICTORY';
            window.sound.stopMusic();
        }
    }

    // --- GAME LOOP ---
    gameLoop(time) {
        const dt = Math.min((time - this.lastTime) / 1000, 0.05) || 0.016;
        this.lastTime = time;

        this.update(dt);
        this.draw();

        // Reset one-shot inputs
        this.input.jumpJustPressed = false;
        this.input.fireJustPressed = false;

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        if (this.state !== 'PLAYING') return;

        // Time Countdown
        this.timeTimer += dt;
        if (this.timeTimer >= 0.75 && !this.player.isWinning) {
            this.timeTimer = 0;
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.player.die();
            }
        }

        // Update Player & Level
        this.player.update(dt, this.input, this.level, this);
        this.level.update(dt, this);

        // Update Camera (Smooth tracking, player centered around 140px from left)
        if (!this.player.isDying) {
            const targetCamX = this.player.x - 140;
            // Mario style: camera moves forward smoothly
            if (targetCamX > this.cameraX) {
                this.cameraX += (targetCamX - this.cameraX) * 10 * dt;
            }
        }

        // Clamp camera to level bounds
        const maxCamX = this.level.widthInTiles * 16 - this.width;
        if (this.cameraX < 0) this.cameraX = 0;
        if (this.cameraX > maxCamX) this.cameraX = maxCamX;
    }

    draw() {
        // Sky Background Color (Classic Mario NES Sky Blue or Underground Black)
        if (this.level && this.level.theme === 'underground') {
            this.ctx.fillStyle = '#000000';
        } else {
            this.ctx.fillStyle = '#5c94fc';
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.state === 'TITLE') {
            this.drawTitleScreen();
            return;
        }

        // Render World with Camera Offset
        this.ctx.save();
        this.ctx.translate(-Math.round(this.cameraX), 0);

        this.level.draw(this.ctx, this.cameraX);
        this.player.draw(this.ctx);

        this.ctx.restore();

        // Draw HUD (Always on top)
        this.drawHUD();

        // Overlay Screens
        if (this.state === 'PAUSED') {
            this.drawOverlayText("PAUZA", "Naciśnij P, aby wznowić");
        } else if (this.state === 'GAMEOVER') {
            this.drawOverlayText("KONIEC GRY", "Naciśnij SPACJĘ, aby zagrać ponownie");
        } else if (this.state === 'VICTORY') {
            this.drawOverlayText("GRATULACJE!", `UKOŃCZYŁEŚ GRĘ! TWÓJ WYNIK: ${this.score}`);
        }
    }

    drawHUD() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 10px "Press Start 2P", "Courier New", monospace';
        this.ctx.textAlign = 'left';

        // MARIO & Score
        this.ctx.fillText("MARIO", 20, 15);
        this.ctx.fillText(this.score.toString().padStart(6, '0'), 20, 27);

        // COINS
        window.sprites.draw(this.ctx, 'coin_1', 120, 16);
        this.ctx.fillText(`x${this.coins.toString().padStart(2, '0')}`, 140, 27);

        // LIVES
        window.sprites.draw(this.ctx, 'mario_small_idle', 200, 14);
        this.ctx.fillText(`x${this.lives}`, 220, 27);

        // WORLD
        this.ctx.fillText("ŚWIAT", 270, 15);
        this.ctx.fillText(this.currentWorld, 280, 27);

        // TIME
        this.ctx.fillText("CZAS", 345, 15);
        this.ctx.fillText(this.timeLeft.toString().padStart(3, '0'), 350, 27);
    }

    drawTitleScreen() {
        // Retro Title Screen with Mario pixel banner
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title Header
        this.ctx.fillStyle = '#e52521';
        this.ctx.font = 'bold 22px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("SUPER MARIO 2D", this.width / 2, 60);

        this.ctx.fillStyle = '#fcb000';
        this.ctx.font = 'bold 10px "Press Start 2P", monospace';
        this.ctx.fillText("KLASYCZNA PLATFORMÓWKA", this.width / 2, 82);

        // Decorative Sprites
        window.sprites.draw(this.ctx, 'mario_small_idle', this.width / 2 - 40, 105);
        window.sprites.draw(this.ctx, 'question_1', this.width / 2 - 8, 105);
        window.sprites.draw(this.ctx, 'goomba_walk1', this.width / 2 + 25, 105);

        // Start Prompt (blinking)
        if (Math.floor(Date.now() / 450) % 2 === 0) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 11px "Press Start 2P", monospace';
            this.ctx.fillText("NACIŚNIJ SPACJĘ, ABY GRAĆ", this.width / 2, 155);
        }

        // Instructions
        this.ctx.fillStyle = '#80d010';
        this.ctx.font = 'bold 8px monospace';
        this.ctx.fillText("STEROWANIE: [A][D] lub STRZAŁKI - Ruch  |  [SPACJA] / [W] - Skok", this.width / 2, 190);
        this.ctx.fillText("[SHIFT] / [X] - Bieg / Ogień  |  [S] - Kucanie  |  [P] - Pauza  |  [M] - Dźwięk", this.width / 2, 204);

        if (this.highScore > 0) {
            this.ctx.fillStyle = '#fcb078';
            this.ctx.fillText(`NAJLEPSZY WYNIK: ${this.highScore}`, this.width / 2, 225);
        }
    }

    drawOverlayText(title, subtitle) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 18px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, this.width / 2, this.height / 2 - 15);

        this.ctx.fillStyle = '#fcb000';
        this.ctx.font = 'bold 9px "Press Start 2P", monospace';
        this.ctx.fillText(subtitle, this.width / 2, this.height / 2 + 18);
    }
}

// Start Game instance when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
