// Game Entities: Player, Enemies, Items, Projectiles, Particles

const GRAVITY = 1100;
const TILE_SIZE = 16;

class Entity {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
        this.remove = false;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    checkOverlap(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        return (
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
        );
    }
}

// ========================
// PLAYER (MARIO)
// ========================
class Player extends Entity {
    constructor(x, y) {
        super(x, y, 14, 16); // 14px hitbox width for smooth corridors

        this.form = 'small'; // 'small' | 'super' | 'fire'
        this.facing = 1; // 1 = right, -1 = left
        this.isCrouching = false;
        this.isDying = false;
        this.isWinning = false;
        this.isInCastle = false;
        this.invulnerableTimer = 0;
        this.transformTimer = 0;
        this.transformState = false;

        // Physics constants
        this.walkSpeed = 145;
        this.runSpeed = 235;
        this.accel = 420;
        this.friction = 580;
        this.jumpForce = -365;
        this.superJumpBonus = -30;

        // Animation
        this.animTimer = 0;
        this.runFrame = 1;
        this.isSkidding = false;

        // Flagpole sequence
        this.flagState = null; // 'sliding', 'wait_hop', 'walking', 'inside'
        this.flagTargetY = 0;
        this.castleTargetX = 0;
    }

    setForm(form, level = null) {
        const targetForm = (form === 'super' || form === 'big') ? 'big' : form;
        if (this.form === targetForm) return;

        const oldHeight = this.height;
        this.form = targetForm;
        if (this.form === 'small') {
            this.height = 16;
        } else {
            this.height = this.isCrouching ? 18 : 30;
        }

        // Adjust y so feet stay at the exact same vertical position
        this.y += (oldHeight - this.height);

        // Safety: check ceiling collision if level is provided
        if (level) {
            let tileLeft = Math.floor((this.x + 0.05) / TILE_SIZE);
            let tileRight = Math.floor((this.x + this.width - 0.05) / TILE_SIZE);
            let tileTop = Math.floor(this.y / TILE_SIZE);
            for (let tx = tileLeft; tx <= tileRight; tx++) {
                if (level.isSolid(tx, tileTop)) {
                    this.y = (tileTop + 1) * TILE_SIZE;
                    break;
                }
            }
        }
    }

    grow(targetForm = 'big', level = null) {
        this.setForm(targetForm, level);
        this.triggerTransform();
    }

    damage(level = null) {
        if (this.invulnerableTimer > 0 || this.isDying || this.isWinning) return;

        if (this.form === 'fire') {
            this.setForm('big', level);
            this.invulnerableTimer = 2.0;
            this.triggerTransform();
            window.sound.playPipe();
        } else if (this.form === 'big' || this.form === 'super') {
            this.setForm('small', level);
            this.invulnerableTimer = 2.0;
            this.triggerTransform();
            window.sound.playPipe();
        } else {
            this.die();
        }
    }

    triggerTransform() {
        this.transformTimer = 0.7; // ~0.7s classic Mario powerup freeze & flicker
        this.vx = 0;
    }

    die() {
        if (this.isDying) return;
        this.isDying = true;
        this.vx = 0;
        this.vy = -340;
        window.sound.playDeath();
    }

    update(dt, input, level, game) {
        if (this.isDying) {
            this.vy += GRAVITY * dt * 0.8;
            this.y += this.vy * dt;
            if (this.y > level.heightInTiles * TILE_SIZE + 60) {
                game.onPlayerDied();
            }
            return;
        }

        // Transform pause / flashing effect (pauses movement during transformation!)
        if (this.transformTimer > 0) {
            this.transformTimer -= dt;
            this.vx = 0;
            return;
        }

        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= dt;
        }

        // Flagpole sequence handling
        if (this.isWinning) {
            this.updateFlagpoleSequence(dt, level, game);
            return;
        }

        // Crouch (Super/Fire only)
        if (this.form !== 'small') {
            if (input.down && this.isGrounded) {
                if (!this.isCrouching) {
                    this.isCrouching = true;
                    this.y += 12;
                    this.height = 18;
                }
            } else if (this.isCrouching && !input.down) {
                // Check ceiling clearance before standing up
                let tileLeft = Math.floor((this.x + 1) / TILE_SIZE);
                let tileRight = Math.floor((this.x + this.width - 1) / TILE_SIZE);
                let headTileY = Math.floor((this.y - 13) / TILE_SIZE);
                let blocked = false;
                for (let tx = tileLeft; tx <= tileRight; tx++) {
                    if (level.isSolid(tx, headTileY)) {
                        blocked = true;
                        break;
                    }
                }
                if (!blocked) {
                    this.isCrouching = false;
                    this.y -= 12;
                    this.height = 30;
                }
            }
        } else {
            this.isCrouching = false;
            this.height = 16;
        }

