var recognizer = new webkitSpeechRecognition();

recognizer.onstart = function(e) {
    console.log('Starting Speech Recognition, please say something...');
};

recognizer.onend = function(e) {
    console.log('Speech Recognition session has ended...');
};

recognizer.onspeechstart = function(e) {
    console.log('Speech detected. Capturing...');
};

recognizer.onspeechend = function(e) {
    console.log('Speech captured. Processing...');
};

recognizer.onnomatch = function(e) {
    console.error('No match found. Please speak properly.');
};

recognizer.onresult = function(e) {
    for (var i = 0; i < e.results.length; i++) {
        var result = e.results[i];
        for (var j = 0; j < result.length; j++) {
            var alternative = result[j];
            console.info(alternative.transcript + ' (' + alternative.confidence + ')');
        }
    }
};
recognizer.start();