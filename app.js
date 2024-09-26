// Get access to the canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the 2D drawing context
const ctx = canvas.getContext('2d');

// Draw the big boundary circle
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 300;

ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
ctx.strokeStyle = 'white';
ctx.stroke();

class Ball {
    constructor(x, y, radius, color, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    // Method to draw the ball
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Method to update ball position and handle collision with boundary
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Add gravity
        this.velocityY += 0.1;

        // Calculate distance from center
        const distFromCenter = Math.sqrt((this.x - centerX) ** 2 + (this.y - centerY) ** 2);

        // Check if ball is hitting the boundary of the large circle
        if (distFromCenter + this.radius >= radius) {
            // Reflect the velocity to make it bounce
            const angle = Math.atan2(this.y - centerY, this.x - centerX);

            // Reverse velocities
            this.velocityX = -Math.cos(angle) * Math.abs(this.velocityX);
            this.velocityY = -Math.sin(angle) * Math.abs(this.velocityY);
        }
    }

    // Method to check collision with another ball
    collide(other) {
        const distance = Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
        if (distance < this.radius + other.radius) {
            // Increase radii
            this.radius += 1;
            other.radius += 1;

            // Update velocities
            const tempX = this.velocityX;
            const tempY = this.velocityY;
            this.velocityX = other.velocityX;
            this.velocityY = other.velocityY;
            other.velocityX = tempX;
            other.velocityY = tempY;
        }
    }
}

// Create an array of balls with random velocities
const balls = [
    new Ball(centerX - 100, centerY, 30, 'red', 4, 4),
    new Ball(centerX + 100, centerY, 30, 'blue', -4, 3),
    new Ball(centerX, centerY - 100, 30, 'green', 2, -3.6)
];

// Function to animate the movement
function animate() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the boundary circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.stroke();

    // Update and draw all balls
    balls.forEach(ball => {
        ball.update();
        ball.draw(ctx);
    });

    // Check for collisions between balls
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            balls[i].collide(balls[j]);
        }
    }

    // Repeat animation
    requestAnimationFrame(animate);
}

// Start the animation
animate();