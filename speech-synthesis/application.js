var input = document.querySelector('input');

input.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        var text = this.value;
        var speech = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(speech);
        this.value = '';
    }
});