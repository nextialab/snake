// Constants
var _RIGHT_ = 0;
var _UP_ = 1;
var _LEFT_ = 2;
var _DOWN_ = 3;

var grid = [];
var edge = 20;
var playing = false;
var speed = 5;
var deltaSpeed = 5;
var time = 0;
var direction = _RIGHT_;
var cursors;
var graphics;

function snakeBody(x, y) {
    return {
        x: x,
        y: y,
        next: null,
        update: function (x, y) {
            if (this.next != null) {
                this.next.update(this.x, this.y);
            }
            this.x = x;
            this.y = y;
        }
    };
}

var snake = snakeBody(10, 10);
snake.next = snakeBody(9, 10);
snake.next.next = snakeBody(8, 10);
var tail = snake.next.next;

function initGrid() {
    for (var i = 0; i < 30; ++i) {
        var row = [];
        for (var j = 0; j < 40; ++j) {
            if (i == 0 || j == 0 || i == 29 || j == 39) {
                row[j] = 1;
            } else {
                row[j] = 0;
            }
        }
        grid[i] = row;
    }
    grid[10][10] = 1;
    grid[10][9] = 1;
    grid[10][8] = 1;
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
});

function preload() {

}

function draw() {
    graphics.beginFill(0xFFFFFF, 1);
    graphics.drawRect(0, 0, 800, 600);
    graphics.endFill();
    graphics.beginFill(0x000000, 1);
    for (var i = 0; i < 30; ++i) {
        for (var j = 0; j < 40; ++j) {
            if (grid[i][j] == 1) {
                graphics.drawRect(edge * j, edge * i, 20, 20);
            }
        }
    }
    graphics.endFill();
}

function create() {
    graphics = game.add.graphics(0, 0);
    cursors = game.input.keyboard.createCursorKeys();
    initGrid();
    draw();
}

function update() {
    time++;
    if (cursors.left.isDown && direction != _RIGHT_) {
        direction = _LEFT_;
    } else if (cursors.up.isDown && direction != _DOWN_) {
        direction = _UP_;
    } else if (cursors.right.isDown && direction != _LEFT_) {
        direction = _RIGHT_;
    } else if (cursors.down.isDown && direction != _UP_) {
        direction = _DOWN_;
    }
    if (time % 10 == 0) {
        // update grid from tail
        grid[tail.y][tail.x] = 0;
        // update head
        var x = snake.x;
        var y = snake.y;
        switch (direction) {
            case _LEFT_:
                x--;
                break;
            case _UP_:
                y--;
                break;
            case _RIGHT_:
                x++;
                break;
            case _DOWN_:
                y++;
                break;
        }
        snake.update(x, y);
        // update grid with new head
        grid[snake.y][snake.x] = 1;
        draw();
    }
}
