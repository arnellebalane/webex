var context = new AudioContext();
var processor = context.createScriptProcessor(1024);
var analyser = context.createAnalyser();
var data, audio;


processor.connect(context.destination);
analyser.connect(processor);
data = new Uint8Array(analyser.frequencyBinCount);


function Sound() {
    this.element = undefined;

    this.play = function() {
        var sound = context.createMediaElementSource(this.element);
        this.element.onended = function() {
            sound.disconnect();
            sound = null;
            processor.onaudioprocess = function() {};
        };
        sound.connect(analyser);
        sound.connect(context.destination);

        processor.onaudioprocess = function() {
            analyser.getByteTimeDomainData(data);
        };
        this.element.play();
    };
}


function loadAudioElement(url) {
    return new Promise(function(resolve, reject) {
        var audio = new Audio();
        audio.addEventListener('canplay', function() {
            resolve(audio);
        });
        audio.addEventListener('error', reject);
        audio.src = url;
    });
}


loadAudioElement('./audios/lost stars.mp3').then(function(element) {
    audio = new Sound();
    audio.element = element;
    audio.play();
}, function(element) {
    throw element.error;
});





// VISUAL COMPONENT
var NUM_OF_SLICES = 300;
var STEP = ~~(data.length / NUM_OF_SLICES);
var NO_SIGNAL = 128;

var element = document.querySelector('div');
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
document.body.replaceChild(container, element);


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