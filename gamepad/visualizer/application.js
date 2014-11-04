var ticking = false;
var gamepad = null;
var timestamp = null;

var visualizer = {
    update_button: function(button, index) {
        var $button = $('.button[data-index="' + index + '"]');
        if ($button) {
            if (button.pressed) {
                $button.classList.add('pressed');
            } else {
                $button.classList.remove('pressed');
            }
        }
    }
};

var gamepad_handler = {
    ticking: false,
    gamepads: [],
    timestamps: [],
    initialize: function() {
        window.addEventListener('gamepadconnected', gamepad_handler.gamepad_connected);
        window.addEventListener('gamepaddisconnected', gamepad_handler.gamepad_disconnected);
        gamepad_handler.start_polling();
    },
    gamepad_connected: function(e) {
        console.info('gamepad connected: ' + e.gamepad.id);
        gamepad_handler.gamepads.push(e.gamepad);
    },
    gamepad_disconnected: function(e) {
        console.info('gamepad disconnected: ' + e.gamepad.id);
        for (var i in gamepad_handler.gamepads) {
            if (gamepad_handler.gamepads[i].index === e.gamepad.index) {
                gamepad_handler.gamepads.splice(i, 1);
                break;
            }
        }
        if (!gamepad_handler.gamepads.length) {
            gamepad_handler.stop_polling();
        }
    },
    start_polling: function() {
        if (!gamepad_handler.ticking) {
            gamepad_handler.ticking = true;
            gamepad_handler.tick();
        }
    },
    stop_polling: function() {
        gamepad_handler.ticking = false;
    },
    tick: function() {
        gamepad_handler.poll_gamepads();
        gamepad_handler.schedule_next_tick();
    },
    schedule_next_tick: function() {
        if (gamepad_handler.ticking) {
            window.requestAnimationFrame(gamepad_handler.tick);
        }
    },
    poll_gamepads: function() {
        gamepad_handler.gamepads = [];
        var gamepads = navigator.getGamepads();
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i] !== undefined) {
                gamepad_handler.gamepads.push(gamepads[i]);
            }
        }
        for (var j in gamepad_handler.gamepads) {
            var gamepad = gamepad_handler.gamepads[j];
            if (!gamepad.timestamp || gamepad.timestamp != gamepad_handler.timestamps[j]) {
                gamepad_handler.timestamps[j] = gamepad.timestamp;
                gamepad_handler.update_gamepad(gamepad);
            }
        }
    },
    update_gamepad: function(gamepad) {
        for (var i in gamepad.buttons) {
            visualizer.update_button(gamepad.buttons[i], i);
        }
    }
};
gamepad_handler.initialize();

function $(selector) {
    return document.querySelector(selector);
}