        // Horizontal Movement
        const targetMaxSpeed = input.run ? this.runSpeed : this.walkSpeed;
        let moveDir = 0;

        if (!this.isCrouching) {
            if (input.left) moveDir -= 1;
            if (input.right) moveDir += 1;
        }

        if (moveDir !== 0) {
            this.facing = moveDir;

            // Skid detection
            if ((moveDir > 0 && this.vx < -40) || (moveDir < 0 && this.vx > 40)) {
                this.isSkidding = true;
                this.vx += moveDir * this.accel * 2.6 * dt;
                if (Math.random() < 0.25 && this.isGrounded) {
                    game.spawnSmoke(this.x + (moveDir > 0 ? 0 : 12), this.y + this.height);
                }
            } else {
                this.isSkidding = false;
                this.vx += moveDir * this.accel * dt;
                if (Math.abs(this.vx) > targetMaxSpeed) {
                    this.vx = moveDir * targetMaxSpeed;
                }
            }
        } else {
            this.isSkidding = false;
            // Apply friction
            if (this.vx > 0) {
                this.vx = Math.max(0, this.vx - this.friction * dt);
            } else if (this.vx < 0) {
                this.vx = Math.min(0, this.vx + this.friction * dt);
            }
        }

        // Jump physics (variable jump height)
        if (input.jumpJustPressed && this.isGrounded) {
            const speedRatio = Math.abs(this.vx) / this.runSpeed;
            this.vy = this.jumpForce + (this.superJumpBonus * speedRatio);
            this.isGrounded = false;
            window.sound.playJump(this.form !== 'small');
        }

        // Variable gravity: lower when holding jump and moving upwards
        let currentGravity = GRAVITY;
        if (input.jump && this.vy < 0) {
            currentGravity = GRAVITY * 0.42;
        }
        this.vy += currentGravity * dt;
        if (this.vy > 550) this.vy = 550; // Terminal velocity

        // Fireball throw
        if (this.form === 'fire' && input.fireJustPressed && !this.isCrouching) {
            game.spawnFireball(this.x + (this.facing === 1 ? this.width : -4), this.y + 6, this.facing);
        }

        // Execute physics and collision resolution with level tiles
        this.moveAndCollide(dt, level, game);

        // Fall into pit
        if (this.y > level.heightInTiles * TILE_SIZE + 10) {
            this.die();
        }

