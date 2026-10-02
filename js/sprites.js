// Pixel Art Sprites Generator for Super Mario Style Game
class SpriteManager {
    constructor() {
        this.cache = {};
        this.palette = {
            '.': null, // Transparent
            'R': '#e52521', // Mario Red
            'r': '#980000', // Dark Red
            'B': '#0020c0', // Mario Blue (overalls)
            'b': '#001060', // Dark Blue
            'S': '#fcb078', // Skin tone
            's': '#c87830', // Shadow skin tone
            'D': '#684000', // Dark brown / Mustache / Shoes
            'd': '#382000', // Deep brown
            'W': '#ffffff', // White
            'G': '#00a800', // Bright Green (Pipe, Koopa)
            'g': '#005800', // Dark Green
            'Y': '#fcb000', // Bright Yellow/Gold
            'y': '#d07000', // Dark Yellow/Orange
            'O': '#fc7400', // Bright Orange (Brick)
            'o': '#983400', // Brick shadow / Goomba body
            'K': '#000000', // Black
            'T': '#606060', // Stone gray
            't': '#909090', // Light stone gray
            'C': '#80d010', // Light green highlight
            'X': '#fc5454', // Fire flower / Peach
        };

        this.initSprites();
    }

    createCanvas(w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }

    renderPixelMatrix(matrix, w, h, customPalette = null) {
        const canvas = this.createCanvas(w, h);
        const ctx = canvas.getContext('2d');
        const pal = customPalette || this.palette;

        for (let y = 0; y < h; y++) {
            const row = matrix[y] || '';
            for (let x = 0; x < w; x++) {
                const char = row[x] || '.';
                const color = pal[char];
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
        return canvas;
    }

    initSprites() {
        // --- SMALL MARIO (16x16) ---
        const mario_small_idle = [
            ".....RRRRR......",
            "....RRRRRRRRR...",
            "....DDDSSD......",
            "...DSDSSSD......",
            "...DSDDSSSD.....",
            "...DDSSSSDD.....",
            ".....SSSSSSS....",
            "....RRBRRR......",
            "...RRRBRRBRR....",
            "..RRRRBBBBRRR...",
            "..SSRBBYBBRSS...",
            "..SSSBBYBBSSS...",
            "..SSBBBBBBSS....",
            "....BBBBBB......",
            "...DDD..DDD.....",
            "..DDDD..DDDD...."
        ];

        const mario_small_run1 = [
            ".....RRRRR......",
            "....RRRRRRRRR...",
            "....DDDSSD......",
            "...DSDSSSD......",
            "...DSDDSSSD.....",
            "...DDSSSSDD.....",
            ".....SSSSSSS....",
            "....RRBRRR......",
            "...RRRBRRBRR....",
            "..SSRRBBBBRSS...",
            "..SSRBBYBBSSS...",
            "...SBBBBBBSS....",
            "....BBBBBB......",
            "...DDDBBB.......",
            "...DDD.DDD......",
            "........DDDD...."
        ];

        const mario_small_run2 = [
            ".....RRRRR......",
            "....RRRRRRRRR...",
            "....DDDSSD......",
            "...DSDSSSD......",
            "...DSDDSSSD.....",
            "...DDSSSSDD.....",
            ".....SSSSSSS....",
            "...RRRBRRR......",
            "..RRRRBRRBRR....",
            ".SSRRRBBBBRSS...",
            ".SS.RBBYBBSS....",
            "....BBBBBB......",
            "...BBBBBBBB.....",
            "..DDDD..DDDD....",
            ".DDDD....DDDD...",
            "................"
        ];

        const mario_small_run3 = [
            ".....RRRRR......",
            "....RRRRRRRRR...",
            "....DDDSSD......",
            "...DSDSSSD......",
            "...DSDDSSSD.....",
            "...DDSSSSDD.....",
            ".....SSSSSSS....",
            "....RRBRRR......",
            "...RRRBRRBRR....",
            "..RRRRBBBBRRR...",
            "..SSRBBYBBRSS...",
            "..SSSBBYBBSSS...",
            "...SSBBBBSS.....",
            "....BBBBBB......",
            ".....DDDBBB.....",
            "....DDDD.DDD...."
        ];

        const mario_small_jump = [
            ".....RRRRR......",
            "....RRRRRRRRR...",
            "....DDDSSD......",
            "...DSDSSSD......",
            "...DSDDSSSD.....",
            "...DDSSSSDD.....",
            ".....SSSSSSS....",
            "..SSRRBRRRSS....",
            "..SSRRBRRBRSS...",
            "..SSRRBBBBRSS...",
            "....RRBBYBBR....",
            "....BBBBBBBB....",
            "...BBBBBBBBBB...",
            "..DDDBBB.BBBDD..",
            "..DDD.......DDD.",
            "................"
        ];

        const mario_small_skid = [
            ".....RRRRR......",
            "....RRRRRRRRR...",
            "....DDDSSD......",
            "...DSDSSSD......",
            "...DSDDSSSD.....",
            "...DDSSSSDD.....",
            ".....SSSSSSS....",
            "....RRBRRRSS....",
            "...RRRBRRBRSS...",
            "..RRRRBBBBRSS...",
            "..SSRBBYBBR.....",
            "..SS.BBBB.......",
            "....BBBBBB......",
            "...DDD..DDDB....",
            "..DDDD..DDDD....",
            "................"
        ];

        const mario_small_die = [
            ".....RRRRR......",
            "....RRRRRRRRR...",
            "....DDDSSD......",
            "...DSDSSSD......",
            "...DSDDSSSD.....",
            "...DDSSSSDD.....",
            ".....SSSSSSS....",
            "...SSSRRRSSS....",
            "..SSSRRRRRSSS...",
            "..SSSRRBRRSSS...",
            "....RRBBYBBR....",
            "....BBBBBBBB....",
            "...BBBBBBBBBB...",
            "..DDD...D..DDD..",
            "..DDDD.....DDDD.",
            "................"
        ];

        // Store Small Mario
        this.cache['mario_small_idle'] = this.renderPixelMatrix(mario_small_idle, 16, 16);
        this.cache['mario_small_run1'] = this.renderPixelMatrix(mario_small_run1, 16, 16);
        this.cache['mario_small_run2'] = this.renderPixelMatrix(mario_small_run2, 16, 16);
        this.cache['mario_small_run3'] = this.renderPixelMatrix(mario_small_run3, 16, 16);
        this.cache['mario_small_jump'] = this.renderPixelMatrix(mario_small_jump, 16, 16);
        this.cache['mario_small_skid'] = this.renderPixelMatrix(mario_small_skid, 16, 16);
        this.cache['mario_small_die'] = this.renderPixelMatrix(mario_small_die, 16, 16);
        this.cache['mario_small_flag'] = this.renderPixelMatrix(mario_small_idle, 16, 16);

        // --- SUPER MARIO (16x32) ---
        const mario_big_idle = [
            "......RRRRR.....",
            ".....RRRRRRRRR..",
            ".....DDDSSD.....",
            "....DSDSSSD.....",
            "....DSDDSSSD....",
            "....DDSSSSDD....",
            "......SSSSSSS...",
            ".....RRBRRR.....",
            "....RRRBRRBRR...",
            "...RRRRBBBBRRR..",
            "...SSRBBYBBRSS..",
            "...SSSBBYBBSSS..",
            "...SSBBBBBBSS...",
            ".....BBBBBB.....",
            "....BBBBBBBB....",
            "...BBBBBBBBBB...",
            "...BBBBBBBBBB...",
            "...BBBBBBBBBB...",
            "...BBBB..BBBB...",
            "...BBB....BBB...",
            "...BBB....BBB...",
            "...BBB....BBB...",
            "...BBB....BBB...",
            "...BBB....BBB...",
            "...BBB....BBB...",
            "...BBB....BBB...",
            "...BBB....BBB...",
            "..DDDD....DDDD..",
            "..DDDD....DDDD..",
            ".DDDDD....DDDDD.",
            "................",
            "................"
        ];

        const mario_big_run1 = [
            "......RRRRR.....",
            ".....RRRRRRRRR..",
            ".....DDDSSD.....",
            "....DSDSSSD.....",
            "....DSDDSSSD....",
            "....DDSSSSDD....",
            "......SSSSSSS...",
            ".....RRBRRR.....",
            "....RRRBRRBRR...",
            "...SSRRBBBBRSS..",
            "...SSRBBYBBSSS..",
            "....SBBBBBBSS...",
            ".....BBBBBB.....",
            "....BBBBBBBB....",
            "...BBBBBBBBBB...",
            "...BBBBBBBBBB...",
            "...BBBBB.BBBB...",
            "...BBBBB.BBBB...",
            "...BBBB...BBB...",
            "...BBB....BBB...",
            "...BBB....BBB...",
            "..DDDB....BBB...",
            "..DDDB....BBBD..",
            "..DDDD....DDDD..",
            "..DDDD....DDDD..",
            "...........DDDD.",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................"
        ];

        const mario_big_run2 = [
            "......RRRRR.....",
            ".....RRRRRRRRR..",
            ".....DDDSSD.....",
            "....DSDSSSD.....",
            "....DSDDSSSD....",
            "....DDSSSSDD....",
            "......SSSSSSS...",
            "....RRRBRRR.....",
            "...RRRRBRRBRR...",
            "..SSRRRBBBBRSS..",
            "..SS.RBBYBBSS...",
            ".....BBBBBB.....",
            "....BBBBBBBB....",
            "...BBBBBBBBBB...",
            "...BBBBBBBBBB...",
            "...BBBBBBBBBB...",
            "...BBBB..BBBB...",
            "..BBBB....BBBB..",
            "..BBBB....BBBB..",
            "..BBB......BBB..",
            ".DDDD......DDDD.",
            ".DDDD......DDDD.",
            "DDDDD......DDDDD",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................"
        ];

        const mario_big_run3 = [
            "......RRRRR.....",
            ".....RRRRRRRRR..",
            ".....DDDSSD.....",
            "....DSDSSSD.....",
            "....DSDDSSSD....",
            "....DDSSSSDD....",
            "......SSSSSSS...",
            ".....RRBRRR.....",
            "....RRRBRRBRR...",
            "...RRRRBBBBRRR..",
            "...SSRBBYBBRSS..",
            "...SSSBBYBBSSS..",
            "....SSBBBBSS....",
            ".....BBBBBB.....",
            "....BBBBBBBB....",
            "...BBBBBBBBBB...",
            "...BBBBBBBBBB...",
            "...BBBB.BBBBB...",
            "...BBB..BBBBB...",
            "...BBB...BBBB...",
            "...BBB....BBB...",
            "...BBB....BBB...",
            "...BBBD..BDDD...",
            "...DDDD..DDDD...",
            "..DDDD...DDDD...",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................"
        ];

        const mario_big_jump = [
            "......RRRRR.....",
            ".....RRRRRRRRR..",
            ".....DDDSSD.....",
            "....DSDSSSD.....",
            "....DSDDSSSD....",
            "....DDSSSSDD....",
            "......SSSSSSS...",
            "...SSRRBRRRSS...",
            "...SSRRBRRBRSS..",
            "...SSRRBBBBRSS..",
            ".....RRBBYBBR...",
            ".....BBBBBBBB...",
            "....BBBBBBBBBB..",
            "...BBBBBBBBBBBB.",
            "...BBBBBBBBBBBB.",
            "...BBBBBBBBBBBB.",
            "...BBBB...BBBBB.",
            "..BBBB.....BBBB.",
            "..BBBB.....BBBB.",
            "..BBB.......BBB.",
            ".DDDB.......BDDD",
            ".DDDD.......DDDD",
            "DDDD.........DDD",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................"
        ];

        const mario_big_crouch = [
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "......RRRRR.....",
            ".....RRRRRRRRR..",
            ".....DDDSSD.....",
            "....DSDSSSD.....",
            "....DSDDSSSD....",
            "....DDSSSSDD....",
            "......SSSSSSS...",
            ".....RRBRRR.....",
            "....RRRBRRBRR...",
            "...RRRRBBBBRRR..",
            "...SSRBBYBBRSS..",
            "...SSSBBYBBSSS..",
            "...SSBBBBBBSS...",
            "....BBBBBBBB....",
            "...BBBBBBBBBB...",
            "...BBBBBBBBBB...",
            "...BBBBBBBBBB...",
            "..DDDDDDDDDDDD..",
            "..DDDDDDDDDDDD..",
            "................",
            "................",
            "................",
            "................",
            "................"
        ];

        this.cache['mario_big_idle'] = this.renderPixelMatrix(mario_big_idle, 16, 32);
        this.cache['mario_big_run1'] = this.renderPixelMatrix(mario_big_run1, 16, 32);
        this.cache['mario_big_run2'] = this.renderPixelMatrix(mario_big_run2, 16, 32);
        this.cache['mario_big_run3'] = this.renderPixelMatrix(mario_big_run3, 16, 32);
        this.cache['mario_big_jump'] = this.renderPixelMatrix(mario_big_jump, 16, 32);
        this.cache['mario_big_skid'] = this.renderPixelMatrix(mario_big_idle, 16, 32);
        this.cache['mario_big_crouch'] = this.renderPixelMatrix(mario_big_crouch, 16, 32);
        this.cache['mario_big_flag'] = this.renderPixelMatrix(mario_big_idle, 16, 32);

        // Aliases for mario_super_* so both naming conventions work seamlessly
        ['idle', 'run1', 'run2', 'run3', 'jump', 'skid', 'crouch', 'flag'].forEach(anim => {
            this.cache[`mario_super_${anim}`] = this.cache[`mario_big_${anim}`];
        });

        // --- FIRE MARIO PALETTE ---
        // Fire Mario wears white cap/shirt and red overalls!
        const firePalette = { ...this.palette, 'R': '#ffffff', 'B': '#e52521' };
        this.cache['mario_fire_idle'] = this.renderPixelMatrix(mario_big_idle, 16, 32, firePalette);
        this.cache['mario_fire_run1'] = this.renderPixelMatrix(mario_big_run1, 16, 32, firePalette);
        this.cache['mario_fire_run2'] = this.renderPixelMatrix(mario_big_run2, 16, 32, firePalette);
        this.cache['mario_fire_run3'] = this.renderPixelMatrix(mario_big_run3, 16, 32, firePalette);
        this.cache['mario_fire_jump'] = this.renderPixelMatrix(mario_big_jump, 16, 32, firePalette);
        this.cache['mario_fire_skid'] = this.renderPixelMatrix(mario_big_idle, 16, 32, firePalette);
        this.cache['mario_fire_crouch'] = this.renderPixelMatrix(mario_big_crouch, 16, 32, firePalette);
        this.cache['mario_fire_flag'] = this.renderPixelMatrix(mario_big_idle, 16, 32, firePalette);

        // --- GOOMBA (16x16) ---
        const goomba_walk1 = [
            "......oooo......",
            "....oooooooo....",
            "...oooooooooo...",
            "..oooooooooooo..",
            ".oooooooooooooo.",
            ".oooooooooooooo.",
            ".oooWWdooodWWoo.",
            "oooWWWdooodWWWoo",
            "oooKKKdooodKKKoo",
            "oooKKKdooodKKKoo",
            ".oooooooooooooo.",
            "..SSSSSSSSSSSS..",
            ".SSSSSSSSSSSSSS.",
            ".DDDDDD..DDDDDD.",
            "DDDDDDD..DDDDDDD",
            "DDDDDDD..DDDDDDD"
        ];

        const goomba_walk2 = [
            "......oooo......",
            "....oooooooo....",
            "...oooooooooo...",
            "..oooooooooooo..",
            ".oooooooooooooo.",
            ".oooooooooooooo.",
            ".oooWWdooodWWoo.",
            "oooWWWdooodWWWoo",
            "oooKKKdooodKKKoo",
            "oooKKKdooodKKKoo",
            ".oooooooooooooo.",
            "..SSSSSSSSSSSS..",
            ".SSSSSSSSSSSSSS.",
            "..DDDDDDDDDDDD..",
            "...DDDDDDDDDD...",
            "....DDDDDDDD...."
        ];

        const goomba_flat = [
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "....oooooooo....",
            "..oooooooooooo..",
            ".oooWWdooodWWoo.",
            "oooWWWdooodWWWoo",
            "oooKKKdooodKKKoo",
            "DDDDDDDDDDDDDDDD",
            "DDDDDDDDDDDDDDDD"
        ];

        this.cache['goomba_walk1'] = this.renderPixelMatrix(goomba_walk1, 16, 16);
        this.cache['goomba_walk2'] = this.renderPixelMatrix(goomba_walk2, 16, 16);
        this.cache['goomba_flat'] = this.renderPixelMatrix(goomba_flat, 16, 16);

        // --- KOOPA TROOPA (16x24) ---
        const koopa_walk1 = [
            ".....GGGG.......",
            "....GGGGGG......",
            "...GGGGGGGG.....",
            "...GWWGGYYY.....",
            "..GGWWGYYYY.....",
            "..GGKKGYYYY.....",
            "..GGGGYYYYY.....",
            "....YYYYYY......",
            "....YYYYYY......",
            "...GGGGGGGG.....",
            "..GGGGGGGGGG....",
            ".GGGGGGGGGGGG...",
            ".GGWWGGGGWWGG...",
            ".GGWWGGGGWWGG...",
            ".GGGGGGGGGGGG...",
            ".GGGGGGGGGGGG...",
            "..GGGGGGGGGG....",
            "...YYYYYYYY.....",
            "....YY...YY.....",
            "....YY...YY.....",
            "...YYY...YYY....",
            "..YYYY...YYYY...",
            "..YYYY...YYYY...",
            "................"
        ];

        const koopa_walk2 = [
            ".....GGGG.......",
            "....GGGGGG......",
            "...GGGGGGGG.....",
            "...GWWGGYYY.....",
            "..GGWWGYYYY.....",
            "..GGKKGYYYY.....",
            "..GGGGYYYYY.....",
            "....YYYYYY......",
            "....YYYYYY......",
            "...GGGGGGGG.....",
            "..GGGGGGGGGG....",
            ".GGGGGGGGGGGG...",
            ".GGWWGGGGWWGG...",
            ".GGWWGGGGWWGG...",
            ".GGGGGGGGGGGG...",
            ".GGGGGGGGGGGG...",
            "..GGGGGGGGGG....",
            "...YYYYYYYY.....",
            ".....YY...YY....",
            ".....YY...YY....",
            "....YYY...YYY...",
            "...YYYY...YYYY..",
            "..YYYY.....YYYY.",
            "................"
        ];

        const koopa_shell = [
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "................",
            "....GGGGGGGG....",
            "..GGGGGGGGGGGG..",
            ".GGGGGGGGGGGGGG.",
            "GGGGWWGGGGWWGGGG",
            "GGGGWWGGGGWWGGGG",
            "GGGGGGGGGGGGGGGG",
            "GGGGGGGGGGGGGGGG",
            ".GGGGGGGGGGGGGG.",
            "..GGGGGGGGGGGG..",
            "....YYYYYYYY....",
            ".....YYYYYY.....",
            "......YYYY......",
            "................",
            "................",
            "................",
            "................"
        ];

        this.cache['koopa_walk1'] = this.renderPixelMatrix(koopa_walk1, 16, 24);
        this.cache['koopa_walk2'] = this.renderPixelMatrix(koopa_walk2, 16, 24);
        this.cache['koopa_shell'] = this.renderPixelMatrix(koopa_shell, 16, 24);

        // --- TILES (16x16) ---

        // Ground Block (Classic Mario Ground Tile)
        const tile_ground = [
            "CCCCCCCCCCCCCCCC",
            "GGGGGGGGGGGGGGGG",
            "gggggggggggggggg",
            "DDDDDDDDDDDDDDDD",
            "DooDDooDDooDDooD",
            "DooDDooDDooDDooD",
            "DDDDDDDDDDDDDDDD",
            "oDDooDDooDDooDDo",
            "oDDooDDooDDooDDo",
            "DDDDDDDDDDDDDDDD",
            "DooDDooDDooDDooD",
            "DooDDooDDooDDooD",
            "DDDDDDDDDDDDDDDD",
            "oDDooDDooDDooDDo",
            "oDDooDDooDDooDDo",
            "DDDDDDDDDDDDDDDD"
        ];
        this.cache['ground'] = this.renderPixelMatrix(tile_ground, 16, 16);

        // Brick Block
        const tile_brick = [
            "OOOOOOOOOOOOOOOO",
            "OoooooOOoooooooO",
            "OoooooOOoooooooO",
            "OKKKKKOOKKKKKKKO",
            "OOOOOOOOOOOOOOOO",
            "OoooOOoooooOOooO",
            "OoooOOoooooOOooO",
            "OKKKOOKKKKKOOKKO",
            "OOOOOOOOOOOOOOOO",
            "OoooooOOoooooooO",
            "OoooooOOoooooooO",
            "OKKKKKOOKKKKKKKO",
            "OOOOOOOOOOOOOOOO",
            "OoooOOoooooOOooO",
            "OoooOOoooooOOooO",
            "KKKKKKKKKKKKKKKK"
        ];
        this.cache['brick'] = this.renderPixelMatrix(tile_brick, 16, 16);

        // Question Block 1 (Bright)
        const q_block_1 = [
            "YYYYYYYYYYYYYYYY",
            "Yyyyyyyyyyyyyyyy",
            "Yy............yK",
            "Yy...YYYYYY...yK",
            "Yy..YYyKKyYY..yK",
            "Yy..YYKKKKYY..yK",
            "Yy.....KKYY...yK",
            "Yy....KKYY....yK",
            "Yy....KKYY....yK",
            "Yy............yK",
            "Yy....KKYY....yK",
            "Yy....KKYY....yK",
            "Yy............yK",
            "Yy............yK",
            "YyyyyyyyyyyyyyyK",
            "KKKKKKKKKKKKKKKK"
        ];

        // Question Block 2 (Slightly darker frame)
        const q_block_2 = [
            "YYYYYYYYYYYYYYYY",
            "Yyyyyyyyyyyyyyyy",
            "Yy............yK",
            "Yy...yyyyyy...yK",
            "Yy..yyyKKyyy..yK",
            "Yy..yyKKKKyy..yK",
            "Yy.....KKyy...yK",
            "Yy....KKyy....yK",
            "Yy....KKyy....yK",
            "Yy............yK",
            "Yy....KKyy....yK",
            "Yy....KKyy....yK",
            "Yy............yK",
            "Yy............yK",
            "YyyyyyyyyyyyyyyK",
            "KKKKKKKKKKKKKKKK"
        ];

        // Empty Block (Hit Question/Brick)
        const tile_empty_block = [
            "DDDDDDDDDDDDDDDD",
            "DooooooooooooooK",
            "DoKK........KKoK",
            "DoKK........KKoK",
            "Do............oK",
            "Do............oK",
            "Do............oK",
            "Do............oK",
            "Do............oK",
            "Do............oK",
            "Do............oK",
            "Do............oK",
            "DoKK........KKoK",
            "DoKK........KKoK",
            "DooooooooooooooK",
            "KKKKKKKKKKKKKKKK"
        ];

        this.cache['question_1'] = this.renderPixelMatrix(q_block_1, 16, 16);
        this.cache['question_2'] = this.renderPixelMatrix(q_block_2, 16, 16);
        this.cache['question_empty'] = this.renderPixelMatrix(tile_empty_block, 16, 16);

        // Stone / Stair Step Block
        const tile_stone = [
            "tttttttttttttttt",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "tTTTTTTTTTTTTTTK",
            "KKKKKKKKKKKKKKKK"
        ];
        this.cache['stone'] = this.renderPixelMatrix(tile_stone, 16, 16);

        // --- PIPES (16x16 parts) ---
        const pipe_top_left = [
            "GGGGGGGGGGGGGGGG",
            "GCWWCCCCCCCCCCCG",
            "GCCCCCCCCCCCCCCG",
            "GCCCCCCCCCCCCCCG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "gggggggggggggggg"
        ];
        const pipe_top_right = [
            "GGGGGGGGGGGGGGGG",
            "GCCCCCCCCCCCCCCK",
            "GGGGGGGGGGGGGGgK",
            "gggggggggggggggK",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "gggggggggggggggK"
        ];
        const pipe_body_left = [
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG",
            "GCWWGGGGGGGGGGGG"
        ];
        const pipe_body_right = [
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg",
            "GGGGGGGGGGGGGGGg"
        ];
        this.cache['pipe_top_left'] = this.renderPixelMatrix(pipe_top_left, 16, 16);
        this.cache['pipe_top_right'] = this.renderPixelMatrix(pipe_top_right, 16, 16);
        this.cache['pipe_body_left'] = this.renderPixelMatrix(pipe_body_left, 16, 16);
        this.cache['pipe_body_right'] = this.renderPixelMatrix(pipe_body_right, 16, 16);

        // --- ITEMS ---

        // Mushroom Super (16x16)
        const mushroom = [
            "......RRRR......",
            "....RRRRRRRR....",
            "...RRWWRRWWWRR..",
            "..RRWWWWRWWWWRR.",
            "..RRWWWWRWWWWRR.",
            ".RRRWWWRRRWWWRRR",
            ".RRRRRRRRRRRRRRR",
            ".RRRRRRRRRRRRRRR",
            "...SSSSSSSSSS...",
            "...SSSDSSSSSS...",
            "..SSSSSSSSSSSS..",
            "..SSSSSSSSSSSS..",
            "..SSSSSSSSSSSS..",
            "...SSSSSSSSSS...",
            "....SSSSSSSS....",
            "................"
        ];
        this.cache['mushroom'] = this.renderPixelMatrix(mushroom, 16, 16);

        // Mushroom 1UP (Green)
        const mushroom1up = { ...this.palette, 'R': '#00a800', 'r': '#005800' };
        this.cache['mushroom_1up'] = this.renderPixelMatrix(mushroom, 16, 16, mushroom1up);

        // Fire Flower (16x16)
        const flower = [
            "......RRRR......",
            "....RRXXXXRR....",
            "...RXXXXXXXXR...",
            "..RXXYYYYYYXXR..",
            "..RXXYYYYYYXXR..",
            "..RXXYYYYYYXXR..",
            "...RXXXXXXXXR...",
            "....RRXXXXRR....",
            "......RRRR......",
            ".......GG.......",
            "....GG.GG.GG....",
            "...GGGGGGGGGG...",
            "...GGGGGGGGGG...",
            "....GG.GG.GG....",
            ".......GG.......",
            ".......GG......."
        ];
        this.cache['fire_flower'] = this.renderPixelMatrix(flower, 16, 16);

        // Coin (16x16 animated frames)
        const coin1 = [
            ".....YYYYYY.....",
            "...YYYYYYYYYY...",
            "..YYYyyyyyyYYY..",
            "..YYyy....yyYY..",
            ".YYyy..YY..yyYY.",
            ".YYyy..YY..yyYY.",
            ".YYyy..YY..yyYY.",
            ".YYyy..YY..yyYY.",
            ".YYyy..YY..yyYY.",
            ".YYyy..YY..yyYY.",
            ".YYyy..YY..yyYY.",
            "..YYyy....yyYY..",
            "..YYYyyyyyyYYY..",
            "...YYYYYYYYYY...",
            ".....YYYYYY.....",
            "................"
        ];
        const coin2 = [
            "......YYYY......",
            "....YYYYYYYY....",
            "...YYyyyyyyYY...",
            "...Yy..YY..yY...",
            "..YYy..YY..yYY..",
            "..YYy..YY..yYY..",
            "..YYy..YY..yYY..",
            "..YYy..YY..yYY..",
            "..YYy..YY..yYY..",
            "..YYy..YY..yYY..",
            "..YYy..YY..yYY..",
            "...Yy..YY..yY...",
            "...YYyyyyyyYY...",
            "....YYYYYYYY....",
            "......YYYY......",
            "................"
        ];
        const coin3 = [
            ".......YY.......",
            ".....YYYYYY.....",
            "....YYyyyyYY....",
            "....Yy.YY.yY....",
            "....Yy.YY.yY....",
            "....Yy.YY.yY....",
            "....Yy.YY.yY....",
            "....Yy.YY.yY....",
            "....Yy.YY.yY....",
            "....Yy.YY.yY....",
            "....Yy.YY.yY....",
            "....Yy.YY.yY....",
            "....YYyyyyYY....",
            ".....YYYYYY.....",
            ".......YY.......",
            "................"
        ];
        const coin4 = [
            "........Y.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            ".......YY.......",
            "........Y.......",
            "................"
        ];
        this.cache['coin_1'] = this.renderPixelMatrix(coin1, 16, 16);
        this.cache['coin_2'] = this.renderPixelMatrix(coin2, 16, 16);
        this.cache['coin_3'] = this.renderPixelMatrix(coin3, 16, 16);
        this.cache['coin_4'] = this.renderPixelMatrix(coin4, 16, 16);

        // Fireball (8x8)
        const fireball = [
            "..YYYY..",
            ".YYOORR.",
            "YYOORRRR",
            "YYOORRRR",
            "YYOORRRR",
            "YYOORRRR",
            ".YYOORR.",
            "..YYYY.."
        ];
        this.cache['fireball'] = this.renderPixelMatrix(fireball, 8, 8);

        // Brick Fragment (8x8)
        const brick_part = [
            "OOOOOOOO",
            "OooooooO",
            "OKKKKKKO",
            "OOOOOOOO",
            "OooOOooO",
            "OKKOOKKO",
            "OOOOOOOO",
            "KKKKKKKK"
        ];
        this.cache['brick_debris'] = this.renderPixelMatrix(brick_part, 8, 8);

        // Flagpole Top & Flag
        const flagpole_top = [
            ".....YYYY......",
            "....YYYYYY.....",
            "...YYYYYYYY....",
            "...YYYYYYYY....",
            "....YYYYYY.....",
            ".....YYYY......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT......."
        ];
        const flagpole_shaft = [
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT.......",
            "......TT......."
        ];
        const flag = [
            "GGGGGGGGGGGGGG..",
            "GGGGGGGGGGGGGG..",
            "GGGGGGGGGGGG....",
            "GGGGGGGGGGGG....",
            "GGGGGGGGGG......",
            "GGGGGGGGGG......",
            "GGGGGGGG........",
            "GGGGGGGG........",
            "GGGGGG..........",
            "GGGGGG..........",
            "GGGG............",
            "GGGG............",
            "GG..............",
            "GG..............",
            "................",
            "................"
        ];
        this.cache['flagpole_top'] = this.renderPixelMatrix(flagpole_top, 16, 16);
        this.cache['flagpole_shaft'] = this.renderPixelMatrix(flagpole_shaft, 16, 16);
        this.cache['flag'] = this.renderPixelMatrix(flag, 16, 16);

        // Castle Wall & Door (16x16 each)
        const castle_brick = [
            "TTTTTTTTTTTTTTTT",
            "TttttttTTttttttT",
            "TttttttTTttttttT",
            "TKKKKKKTTKKKKKKT",
            "TTTTTTTTTTTTTTTT",
            "TtttTTttttTTtttT",
            "TtttTTttttTTtttT",
            "TKKKTTKKKKTTKKKT",
            "TTTTTTTTTTTTTTTT",
            "TttttttTTttttttT",
            "TttttttTTttttttT",
            "TKKKKKKTTKKKKKKT",
            "TTTTTTTTTTTTTTTT",
            "TtttTTttttTTtttT",
            "TtttTTttttTTtttT",
            "KKKKKKKKKKKKKKKK"
        ];
        const castle_turret = [
            "TT..TT..TT..TT..",
            "TT..TT..TT..TT..",
            "TT..TT..TT..TT..",
            "TTTTTTTTTTTTTTTT",
            "TttttttttttttttT",
            "TttttttttttttttT",
            "TKKKKKKKKKKKKKKT",
            "TTTTTTTTTTTTTTTT",
            "TttttttTTttttttT",
            "TttttttTTttttttT",
            "TKKKKKKTTKKKKKKT",
            "TTTTTTTTTTTTTTTT",
            "TtttTTttttTTtttT",
            "TtttTTttttTTtttT",
            "TKKKTTKKKKTTKKKT",
            "TTTTTTTTTTTTTTTT"
        ];
        const castle_door_top = [
            ".....KKKK......",
            "...KKKKKKKK....",
            "..KKKKKKKKKK...",
            ".KKKKKKKKKKKK..",
            ".KKKKKKKKKKKK..",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK."
        ];
        const castle_door_bottom = [
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK.",
            "KKKKKKKKKKKKKK."
        ];
        this.cache['castle_brick'] = this.renderPixelMatrix(castle_brick, 16, 16);
        this.cache['castle_turret'] = this.renderPixelMatrix(castle_turret, 16, 16);
        this.cache['castle_door_top'] = this.renderPixelMatrix(castle_door_top, 16, 16);
        this.cache['castle_door_bottom'] = this.renderPixelMatrix(castle_door_bottom, 16, 16);
    }

    get(name) {
        return this.cache[name] || null;
    }

    draw(ctx, name, x, y, flipX = false) {
        let sprite = this.cache[name];
        if (!sprite) {
            if (name.startsWith('mario_super_')) {
                sprite = this.cache[name.replace('mario_super_', 'mario_big_')];
            } else if (name.startsWith('mario_big_')) {
                sprite = this.cache[name.replace('mario_big_', 'mario_super_')];
            }
        }
        if (!sprite) return;

        if (flipX) {
            ctx.save();
            ctx.translate(Math.round(x) + sprite.width, Math.round(y));
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, 0, 0);
            ctx.restore();
        } else {
            ctx.drawImage(sprite, Math.round(x), Math.round(y));
        }
    }
}

// Global Sprite Manager instance
window.sprites = new SpriteManager();
