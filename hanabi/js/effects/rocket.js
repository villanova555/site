class Rocket {
    constructor(type) {
        this.type = type;
        this.x = random(width * 0.2, width * 0.8);
        this.y = height;
        this.targetY = random(height * 0.15, height * 0.45);
        this.velY = -random(10, 14);
        this.hu = random(360);
        this.completed = false;
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playPon();
            SoundManager.playHyu();
        }
    }

    update() {
        this.y += this.velY;
        this.velY += 0.2;

        if (this.y <= this.targetY || this.velY >= 0) {
            this.explode();
            this.completed = true;
        }
    }

    show() {
        if (!this.completed) {
            stroke(this.hu, 50, 100);
            strokeWeight(4);
            point(this.x, this.y);
        }
    }

    explode() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playDon();
        }
        let count = (this.type === 7 && typeof customConfig !== 'undefined') ? customConfig.count : 120;
        let trailDecay = (this.type === 7 && typeof customConfig !== 'undefined') ? customConfig.trail : 0.95;

        for (let i = 0; i < count; i++) {
            particles.push(new Bloom(this.x, this.y, this.hu, this.type, trailDecay));
        }
    }
}