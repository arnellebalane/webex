var icon = document.querySelector('.indicator');
var text = document.querySelector('h1');
var processing = false;

icon.addEventListener('click', function() {
    if (this.classList.contains('idle')) {
        start_recognition();
    }
});

function start_recognition() {
    var recognizer = new webkitSpeechRecognition();

    recognizer.onstart = onstart;
    recognizer.onend = onend;
    recognizer.onspeechstart = onspeechstart;
    recognizer.onspeechend = onspeechend;
    recognizer.onnomatch = onnomatch;
    recognizer.onerror = onerror;
    recognizer.onresult = onresult;

    recognizer.start();
}

function onstart(e) {
    icon.classList.remove('idle');
    icon.classList.add('recording');
    log('You may say something now.');
}

function onend(e) {
    icon.classList.remove('recording');
    icon.classList.remove('processing');
    icon.classList.add('idle');
    if (processing) {
        processing = false;
        onnomatch();
    }
}

function onspeechstart(e) {
    log('Speech detected. Capturing...');
}

function onspeechend(e) {
    icon.classList.remove('recording');
    icon.classList.add('processing');
    processing = true;
    log('Speech captured. Processing...');
}

function onnomatch(e) {
    onend();
    log('No match found. Please speak properly.');
}

function onerror(e) {
    if (e.error === 'not-allowed') {
        onend();
        log('Please allow the page to use the microphone.');
    } else {
        onnomatch();
    }
}

function onresult(e) {
    if (e.results.length) {
        var result = e.results[0][0];
        processing = false;
        onend();
        log('"' + result.transcript + '"');
    } else {
        onnomatch();
    }
}

function log(message) {
    text.textContent = message;
}