        // Update run animation
        if (this.isGrounded && Math.abs(this.vx) > 10) {
            this.animTimer += dt * (Math.abs(this.vx) / 14);
            this.runFrame = (Math.floor(this.animTimer) % 3) + 1;
        } else {
            this.runFrame = 1;
        }
    }

    moveAndCollide(dt, level, game) {
        // Horizontal Movement & Collisions
        this.x += this.vx * dt;
        if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }

        let tileLeft = Math.floor(this.x / TILE_SIZE);
        let tileRight = Math.floor((this.x + this.width - 0.05) / TILE_SIZE);
        let tileTop = Math.floor(this.y / TILE_SIZE);
        let tileBottom = Math.floor((this.y + this.height - 0.05) / TILE_SIZE);

        for (let ty = tileTop; ty <= tileBottom; ty++) {
            for (let tx = tileLeft; tx <= tileRight; tx++) {
                if (level.isSolid(tx, ty)) {
                    if (this.vx > 0) {
                        this.x = tx * TILE_SIZE - this.width;
                        this.vx = 0;
                    } else if (this.vx < 0) {
                        this.x = (tx + 1) * TILE_SIZE;
                        this.vx = 0;
                    }
                }
            }
        }

        // Vertical Movement & Collisions
        this.isGrounded = false;
        this.y += this.vy * dt;

        tileLeft = Math.floor((this.x + 0.05) / TILE_SIZE);
        tileRight = Math.floor((this.x + this.width - 0.05) / TILE_SIZE);
        tileTop = Math.floor(this.y / TILE_SIZE);
        tileBottom = Math.floor((this.y + this.height) / TILE_SIZE);

        for (let ty = tileTop; ty <= tileBottom; ty++) {
            for (let tx = tileLeft; tx <= tileRight; tx++) {
                if (level.isSolid(tx, ty)) {
                    if (this.vy > 0) {
                        // Landing on top of tile
                        this.y = ty * TILE_SIZE - this.height;
                        this.vy = 0;
                        this.isGrounded = true;
                    } else if (this.vy < 0) {
                        // Bonking block from below
                        this.y = (ty + 1) * TILE_SIZE;
                        this.vy = 0;
                        level.onBlockBonk(tx, ty, this, game);
                    }
                }
            }
        }
    }

    startFlagpole(flagpole) {
        this.isWinning = true;
        this.flagState = 'sliding';
        this.vx = 0;
        this.vy = 130;
        this.x = flagpole.x - 6;
        this.flagTargetY = flagpole.bottomTileY * TILE_SIZE - this.height;
        this.castleTargetX = levelCastleDoorX(flagpole);
        window.sound.playStageClear();
    }

    updateFlagpoleSequence(dt, level, game) {
        if (this.flagState === 'sliding') {
            this.y += this.vy * dt;
            if (this.y >= this.flagTargetY) {
                this.y = this.flagTargetY;
                this.flagState = 'wait_hop';
                setTimeout(() => {
                    this.facing = 1;
                    this.x += 16;
                    this.flagState = 'walking';
                }, 350);
            }
        } else if (this.flagState === 'walking') {
            this.vx = 80;
            this.x += this.vx * dt;
            this.animTimer += dt * 10;
            this.runFrame = (Math.floor(this.animTimer) % 3) + 1;

            if (this.x >= this.castleTargetX) {
                this.vx = 0;
                this.flagState = 'inside';
                this.isInCastle = true;
                setTimeout(() => {
                    game.onLevelCompleted();
                }, 1000);
            }
        }
    }

    draw(ctx) {
        if (this.isInCastle) return;

        // Transform flicker effect (growing or shrinking)
        if (this.transformTimer > 0) {
            const isFlickerSmall = Math.floor(this.transformTimer * 12) % 2 === 0;
            const currentForm = isFlickerSmall ? 'small' : ((this.form === 'super') ? 'big' : this.form);
            const prefix = 'mario_' + currentForm + '_';
            const drawY = (currentForm === 'small') ? (this.y + (this.height - 16)) : (this.y - 2);
            window.sprites.draw(ctx, prefix + 'idle', this.x - 1, drawY, this.facing === -1);
            return;
        }

        if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
            return; // Blinking effect after taking damage
        }

        const isFlip = this.facing === -1;
        const formKey = (this.form === 'super' || this.form === 'big') ? 'big' : this.form;
        let prefix = 'mario_' + formKey + '_';

        if (this.isDying) {
            window.sprites.draw(ctx, 'mario_small_die', this.x - 1, this.y);
            return;
        }

        if (this.isWinning && this.flagState === 'sliding') {
            window.sprites.draw(ctx, prefix + 'flag', this.x, this.y, false);
            return;
        }

        if (this.isCrouching && this.form !== 'small') {
            window.sprites.draw(ctx, prefix + 'crouch', this.x - 1, this.y - 12, isFlip);
            return;
        }

        const drawY = (this.form === 'small') ? this.y : this.y - 2;

        if (!this.isGrounded) {
            window.sprites.draw(ctx, prefix + 'jump', this.x - 1, drawY, isFlip);
        } else if (this.isSkidding) {
            window.sprites.draw(ctx, prefix + 'skid', this.x - 1, drawY, isFlip);
        } else if (Math.abs(this.vx) > 10) {
            window.sprites.draw(ctx, prefix + 'run' + this.runFrame, this.x - 1, drawY, isFlip);
        } else {
            window.sprites.draw(ctx, prefix + 'idle', this.x - 1, drawY, isFlip);
        }
    }
}

function levelCastleDoorX(flagpole) {
    return flagpole.x + 92;
}

