var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var game = {
    pointer: null,
    trail: [],
    initialize: function() {
        game.pointer = new Pointer(canvas.width / 2, canvas.height / 2, 10);
        game.play();
    },
    play: function() {
        game.erase();
        game.draw();
        game.update();
        window.requestAnimationFrame(game.play);
    },
    erase: function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    },
    draw: function() {
        game.pointer.draw();
    },
    update: function() {

    }
};
game.initialize();

function Pointer(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius || ~~(Math.random() * 20) + 10;
    this.color = '#' + (~~(Math.random() * (1 << 24))).toString(16);
    this.velocity = 0;

    this.update = function() {

    };
    this.draw = function() {
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
    };
}