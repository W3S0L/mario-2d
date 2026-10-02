// Level Generator, Tilemap, Scenery, and Collision Logic

class Level {
    constructor(worldName = '1-1') {
        this.worldName = worldName;
        this.widthInTiles = 220;
        this.heightInTiles = 15; // 240px height (15 * 16)
        this.tiles = []; // 2D array [y][x]
        this.blockContent = {}; // Map of "x,y" => { type: 'coin'|'mushroom'|'flower'|'1up', hits: 1 }
        this.bumpedBlocks = []; // Active bumping animations
        this.scenery = [];
        this.enemies = [];
        this.items = [];
        this.particles = [];
        this.flagpole = null;
        this.castle = null;
        this.theme = 'overworld'; // 'overworld' or 'underground'

        this.init();
    }

    init() {
        for (let y = 0; y < this.heightInTiles; y++) {
            this.tiles[y] = new Array(this.widthInTiles).fill(null);
        }

        if (this.worldName === '1-2') {
            this.buildLevel1_2();
        } else {
            this.buildLevel1_1();
        }
    }

    setTile(x, y, tileName) {
        if (x >= 0 && x < this.widthInTiles && y >= 0 && y < this.heightInTiles) {
            this.tiles[y][x] = tileName;
        }
    }

    getTile(x, y) {
        if (x >= 0 && x < this.widthInTiles && y >= 0 && y < this.heightInTiles) {
            return this.tiles[y][x];
        }
        return null;
    }

    isSolid(x, y) {
        const t = this.getTile(x, y);
        if (!t) return false;
        return (
            t === 'ground' ||
            t === 'brick' ||
            t.startsWith('question_') ||
            t === 'stone' ||
            t.startsWith('pipe_')
        );
    }

    buildGround(startX, endX, groundY = 13) {
        for (let x = startX; x <= endX; x++) {
            for (let y = groundY; y < this.heightInTiles; y++) {
                this.setTile(x, y, 'ground');
            }
        }
    }

    buildPipe(x, height) {
        const topY = 13 - height;
        this.setTile(x, topY, 'pipe_top_left');
        this.setTile(x + 1, topY, 'pipe_top_right');
        for (let y = topY + 1; y < 13; y++) {
            this.setTile(x, y, 'pipe_body_left');
            this.setTile(x + 1, y, 'pipe_body_right');
        }
    }

    buildStairs(startX, height, direction = 1) {
        for (let step = 0; step < height; step++) {
            const x = (direction === 1) ? (startX + step) : (startX + (height - 1 - step));
            for (let y = 13 - 1; y >= 13 - 1 - step; y--) {
                this.setTile(x, y, 'stone');
            }
        }
    }

    buildSceneryItem(type, x, y) {
        this.scenery.push({ type, x, y });
    }