// ========================
// ENEMIES: GOOMBA & KOOPA
// ========================
class Enemy extends Entity {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.alive = true;
        this.isSquished = false;
        this.squishTimer = 0;
        this.facing = -1;
        this.animTimer = 0;
        this.animFrame = 1;
        this.isDyingFlight = false;
    }

    dieFly() {
        this.alive = false;
        this.isDyingFlight = true;
        this.vy = -260;
        this.vx = (Math.random() - 0.5) * 80;
        window.sound.playKick();
    }
}

class Goomba extends Enemy {
    constructor(x, y) {
        super(x, y, 16, 16);
        this.vx = -40;
    }

    update(dt, level, game) {
        if (this.isDyingFlight) {
            this.vy += GRAVITY * dt;
            this.y += this.vy * dt;
            this.x += this.vx * dt;
            if (this.y > level.heightInTiles * TILE_SIZE + 40) {
                this.remove = true;
            }
            return;
        }

        if (this.isSquished) {
            this.squishTimer -= dt;
            if (this.squishTimer <= 0) {
                this.remove = true;
            }
            return;
        }

        // Active only near camera
        if (this.x > game.cameraX + 430) return;

        this.animTimer += dt * 6;
        this.animFrame = (Math.floor(this.animTimer) % 2) + 1;

        // Gravity
        this.vy += GRAVITY * dt;
        if (this.vy > 400) this.vy = 400;

        // Horizontal Movement & Collisions
        this.x += this.vx * dt;
        let tileLeft = Math.floor(this.x / TILE_SIZE);
        let tileRight = Math.floor((this.x + this.width - 0.05) / TILE_SIZE);
        let tileTop = Math.floor(this.y / TILE_SIZE);
        let tileBottom = Math.floor((this.y + this.height - 0.05) / TILE_SIZE);

        for (let ty = tileTop; ty <= tileBottom; ty++) {
            for (let tx = tileLeft; tx <= tileRight; tx++) {
                if (level.isSolid(tx, ty)) {
                    if (this.vx > 0) {
                        this.x = tx * TILE_SIZE - this.width;
                        this.vx = -this.vx;
                    } else if (this.vx < 0) {
                        this.x = (tx + 1) * TILE_SIZE;
                        this.vx = -this.vx;
                    }
                }
            }
        }

        // Vertical Movement & Collisions
        this.y += this.vy * dt;
        tileLeft = Math.floor((this.x + 0.05) / TILE_SIZE);
        tileRight = Math.floor((this.x + this.width - 0.05) / TILE_SIZE);
        tileTop = Math.floor(this.y / TILE_SIZE);
        tileBottom = Math.floor((this.y + this.height) / TILE_SIZE);

        for (let ty = tileTop; ty <= tileBottom; ty++) {
            for (let tx = tileLeft; tx <= tileRight; tx++) {
                if (level.isSolid(tx, ty)) {
                    if (this.vy > 0) {
                        this.y = ty * TILE_SIZE - this.height;
                        this.vy = 0;
                    }
                }
            }
        }

        if (this.y > level.heightInTiles * TILE_SIZE + 40) {
            this.remove = true;
        }

        // Collision with Player
        if (this.alive && !this.isSquished && this.checkOverlap(game.player)) {
            const p = game.player;
            if (p.isDying || p.isWinning) return;

            // Check stomp: player is falling and their feet are above Goomba midpoint
            if (p.vy > 0 && (p.y + p.height) <= (this.y + 12)) {
                this.isSquished = true;
                this.alive = false;
                this.squishTimer = 0.45;
                p.vy = game.input.jump ? -360 : -240; // Super bounce if holding jump!
                window.sound.playStomp();
                game.addScore(100, this.x, this.y);
            } else {
                p.damage(level);
            }
        }
    }

    draw(ctx) {
        if (this.isDyingFlight) {
            ctx.save();
            ctx.translate(this.x + 8, this.y + 8);
            ctx.scale(1, -1);
            window.sprites.draw(ctx, 'goomba_walk1', -8, -8);
            ctx.restore();
            return;
        }

        if (this.isSquished) {
            window.sprites.draw(ctx, 'goomba_flat', this.x, this.y);
        } else {
            window.sprites.draw(ctx, 'goomba_walk' + this.animFrame, this.x, this.y);
        }
    }
}

class Koopa extends Enemy {
    constructor(x, y) {
        super(x, y, 16, 24);
        this.vx = -35;
        this.state = 'walk'; // 'walk', 'shell_idle', 'shell_slide'
        this.kickGraceTimer = 0;
        this.killStreak = 0;
    }

