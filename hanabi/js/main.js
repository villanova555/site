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
    fireworks.push(new Rocket(type));
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    let btn = document.getElementById('sound-btn');
    btn.innerText = soundEnabled ? "効果音: ON" : "効果音: OFF";
    btn.classList.toggle('active', soundEnabled);
}

function openSettings() {
    document.getElementById('settings-modal').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
}

function updateSettings() {
    distance = document.getElementById('set-distance').value;
    masterVol = document.getElementById('set-volume').value;
}

function saveSettings() {
    customConfig.count = parseInt(document.getElementById('set-custom-count').value);
    customConfig.trail = parseFloat(document.getElementById('set-custom-trail').value);
    closeSettings();
}

function openHELP() {
    document.getElementById('help-modal').style.display = 'block';
}

function closeHELP() {
    document.getElementById('help-modal').style.display = 'none';
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