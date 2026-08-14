class StarRain {
    constructor() {
        this.x = random(width);
        this.y = random(height * 0.5);
        this.len = random(20, 80);
        this.speed = random(4, 8);
        this.alpha = random(100, 200);
    }

    update() {
        this.x -= this.speed * 0.5;
        this.y += this.speed;
        if (this.y > height * 0.6) {
            this.reset();
        }
    }

    show() {
        stroke(200, 50, 100, this.alpha / 255);
        strokeWeight(1);
        line(this.x, this.y, this.x - this.len * 0.5, this.y - this.len);
    }

    reset() {
        this.x = random(width);
        this.y = random(-50, 0);
        this.len = random(20, 80);
        this.speed = random(4, 8);
    }
}