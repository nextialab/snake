// Constants
var _RIGHT_ = 0;
var _UP_ = 1;
var _LEFT_ = 2;
var _DOWN_ = 3;

var _BLACK_ = 0;
var _WHITE_ = 1;
var _RED_ = 2;

var grid = [];
var columns = 40;
var rows = 30;
var edge = 20;
var playing = true;
var speed = 10;
var deltaSpeed = 5;
var time = 0;
var nextPush = 5;
var deltaPush = 5;
var direction = _RIGHT_;
var cursors;
var points = 0;

function snakeBody(x, y) {
    return {
        x: x,
        y: y,
        next: null,
        update: function (newX, newY) {
            if (this.next != null) {
                this.next.update(this.x, this.y);
            }
            this.x = newX;
            this.y = newY;
        },
        print: function () {
            var string = "(" + this.x + ", " + this.y + ")";
            if (this.next != null) {
                string += ", " + this.next.print()
            }
            return string;
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
            var cell = game.add.sprite(j * edge, i * edge, 'tiles', _WHITE_);
            if (i == 0 || j == 0 || i == 29 || j == 39) {
                cell.frame = _BLACK_;
            }
            row[j] = cell;
        }
        grid[i] = row;
    }
    grid[10][10].frame = _BLACK_;
    grid[10][9].frame = _BLACK_;
    grid[10][8].frame = _BLACK_;
    addNextTarget();
}

function addNextTarget() {
    var posX, posY;
    do {
        posX = Math.floor(Math.random() * columns);
        posY = Math.floor(Math.random() * rows);
    } while (grid[posY][posX].frame == 0);
    grid[posY][posX].frame = _RED_;
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.load.spritesheet('tiles', 'assets/spritesheet.png', 20, 20);
}

function create() {
    initGrid();
    cursors = game.input.keyboard.createCursorKeys();
    game.time.events.loop(20, updateGrid, this);
}

function update() {
    if (cursors.left.isDown && direction != _RIGHT_) {
        direction = _LEFT_;
    } else if (cursors.up.isDown && direction != _DOWN_) {
        direction = _UP_;
    } else if (cursors.right.isDown && direction != _LEFT_) {
        direction = _RIGHT_;
    } else if (cursors.down.isDown && direction != _UP_) {
        direction = _DOWN_;
    }
}

function updateGrid() {
    if (!playing) return;
    time++;
    if (time % speed == 0) {
        // update grid from tail
        grid[tail.y][tail.x].frame = _WHITE_;
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
        if (grid[y][x].frame == _BLACK_) {
            document.getElementById('lose').style.display = 'block';
            playing = false;
        } else if (grid[y][x].frame == _RED_) {
            var head = snakeBody(x, y);
            head.next = snake;
            snake = head;
            grid[y][x].frame = _BLACK_;
            addNextTarget();
            points++;
            if (points >= nextPush) {
                if (speed > 1) {
                    speed--;
                }
                nextPush *= 2;
            }
            document.getElementById('points').innerHTML = points;
        } else {
            snake.update(x, y);
            // update grid with new head
            grid[snake.y][snake.x].frame = _BLACK_;
        }
    }
}
