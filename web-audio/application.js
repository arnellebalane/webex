var context = new AudioContext();
var processor = context.createScriptProcessor(1024);
var analyser = context.createAnalyser();
var playlist = [
    {
        title: 'A Step You Can\'t Take Back',
        url: './audios/a step you cant take back.mp3',
        element: null
    },
    {
        title: 'Coming Up Roses',
        url: './audios/coming up roses.mp3',
        element: null
    },
    {
        title: 'Lost Stars',
        url: './audios/lost stars.mp3',
        element: null
    },
    {
        title: 'Tell Me If You Wanna Go Home',
        url: './audios/tell me if you wanna go home.mp3',
        element: null
    }
];


processor.connect(context.destination);
analyser.connect(processor);
var data = new Uint8Array(analyser.frequencyBinCount);


var $overlay = $('.overlay');
var $playlist = $('.playlist');
var $player = $('.player-container');


var player = {
    current: null,
    initialize: function() {
        console.info('Loading audio files...');
        var count = playlist.length;
        for (var i = 0; i < playlist.length; i++) {
            (function(i) {
                var item = playlist[i];
                player.load(item.url).then(function(element) {
                    console.log(item.title + ' loaded.');
                    item.element = new Sound(element);
                    player.add({ index: i, title: item.title });
                    if (!--count) {
                        player.activate();
                    }
                }, function(element) {
                    throw element.error;
                });
            })(i);
        }
    },
    activate: function() {
        $overlay.addClass('removed');
        player.play(0);
    },
    load: function(url) {
        return new Promise(function(resolve, reject) {
            var audio = new Audio();
            audio.addEventListener('canplay', function() {
                resolve(audio);
            });
            audio.addEventListener('error', reject);
            audio.src = url;
        });
    },
    add: function(item) {
        item = $('<li data-index="' + item.index + '">' + item.title + '</li>');
        $playlist.append(item);
    },
    play: function(index) {
        console.info('Playing "' + playlist[index].title + '"');
        if (this.current) {
            this.current.stop();
        }
        this.current = playlist[index].element;
        this.current.play();

        $playlist.find('li').removeClass('current');
        $playlist.find('[data-index="' + index + '"]').addClass('current');
    },
    pause: function() {
        this.current.pause();
    }
};
player.initialize();


function Sound(element) {
    var sound = context.createMediaElementSource(element);

    sound.connect(analyser);
    sound.connect(context.destination);

    processor.onaudioprocess = function() {
        analyser.getByteTimeDomainData(data);
    };

    this.play = function() {
        element.play();
    };

    this.pause = function() {
        element.pause();
    };

    this.stop = function() {
        element.currentTime = 0;
        element.pause();
    };
}





// VISUALIZER COMPONENT
// Used vanilla JS for faster performance, maybe.
var NUM_OF_SLICES = 300;
var STEP = ~~(data.length / NUM_OF_SLICES);
var NO_SIGNAL = 128;

var element = document.querySelector('.element');
var slices = [];
var rect = element.getBoundingClientRect();
var width = rect.width;
var height = rect.height;
var widthPerSlice = width / NUM_OF_SLICES;

var container = document.createElement('div');
container.className = 'container';
container.style.width = width + 'px';
container.style.height = height + 'px';


for (var i = 0; i < NUM_OF_SLICES; i++) {
    var offset = i * widthPerSlice;

    var mask = document.createElement('div');
    mask.className = 'mask';
    mask.style.width = widthPerSlice + 'px';
    mask.style.height = height + 'px';
    mask.style.transform = 'matrix(1, 0, 0, 1, ' + offset + ', 0)';

    var clone = document.createElement('div');
    clone.className = 'clone';
    clone.style.width = width + 'px';
    clone.style.height = height + 'px';
    clone.style.transform = 'translate3d(' + -offset + 'px, 0, 0)';

    mask.appendChild(clone);
    container.appendChild(mask);

    slices.push({ offset: offset, element: mask });
}
element.parentNode.replaceChild(container, element);


function render() {
    requestAnimationFrame(render);

    for (var i = 0, n = 0; i < NUM_OF_SLICES; i++, n += STEP) {
        var slice = slices[i];
        var element = slice.element;
        var offset = slice.offset;
        var value = Math.abs(data[n]) / NO_SIGNAL;

        element.style.transform = 'matrix(1, 0, 0, ' + value + ', ' + offset + ', 0)';
    }
}
render();





// INTERFACE INTERACTIONS
$('.playlist-toggle').on('click', function() {
    $(this).toggleClass('open');
    $playlist.toggleClass('open');
    $player.toggleClass('shrinked');
});


$playlist.on('click', 'li', function() {
    var index = +$(this).data('index');
    player.play(index);
});