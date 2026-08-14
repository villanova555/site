class Bloom {
    constructor(x, y, hu, type, trailDecay) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.hu = (type === 2) ? random(360) : hu;
        if (type === 5) this.hu = 45;
        if (type === 6) this.hu = random([30, 60, 200]);

        let angle = random(TWO_PI);
        let speed = random(2, 10);
        if (type === 3) speed = random(1, 5);
        if (type === 4) speed = random(4, 12);

        this.vel = p5.Vector.fromAngle(angle).mult(speed);
        this.acc = createVector(0, 0.12);
        this.lifespan = 255;
        this.decay = random(1.5, 3.0);
        this.trailDecay = trailDecay;
        this.history = [];
    }

    update() {
        this.history.push(createVector(this.x, this.y));
        if (this.history.length > 12) {
            this.history.shift();
        }

        this.vel.add(this.acc);

        if (this.type === 4) {
            this.vel.add(createVector(random(-1.5, 1.5), random(-1.5, 1.5)));
        }
        if (this.type === 3) {
            this.vel.y += 0.04;
        }

        this.vel.mult(this.trailDecay);
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.lifespan -= this.decay;
    }

    show() {
        if (this.type === 2) {
            noStroke();
            fill(this.hu, 80, 100, this.lifespan / 255);
            ellipse(this.x, this.y, 4, 4);
        } else {
            for (let i = 0; i < this.history.length; i++) {
                let p = this.history[i];
                let alpha = (i / this.history.length) * (this.lifespan / 255);
                stroke(this.hu, 70, 100, alpha);
                strokeWeight(this.type === 5 ? 3 : 2);
                point(p.x, p.y);
            }
        }
    }

    completed() {
        return this.lifespan < 0;
    }
}