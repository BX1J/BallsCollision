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
        this.maxSpeed = 10; // Maximum speed limit to prevent runaway speed
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

        // Calculate distance from center
        const distFromCenter = Math.sqrt((this.x - centerX) ** 2 + (this.y - centerY) ** 2);

        // Check if ball is hitting or slightly out of the boundary of the large circle
        if (distFromCenter + this.radius >= radius) {
            // Reflect the velocity to make it bounce
            const angle = Math.atan2(this.y - centerY, this.x - centerX);

            // Reverse the velocity and boost speed more aggressively
            this.velocityX = -Math.cos(angle) * Math.abs(this.velocityX) * 1.2;
            this.velocityY = -Math.sin(angle) * Math.abs(this.velocityY) * 1.2;

            // Correct the position to stay inside the circle after bouncing
            const overlap = distFromCenter + this.radius - radius;
            this.x -= overlap * Math.cos(angle);
            this.y -= overlap * Math.sin(angle);

            // Limit the velocity to prevent the ball from moving too fast
            const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
            if (speed > this.maxSpeed) {
                const reductionFactor = this.maxSpeed / speed;
                this.velocityX *= reductionFactor;
                this.velocityY *= reductionFactor;
            }
        }
    }

    // Method to check collision with another ball and handle it
    collide(other) {
        const distance = Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);

        // Check if balls are colliding
        if (distance < this.radius + other.radius) {
            // Growth by 1px in radius (2px in diameter) upon collision
            const growthAmount = 1;

            // Calculate the new radius after growth
            const newRadius = this.radius + growthAmount;
            const otherNewRadius = other.radius + growthAmount;

            // Check if new radius would cause balls to go out of bounds
            const distFromCenter = Math.sqrt((this.x - centerX) ** 2 + (this.y - centerY) ** 2);
            const otherDistFromCenter = Math.sqrt((other.x - centerX) ** 2 + (other.y - centerY) ** 2);

            if (distFromCenter + newRadius <= radius) {
                this.radius = newRadius; // Only grow if within bounds
            }
            if (otherDistFromCenter + otherNewRadius <= radius) {
                other.radius = otherNewRadius; // Only grow if within bounds
            }

            // Handle realistic collision by adjusting velocities
            const normalX = (other.x - this.x) / distance;
            const normalY = (other.y - this.y) / distance;

            // Calculate relative velocity
            const relativeVelocityX = this.velocityX - other.velocityX;
            const relativeVelocityY = this.velocityY - other.velocityY;

            // Calculate velocity along the normal direction
            const dotProduct = relativeVelocityX * normalX + relativeVelocityY * normalY;

            // If balls are moving toward each other, reflect velocities
            if (dotProduct > 0) {
                const bounce = 1; // Elastic collision factor (1 for perfect bounce)
                const impulse = (2 * dotProduct) / (this.radius + other.radius);

                // Update velocities based on the impulse
                this.velocityX -= impulse * other.radius * normalX * bounce;
                this.velocityY -= impulse * other.radius * normalY * bounce;
                other.velocityX += impulse * this.radius * normalX * bounce;
                other.velocityY += impulse * this.radius * normalY * bounce;

                // Speed boost after collision
                const speedBoost = 1.1; // Increase speed by 10%
                this.velocityX *= speedBoost;
                this.velocityY *= speedBoost;
                other.velocityX *= speedBoost;
                other.velocityY *= speedBoost;

                // Limit speeds of both balls after collision
                const thisSpeed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
                if (thisSpeed > this.maxSpeed) {
                    const reductionFactor = this.maxSpeed / thisSpeed;
                    this.velocityX *= reductionFactor;
                    this.velocityY *= reductionFactor;
                }

                const otherSpeed = Math.sqrt(other.velocityX ** 2 + other.velocityY ** 2);
                if (otherSpeed > other.maxSpeed) {
                    const reductionFactor = other.maxSpeed / otherSpeed;
                    other.velocityX *= reductionFactor;
                    other.velocityY *= reductionFactor;
                }
            }
        }
    }
}

// Create the balls with random velocities
const balls = [
    new Ball(centerX - 100, centerY, 30, 'chocolate', 6, 6),
    new Ball(centerX + 100, centerY, 30, 'crimson', -5, 5),
    new Ball(centerX, centerY - 100, 30, 'skyblue', 4, -4)
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