    buildLevel1_1() {
        this.theme = 'overworld';

        // 1. Ground segments with pits
        this.buildGround(0, 68);
        this.buildGround(71, 85);
        this.buildGround(89, 152);
        this.buildGround(155, 220);

        // 2. Scenery
        const sceneryX = [0, 48, 96, 144, 192];
        sceneryX.forEach(bx => {
            this.buildSceneryItem('hill_big', bx, 10);
            this.buildSceneryItem('cloud_single', bx + 8, 3);
            this.buildSceneryItem('bush_triple', bx + 11, 12);
            this.buildSceneryItem('hill_small', bx + 16, 11);
            this.buildSceneryItem('cloud_double', bx + 19, 2);
            this.buildSceneryItem('cloud_triple', bx + 27, 3);
            this.buildSceneryItem('bush_single', bx + 23, 12);
            this.buildSceneryItem('bush_double', bx + 41, 12);
            this.buildSceneryItem('cloud_single', bx + 36, 2);
        });

        // 3. Question Blocks and Bricks
        this.setTile(16, 9, 'question_1');
        this.blockContent['16,9'] = { type: 'coin', hits: 1 };

        this.setTile(20, 9, 'brick');
        this.setTile(21, 9, 'question_1');
        this.blockContent['21,9'] = { type: 'mushroom', hits: 1 };
        this.setTile(22, 9, 'brick');
        this.setTile(23, 9, 'question_1');
        this.blockContent['23,9'] = { type: 'coin', hits: 1 };
        this.setTile(24, 9, 'brick');

        this.setTile(22, 5, 'question_1');
        this.blockContent['22,5'] = { type: 'coin', hits: 1 };

        // 4. Pipes
        this.buildPipe(28, 2);
        this.buildPipe(38, 3);
        this.buildPipe(46, 4);
        this.buildPipe(57, 4);

        // Secret 1-UP block
        this.setTile(64, 8, 'brick');
        this.blockContent['64,8'] = { type: '1up', hits: 1 };

        // Group 2
        this.setTile(77, 9, 'brick');
        this.setTile(78, 9, 'question_1');
        this.blockContent['78,9'] = { type: 'flower', hits: 1 };
        this.setTile(79, 9, 'brick');

        for (let x = 80; x <= 87; x++) {
            this.setTile(x, 5, 'brick');
        }
        for (let x = 91; x <= 94; x++) {
            this.setTile(x, 5, 'brick');
        }
        this.setTile(94, 5, 'question_1');
        this.blockContent['94,5'] = { type: 'coin', hits: 1 };

        this.setTile(87, 9, 'stone');
        this.setTile(88, 7, 'stone');

        for (let x = 100; x <= 104; x++) {
            this.setTile(x, 9, 'brick');
        }
        this.setTile(101, 9, 'question_1');
        this.blockContent['101,9'] = { type: 'coin', hits: 1 };

        for (let x = 118; x <= 121; x++) {
            this.setTile(x, 5, 'brick');
        }
        this.setTile(128, 9, 'brick');
        this.setTile(129, 9, 'question_1');
        this.blockContent['129,9'] = { type: 'coin', hits: 1 };
        this.setTile(130, 9, 'question_1');
        this.blockContent['130,9'] = { type: 'mushroom', hits: 1 };
        this.setTile(131, 9, 'brick');

        this.buildPipe(163, 2);
        this.buildPipe(179, 2);

        this.buildStairs(134, 4, 1);
        this.buildStairs(140, 4, -1);
        this.buildStairs(148, 4, 1);
        this.buildStairs(155, 4, -1);

        // Final staircase pyramid
        this.buildStairs(181, 8, 1);
        this.setTile(197, 12, 'stone');

        // Flagpole at x = 198
        this.flagpole = {
            x: 198 * TILE_SIZE + 4,
            topTileY: 3,
            bottomTileY: 13,
            flagY: 3 * TILE_SIZE
        };
        for (let y = 3; y < 13; y++) {
            this.setTile(198, y, y === 3 ? 'flagpole_top' : 'flagpole_shaft');
        }

        // Castle at 202 - 207
        this.castle = {
            x: 202 * TILE_SIZE,
            y: 8 * TILE_SIZE,
            doorX: 204 * TILE_SIZE
        };
        this.buildCastle(202, 8);

        // Enemies
        this.enemies.push(new Goomba(22 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(41 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(51 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(53 * TILE_SIZE, 12 * TILE_SIZE));

        this.enemies.push(new Koopa(82 * TILE_SIZE, 4 * TILE_SIZE));
        this.enemies.push(new Koopa(107 * TILE_SIZE, 12 * TILE_SIZE));

        this.enemies.push(new Goomba(97 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(99 * TILE_SIZE, 12 * TILE_SIZE));

        this.enemies.push(new Goomba(124 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(126 * TILE_SIZE, 12 * TILE_SIZE));

        this.enemies.push(new Koopa(166 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(174 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(176 * TILE_SIZE, 12 * TILE_SIZE));

        // Floating Coins
        for (let i = 0; i < 5; i++) {
            this.items.push(new LevelCoin((81 + i) * TILE_SIZE, 3 * TILE_SIZE));
        }
        for (let i = 0; i < 4; i++) {
            this.items.push(new LevelCoin((118 + i) * TILE_SIZE, 3 * TILE_SIZE));
        }
    }

    buildLevel1_2() {
        this.theme = 'underground';

        for (let x = 0; x < this.widthInTiles; x++) {
            this.setTile(x, 0, 'stone');
            this.setTile(x, 1, 'stone');
        }
        this.buildGround(0, 50);
        this.buildGround(54, 110);
        this.buildGround(114, 200);

        for (let x = 10; x < 25; x++) {
            this.setTile(x, 8, 'brick');
            if (x % 3 === 0) {
                this.blockContent[`${x},8`] = { type: 'coin', hits: 1 };
            }
        }
        this.setTile(20, 8, 'question_1');
        this.blockContent['20,8'] = { type: 'mushroom', hits: 1 };

        this.buildPipe(32, 3);
        this.buildPipe(40, 4);

        for (let x = 60; x <= 75; x++) {
            this.setTile(x, 7, 'stone');
            if (x % 4 === 0) {
                this.items.push(new LevelCoin(x * TILE_SIZE, 5 * TILE_SIZE));
            }
        }

        this.flagpole = {
            x: 180 * TILE_SIZE + 4,
            topTileY: 3,
            bottomTileY: 13,
            flagY: 3 * TILE_SIZE
        };
        for (let y = 3; y < 13; y++) {
            this.setTile(180, y, y === 3 ? 'flagpole_top' : 'flagpole_shaft');
        }

        this.castle = {
            x: 184 * TILE_SIZE,
            y: 8 * TILE_SIZE,
            doorX: 186 * TILE_SIZE
        };
        this.buildCastle(184, 8);

        this.enemies.push(new Goomba(18 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Koopa(26 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(62 * TILE_SIZE, 6 * TILE_SIZE));
        this.enemies.push(new Koopa(80 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(95 * TILE_SIZE, 12 * TILE_SIZE));
        this.enemies.push(new Goomba(97 * TILE_SIZE, 12 * TILE_SIZE));
    }

    buildCastle(startX, startY) {
        for (let dy = 0; dy < 5; dy++) {
            for (let dx = 0; dx < 5; dx++) {
                const tx = startX + dx;
                const ty = startY + dy;
                if (dy === 0) {
                    this.setTile(tx, ty, 'castle_turret');
                } else if (dx === 2 && dy >= 3) {
                    this.setTile(tx, ty, dy === 3 ? 'castle_door_top' : 'castle_door_bottom');
                } else {
                    this.setTile(tx, ty, 'castle_brick');
                }
            }
        }
    }

    onBlockBonk(tx, ty, player, game) {
        const key = `${tx},${ty}`;
        const tile = this.getTile(tx, ty);

        const blockTopY = ty * TILE_SIZE;
        const blockLeftX = tx * TILE_SIZE;
        const blockRightX = (tx + 1) * TILE_SIZE;

        for (const enemy of this.enemies) {
            if (enemy.alive && !enemy.isSquished) {
                if (Math.abs(enemy.y + enemy.height - blockTopY) <= 4 &&
                    (enemy.x + enemy.width > blockLeftX && enemy.x < blockRightX)) {
                    enemy.dieFly();
                    game.addScore(100, enemy.x, enemy.y);
                }
            }
        }

        this.bumpedBlocks.push({
            tx, ty, tile,
            timer: 0,
            duration: 0.16
        });

        if (tile && tile.startsWith('question_')) {
            const content = this.blockContent[key];
            this.setTile(tx, ty, 'question_empty');

            if (content && content.type === 'coin') {
                this.items.push(new BlockCoin(tx * TILE_SIZE, (ty - 1) * TILE_SIZE));
            } else if (content && (content.type === 'mushroom' || content.type === 'flower')) {
                if (player.form === 'small') {
                    this.items.push(new Mushroom(tx * TILE_SIZE, ty * TILE_SIZE));
                } else {
                    this.items.push(new FireFlower(tx * TILE_SIZE, ty * TILE_SIZE));
                }
                window.sound.playPowerupAppear();
            } else if (content && content.type === '1up') {
                this.items.push(new Mushroom(tx * TILE_SIZE, ty * TILE_SIZE, true));
                window.sound.playPowerupAppear();
            } else {
                window.sound.playBump();
            }
            return;
        }

        if (tile === 'brick') {
            const content = this.blockContent[key];
            if (content) {
                if (content.type === 'coin') {
                    this.items.push(new BlockCoin(tx * TILE_SIZE, (ty - 1) * TILE_SIZE));
                    content.hits--;
                    if (content.hits <= 0) {
                        this.setTile(tx, ty, 'question_empty');
                    }
                }
                return;
            }

            if (player.form !== 'small') {
                this.setTile(tx, ty, null);
                window.sound.playBreak();
                game.addScore(50, tx * TILE_SIZE, ty * TILE_SIZE);

                const px = tx * TILE_SIZE;
                const py = ty * TILE_SIZE;
                this.particles.push(new BrickDebris(px, py, -60, -280));
                this.particles.push(new BrickDebris(px + 8, py, 60, -280));
                this.particles.push(new BrickDebris(px, py + 8, -50, -180));
                this.particles.push(new BrickDebris(px + 8, py + 8, 50, -180));
            } else {
                window.sound.playBump();
            }
        }
    }

    update(dt, game) {
        for (let i = this.bumpedBlocks.length - 1; i >= 0; i--) {
            const b = this.bumpedBlocks[i];
            b.timer += dt;
            if (b.timer >= b.duration) {
                this.bumpedBlocks.splice(i, 1);
            }
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(dt, this, game);
            if (enemy.remove) {
                this.enemies.splice(i, 1);
            }
        }

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.update(dt, this, game);
            if (item.remove) {
                this.items.splice(i, 1);
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(dt);
            if (p.remove) {
                this.particles.splice(i, 1);
            }
        }

        if (this.flagpole && !game.player.isWinning) {
            const p = game.player;
            if (p.x + p.width >= this.flagpole.x - 4 && p.x <= this.flagpole.x + 8) {
                p.startFlagpole(this.flagpole);
            }
        }

        if (this.flagpole && game.player.isWinning && this.flagpole.flagY < (this.flagpole.bottomTileY - 1) * TILE_SIZE) {
            this.flagpole.flagY += 130 * dt;
        }
    }

    drawScenery(ctx, cameraX) {
        this.scenery.forEach(item => {
            const px = item.x * TILE_SIZE;
            const py = item.y * TILE_SIZE;

            if (px > cameraX - 100 && px < cameraX + 450) {
                if (item.type === 'hill_big') {
                    this.drawHill(ctx, px, py, 60, 48);
                } else if (item.type === 'hill_small') {
                    this.drawHill(ctx, px, py + 16, 36, 32);
                } else if (item.type.startsWith('cloud_')) {
                    this.drawCloud(ctx, px, py, item.type);
                } else if (item.type.startsWith('bush_')) {
                    this.drawBush(ctx, px, py, item.type);
                }
            }
        });
    }

    drawHill(ctx, x, y, w, h) {
        ctx.fillStyle = '#00a800';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h);
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#005800';
        ctx.fillRect(x + w / 2 - 2, y + 10, 4, 3);
        ctx.fillRect(x + w / 2 - 8, y + 22, 4, 3);
        ctx.fillRect(x + w / 2 + 6, y + 24, 4, 3);
    }

    drawCloud(ctx, x, y, type) {
        ctx.fillStyle = '#ffffff';
        let count = type === 'cloud_single' ? 2 : (type === 'cloud_double' ? 3 : 4);
        for (let i = 0; i < count; i++) {
            ctx.beginPath();
            ctx.arc(x + i * 12, y + 6, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillRect(x - 2, y + 4, count * 12, 8);
    }

    drawBush(ctx, x, y, type) {
        ctx.fillStyle = '#80d010';
        let count = type === 'bush_single' ? 2 : (type === 'bush_double' ? 3 : 4);
        for (let i = 0; i < count; i++) {
            ctx.beginPath();
            ctx.arc(x + i * 10, y + 8, 7, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillRect(x - 1, y + 6, count * 10, 8);
    }

    draw(ctx, cameraX) {
        const startTileX = Math.max(0, Math.floor(cameraX / TILE_SIZE));
        const endTileX = Math.min(this.widthInTiles - 1, Math.ceil((cameraX + 400) / TILE_SIZE));

        // 1. Scenery
        this.drawScenery(ctx, cameraX);

        // 2. Emerging items (drawn behind blocks)
        this.items.forEach(item => {
            if (item.emerging) item.draw(ctx);
        });

        // 3. Tiles
        const qFrame = Math.floor(Date.now() / 200) % 2 === 0 ? 'question_1' : 'question_2';

        for (let y = 0; y < this.heightInTiles; y++) {
            for (let x = startTileX; x <= endTileX; x++) {
                let tile = this.tiles[y][x];
                if (!tile) continue;

                if (tile.startsWith('question_') && tile !== 'question_empty') {
                    tile = qFrame;
                }

                let offsetY = 0;
                const bumped = this.bumpedBlocks.find(b => b.tx === x && b.ty === y);
                if (bumped) {
                    const progress = bumped.timer / bumped.duration;
                    offsetY = -Math.sin(progress * Math.PI) * 7;
                }

                window.sprites.draw(ctx, tile, x * TILE_SIZE, y * TILE_SIZE + offsetY);
            }
        }

        // 4. Flag on Flagpole
        if (this.flagpole) {
            window.sprites.draw(ctx, 'flag', this.flagpole.x - 12, this.flagpole.flagY);
        }

        // 5. Non-emerging items
        this.items.forEach(item => {
            if (!item.emerging) item.draw(ctx);
        });

        // 6. Enemies
        this.enemies.forEach(enemy => enemy.draw(ctx));

        // 7. Particles
        this.particles.forEach(p => p.draw(ctx));
    }
}
