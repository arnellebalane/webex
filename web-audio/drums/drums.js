function KickDrum() {
    this.context = new AudioContext();
    this.element = document.querySelector('.kick');
}

KickDrum.prototype.setup = function() {
    this.oscillator = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.oscillator.connect(this.gain);
    this.gain.connect(this.context.destination);
};

KickDrum.prototype.trigger = function() {
    this.setup();
    var time = this.context.currentTime;

    this.oscillator.frequency.setValueAtTime(150, time);
    this.gain.gain.setValueAtTime(1, time);

    this.oscillator.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    this.oscillator.start(time);
    this.oscillator.stop(time + 0.5);

    this.visualize();
};

KickDrum.prototype.visualize = function() {
    this.element.classList.add('triggered');
    setTimeout(function() {
        this.element.classList.remove('triggered');
    }.bind(this), 120);
};



function SnareDrum() {
    this.context = new AudioContext();
    this.element = document.querySelector('.snare');
}

SnareDrum.prototype.generate_noise = function() {
    var buffer_size = this.context.sampleRate;
    var sample_rate = this.context.sampleRate;
    var buffer = this.context.createBuffer(1, buffer_size, sample_rate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < buffer_size; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
};

SnareDrum.prototype.setup = function() {
    this.oscillator = this.context.createOscillator();
    this.oscillator.type = 'triangle';
    this.gain = this.context.createGain();
    this.oscillator.connect(this.gain);
    this.gain.connect(this.context.destination);

    this.noise = this.context.createBufferSource();
    this.noise.buffer = this.generate_noise();
    this.noise_filter = this.context.createBiquadFilter();
    this.noise_filter.type = 'highpass';
    this.noise_filter.frequency.value = 1000;
    this.noise_gain = this.context.createGain();
    this.noise.connect(this.noise_filter);
    this.noise_filter.connect(this.noise_gain);
    this.noise_gain.connect(this.context.destination);
};

SnareDrum.prototype.trigger = function() {
    this.setup();
    var time = this.context.currentTime;

    this.oscillator.frequency.setValueAtTime(100, time);
    this.noise_gain.gain.setValueAtTime(0.3, time);
    this.gain.gain.setValueAtTime(0.3, time);

    this.noise_gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    this.oscillator.start(time);
    this.noise.start(time);
    this.oscillator.stop(time + 0.2);
    this.noise.stop(time + 0.2);

    this.visualize();
};

SnareDrum.prototype.visualize = function() {
    this.element.classList.add('triggered');
    setTimeout(function() {
        this.element.classList.remove('triggered');
    }.bind(this), 120);
};



var kick = new KickDrum();
var snare = new SnareDrum();

document.addEventListener('keydown', function(e) {
    if (e.keyCode === 70) {
        kick.trigger();
    } else if (e.keyCode === 74) {
        snare.trigger();
    }
});
