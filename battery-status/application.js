var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

battery.onchargingchange = update_battery;
battery.onchargingtimechange = update_battery;
battery.ondischargingtimechange = update_battery;
battery.onlevelchange = update_battery;

update_battery();
function update_battery(e) {
    $('.battery-level').style.height = battery.level * 100 + '%';
    $('.charge-time span').textContent = format_time(battery.chargingTime);
    $('.discharge-time span').textContent = format_time(battery.dischargingTime);
    var levels = $$('.battery p');
    for (var i = 0; i < levels.length; i++) {
        levels[i].textContent = ~~(battery.level * 100) + '%';
    }

    if (battery.charging) {
        $('main').classList.add('charging');
        $('.state').textContent = battery.level ===1 ? 'battery full' : 'charging';
        if (battery.level >= 0.2) {
            $('main').classList.remove('almost-empty');
        }
    } else {
        $('main').classList.remove('charging');
        $('.state').textContent = 'not charging';
        if (battery.level < 0.2) {
            $('main').classList.add('almost-empty');
            $('.state').textContent = 'almost empty';
        }
    }
}

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function format_time(time) {
    var hours = ~~(time / 3600);
    var minutes = ~~(time / 60) % 60;
    var seconds = time % 60;
    time = hours < 10 ? '0' + hours : hours;
    time += ':' + (minutes < 10 ? '0' + minutes : minutes);
    time += ':' + (seconds < 10 ? '0' + seconds : seconds);
    return time;
}