    update(dt, level, game) {
        if (this.kickGraceTimer > 0) {
            this.kickGraceTimer -= dt;
        }

        if (this.isDyingFlight) {
            this.vy += GRAVITY * dt;
            this.y += this.vy * dt;
            this.x += this.vx * dt;
            if (this.y > level.heightInTiles * TILE_SIZE + 40) {
                this.remove = true;
            }
            return;
        }

        if (this.x > game.cameraX + 430) return;

        if (this.state === 'walk') {
            this.animTimer += dt * 5;
            this.animFrame = (Math.floor(this.animTimer) % 2) + 1;
        }

        // Gravity
        this.vy += GRAVITY * dt;
        if (this.vy > 450) this.vy = 450;

        // Movement & Collisions
        this.x += this.vx * dt;
        let tileLeft = Math.floor(this.x / TILE_SIZE);
        let tileRight = Math.floor((this.x + this.width - 0.05) / TILE_SIZE);
        let tileTop = Math.floor(this.y / TILE_SIZE);
        let tileBottom = Math.floor((this.y + this.height - 0.05) / TILE_SIZE);

        for (let ty = tileTop; ty <= tileBottom; ty++) {
            for (let tx = tileLeft; tx <= tileRight; tx++) {
                if (level.isSolid(tx, ty)) {
                    if (this.vx > 0) {
                        this.x = tx * TILE_SIZE - this.width;
                        this.vx = -this.vx;
                        if (this.state === 'shell_slide') window.sound.playBump();
                    } else if (this.vx < 0) {
                        this.x = (tx + 1) * TILE_SIZE;
                        this.vx = -this.vx;
                        if (this.state === 'shell_slide') window.sound.playBump();
                    }
                }
            }
        }

        this.y += this.vy * dt;
        tileLeft = Math.floor((this.x + 0.05) / TILE_SIZE);
        tileRight = Math.floor((this.x + this.width - 0.05) / TILE_SIZE);
        tileTop = Math.floor(this.y / TILE_SIZE);
        tileBottom = Math.floor((this.y + this.height) / TILE_SIZE);

        for (let ty = tileTop; ty <= tileBottom; ty++) {
            for (let tx = tileLeft; tx <= tileRight; tx++) {
                if (level.isSolid(tx, ty)) {
                    if (this.vy > 0) {
                        this.y = ty * TILE_SIZE - this.height;
                        this.vy = 0;
                    }
                }
            }
        }

        if (this.y > level.heightInTiles * TILE_SIZE + 40) {
            this.remove = true;
        }

        // Collisions while sliding in shell (wipes out enemies!)
        if (this.state === 'shell_slide') {
            for (const enemy of level.enemies) {
                if (enemy !== this && enemy.alive && this.checkOverlap(enemy)) {
                    enemy.dieFly();
                    this.killStreak++;
                    const streakPts = [200, 400, 800, 1000, 2000, 4000];
                    const pts = streakPts[Math.min(this.killStreak, streakPts.length - 1)];
                    game.addScore(pts, enemy.x, enemy.y);
                }
            }
        }

        // Collision with Player
        if (this.alive && this.checkOverlap(game.player)) {
            const p = game.player;
            if (p.isDying || p.isWinning) return;

            if (this.state === 'walk') {
                if (p.vy > 0 && (p.y + p.height) <= (this.y + 12)) {
                    // Stomped into shell!
                    this.state = 'shell_idle';
                    this.height = 16;
                    this.y += 8;
                    this.vx = 0;
                    p.vy = game.input.jump ? -360 : -240;
                    window.sound.playStomp();
                    game.addScore(100, this.x, this.y);
                } else {
                    p.damage(level);
                }
            } else if (this.state === 'shell_idle') {
                // Kick shell
                const kickRight = (p.x + p.width / 2) < (this.x + this.width / 2);
                this.state = 'shell_slide';
                this.vx = kickRight ? 320 : -320;
                this.kickGraceTimer = 0.18; // Grace period so kicker isn't hurt
                this.killStreak = 0;
                window.sound.playKick();
                game.addScore(100, this.x, this.y);
                if (p.vy > 0) p.vy = -200;
            } else if (this.state === 'shell_slide') {
                if (this.kickGraceTimer > 0) return;

                if (p.vy > 0 && (p.y + p.height) <= (this.y + 12)) {
                    // Stomp sliding shell to halt it
                    this.state = 'shell_idle';
                    this.vx = 0;
                    p.vy = game.input.jump ? -360 : -240;
                    window.sound.playStomp();
                    game.addScore(100, this.x, this.y);
                } else {
                    p.damage(level);
                }
            }
        }
    }

