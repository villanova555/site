import { Rocket } from './effects/rocket.js';
import { Bloom } from './effects/bloom.js';
import { StarRain } from './effects/starRain.js';
import { SoundManager, customConfig, setDistance, setMasterVol, getDistance, getMasterVol } from './engine.js';

let fireworks = [];
let particles = [];
let ambientStars = [];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight - 70);
    canvas.parent('canvas-container');
    colorMode(HSB, 360, 100, 100, 1);

    for (let i = 0; i < 5; i++) {
        ambientStars.push(new StarRain());
    }

    initEventListeners();
}

function draw() {
    background(220, 80, 12);

    noStroke();
    fill(215, 60, 20);
    beginShape();
    vertex(0, height);
    for (let x = 0; x <= width; x += 50) {
        let y = height - 100 + sin(x * 0.003 + 1) * 30 + cos(x * 0.008) * 15;
        vertex(x, y);
    }
    vertex(width, height);
    endShape(CLOSE);

    fill(215, 50, 15);
    beginShape();
    vertex(0, height);
    for (let x = 0; x <= width; x += 40) {
        let y = height - 60 + cos(x * 0.005) * 20;
        vertex(x, y);
    }
    vertex(width, height);
    endShape(CLOSE);

    for (let star of ambientStars) {
        star.update();
        star.show();
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].show();
        if (fireworks[i].completed) {
            fireworks.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
        if (particles[i].completed()) {
            particles.splice(i, 1);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 70);
}

function launchFirework(type) {
    fireworks.push(new Rocket(type, particles));
}

function initEventListeners() {
    const btn1 = document.getElementById('btn-fire-1');
    const btn2 = document.getElementById('btn-fire-2');
    const btn3 = document.getElementById('btn-fire-3');
    const btn4 = document.getElementById('btn-fire-4');
    const btn5 = document.getElementById('btn-fire-5');
    const btn6 = document.getElementById('btn-fire-6');
    const btn7 = document.getElementById('btn-fire-7');
    const soundBtn = document.getElementById('sound-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const helpBtn = document.getElementById('help-btn');
    const microbitBtn = document.getElementById('microbit-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const closeHelpBtn = document.getElementById('close-help-btn');

    if (btn1) btn1.addEventListener('click', () => launchFirework(1));
    if (btn2) btn2.addEventListener('click', () => launchFirework(2));
    if (btn3) btn3.addEventListener('click', () => launchFirework(3));
    if (btn4) btn4.addEventListener('click', () => launchFirework(4));
    if (btn5) btn5.addEventListener('click', () => launchFirework(5));
    if (btn6) btn6.addEventListener('click', () => launchFirework(6));
    if (btn7) btn7.addEventListener('click', () => launchFirework(7));

    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            let enabled = SoundManager.toggleSound();
            soundBtn.innerText = enabled ? "効果音: ON" : "効果音: OFF";
            soundBtn.classList.toggle('active', enabled);
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'block';
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'none';
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            let distInput = document.getElementById('set-distance');
            let volInput = document.getElementById('set-volume');
            let countInput = document.getElementById('set-custom-count');
            let trailInput = document.getElementById('set-custom-trail');

            if (distInput) setDistance(parseFloat(distInput.value));
            if (volInput) setMasterVol(parseFloat(volInput.value));
            if (countInput) customConfig.count = parseInt(countInput.value);
            if (trailInput) customConfig.trail = parseFloat(trailInput.value);

            document.getElementById('settings-modal').style.display = 'none';
        });
    }

    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            document.getElementById('help-modal').style.display = 'block';
        });
    }

    if (closeHelpBtn) {
        closeHelpBtn.addEventListener('click', () => {
            document.getElementById('help-modal').style.display = 'none';
        });
    }

    if (microbitBtn) {
        microbitBtn.addEventListener('click', connectMicrobit);
    }
}

async function connectMicrobit() {
    if (!("serial" in navigator)) {
        alert("お使いのブラウザはWeb Serial APIに対応していません。");
        return;
    }
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        alert("micro:bitと接続しました。");
        
        while (port.readable) {
            const reader = port.readable.getReader();
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    let text = new TextDecoder().decode(value);
                    if (text.includes("A")) launchFirework(1);
                    if (text.includes("B")) launchFirework(2);
                    if (text.includes("AB")) launchFirework(5);
                }
            } catch (error) {
                console.error(error);
            } finally {
                reader.releaseLock();
            }
        }
    } catch (error) {
        console.log("接続がキャンセルされたか、エラーが発生しました。", error);
    }
}

window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;

```