    draw(ctx) {
        if (this.isDyingFlight) {
            ctx.save();
            ctx.translate(this.x + 8, this.y + 8);
            ctx.scale(1, -1);
            window.sprites.draw(ctx, 'koopa_shell', -8, -8);
            ctx.restore();
            return;
        }

        if (this.state === 'walk') {
            const flip = this.vx > 0;
            window.sprites.draw(ctx, 'koopa_walk' + this.animFrame, this.x, this.y, flip);
        } else {
            window.sprites.draw(ctx, 'koopa_shell', this.x, this.y - 8);
        }
    }
}

// ========================
// ITEMS & POWERUPS
// ========================
class Item extends Entity {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }
}

class Mushroom extends Item {
    constructor(x, y, is1up = false) {
        super(x, y, 16, 16);
        this.is1up = is1up;
        this.emerging = true;
        this.emergeTargetY = y - 16;
        this.emergeSpeed = 30;
        this.vx = 55;
    }

    update(dt, level, game) {
        if (this.emerging) {
            this.y -= this.emergeSpeed * dt;
            if (this.y <= this.emergeTargetY) {
                this.y = this.emergeTargetY;
                this.emerging = false;
            }
            return;
        }

        // Gravity
        this.vy += GRAVITY * dt;
        if (this.vy > 400) this.vy = 400;

        // Horizontal movement & collision
        this.x += this.vx * dt;
        let tileLeft = Math.floor(this.x / TILE_SIZE);
        let tileRight = Math.floor((this.x + this.width - 0.05) / TILE_SIZE);
        let tileTop = Math.floor(this.y / TILE_SIZE);
        let tileBottom = Math.floor((this.y + this.height - 0.05) / TILE_SIZE);

        for (let ty = tileTop; ty <= tileBottom; ty++) {
            for (let tx = tileLeft; tx <= tileRight; tx++) {
                if (level.isSolid(tx, ty)) {
                    if (this.vx > 0) {
                        this.x = tx * TILE_SIZE - this.width;
                        this.vx = -this.vx;
                    } else if (this.vx < 0) {
                        this.x = (tx + 1) * TILE_SIZE;
                        this.vx = -this.vx;
                    }
                }
            }
        }

        // Vertical collision
        this.y += this.vy * dt;
        tileLeft = Math.floor((this.x + 0.05) / TILE_SIZE);
        tileRight = Math.floor((this.x + this.width - 0.05) / TILE_SIZE);
        tileTop = Math.floor(this.y / TILE_SIZE);
        tileBottom = Math.floor((this.y + this.height) / TILE_SIZE);

        for (let ty = tileTop; ty <= tileBottom; ty++) {
            for (let tx = tileLeft; tx <= tileRight; tx++) {
                if (level.isSolid(tx, ty)) {
                    if (this.vy > 0) {
                        this.y = ty * TILE_SIZE - this.height;
                        this.vy = 0;
                    }
                }
            }
        }

        if (this.y > level.heightInTiles * TILE_SIZE + 40) {
            this.remove = true;
        }

        // Collision with player
        if (this.checkOverlap(game.player)) {
            this.remove = true;
            if (this.is1up) {
                game.lives++;
                game.addScore(1000, this.x, this.y, "1UP");
                window.sound.playPowerup();
            } else {
                if (game.player.form === 'small') {
                    game.player.grow('big', level);
                }
                game.addScore(1000, this.x, this.y);
                window.sound.playPowerup();
            }
        }
    }

    draw(ctx) {
        window.sprites.draw(ctx, this.is1up ? 'mushroom_1up' : 'mushroom', this.x, this.y);
    }
}

class FireFlower extends Item {
    constructor(x, y) {
        super(x, y, 16, 16);
        this.emerging = true;
        this.emergeTargetY = y - 16;
        this.emergeSpeed = 25;
    }

    update(dt, level, game) {
        if (this.emerging) {
            this.y -= this.emergeSpeed * dt;
            if (this.y <= this.emergeTargetY) {
                this.y = this.emergeTargetY;
                this.emerging = false;
            }
            return;
        }

        if (this.checkOverlap(game.player)) {
            this.remove = true;
            game.player.grow('fire', level);
            game.addScore(1000, this.x, this.y);
            window.sound.playPowerup();
        }
    }

    draw(ctx) {
        window.sprites.draw(ctx, 'fire_flower', this.x, this.y);
    }
}

class BlockCoin extends Item {
    constructor(x, y) {
        super(x, y, 16, 16);
        this.vy = -340;
        this.originY = y;
        this.animTimer = 0;
        this.frame = 1;
        window.sound.playCoin();
    }

    update(dt, level, game) {
        this.vy += GRAVITY * 1.5 * dt;
        this.y += this.vy * dt;

        this.animTimer += dt * 14;
        this.frame = (Math.floor(this.animTimer) % 4) + 1;

        if (this.vy > 0 && this.y >= this.originY) {
            this.remove = true;
            game.addCoin(this.x, this.y);
        }
    }

    draw(ctx) {
        window.sprites.draw(ctx, 'coin_' + this.frame, this.x, this.y);
    }
}

class LevelCoin extends Item {
    constructor(x, y) {
        super(x, y, 16, 16);
        this.animTimer = Math.random() * 4;
        this.frame = 1;
    }

    update(dt, level, game) {
        this.animTimer += dt * 8;
        this.frame = (Math.floor(this.animTimer) % 4) + 1;

        if (this.checkOverlap(game.player)) {
            this.remove = true;
            game.addCoin(this.x, this.y);
            window.sound.playCoin();
        }
    }

    draw(ctx) {
        window.sprites.draw(ctx, 'coin_' + this.frame, this.x, this.y);
    }
}

class Fireball extends Entity {
    constructor(x, y, dir) {
        super(x, y, 8, 8);
        this.vx = dir * 280;
        this.vy = 60;
        this.bounceSpeed = -220;
        window.sound.playFireball();
    }

    update(dt, level, game) {
        this.vy += GRAVITY * dt;
        this.x += this.vx * dt;

        // Check horizontal hit
        let tx = Math.floor((this.x + (this.vx > 0 ? this.width : 0)) / TILE_SIZE);
        let ty = Math.floor((this.y + 4) / TILE_SIZE);
        if (level.isSolid(tx, ty)) {
            this.explode(game);
            return;
        }

        this.y += this.vy * dt;
        let groundTy = Math.floor((this.y + this.height) / TILE_SIZE);
        let groundTx = Math.floor((this.x + 4) / TILE_SIZE);
        if (level.isSolid(groundTx, groundTy)) {
            this.y = groundTy * TILE_SIZE - this.height;
            this.vy = this.bounceSpeed; // Bounce on ground
        }

        // Check hit enemy
        for (const enemy of level.enemies) {
            if (enemy.alive && this.checkOverlap(enemy)) {
                enemy.dieFly();
                game.addScore(200, enemy.x, enemy.y);
                this.explode(game);
                return;
            }
        }

        if (this.y > level.heightInTiles * TILE_SIZE + 20) {
            this.remove = true;
        }
    }

    explode(game) {
        this.remove = true;
        game.spawnSmoke(this.x, this.y);
    }

    draw(ctx) {
        window.sprites.draw(ctx, 'fireball', this.x, this.y);
    }
}

// ========================
// PARTICLES & POPUPS
// ========================
class BrickDebris {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.remove = false;
        this.angle = 0;
    }

    update(dt) {
        this.vy += GRAVITY * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.angle += dt * 10;
        if (this.y > 400) this.remove = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + 4, this.y + 4);
        ctx.rotate(this.angle);
        window.sprites.draw(ctx, 'brick_debris', -4, -4);
        ctx.restore();
    }
}

class ScorePopup {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.life = 0.8;
        this.remove = false;
    }

    update(dt) {
        this.y -= 35 * dt;
        this.life -= dt;
        if (this.life <= 0) this.remove = true;
    }

    draw(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px "Courier New", monospace';
        ctx.fillText(this.text, Math.round(this.x), Math.round(this.y));
    }
}

class SmokeParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 0.25;
        this.maxLife = 0.25;
        this.remove = false;
        this.radius = 2;
    }

    update(dt) {
        this.life -= dt;
        this.radius += dt * 12;
        if (this.life <= 0) this.remove = true;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (this.life / this.maxLife) + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
