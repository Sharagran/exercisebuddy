import React from 'react'
import Sketch from "react-p5";

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

class Skeleton {
    constructor() {
        this.joints = [];
        this.setupSkeleton();
    }

    setupSkeleton() {
        // legs
        this.joints.push(new Joint(-10, 0, 50, 0));
        this.joints.push(new Joint(10, 0, 50, 0));

        this.joints.push(new Joint(-10, -50, 50, 0));
        this.joints.push(new Joint(10, -50, 50, 0));

        // torso
        this.joints.push(new Joint(-10, -100, 20, 90));
        this.joints.push(new Joint(10, -100, 100, 10));
        this.joints.push(new Joint(10, -100, 100, 10));

    }

    draw(p5) {
        this.joints.forEach(joint => {
            joint.draw(p5);
        });
    }
}

class Joint {
    constructor(x, y, length, rotation) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.rotation = degToRad(rotation);
        this.startPoint = null;
    }

    draw(p5) {
        p5.push();
        p5.fill(255);
        p5.stroke(255);

        p5.translate(this.x, this.y);
        p5.strokeWeight(4);
        p5.rotate(this.rotation);
        p5.line(0, 0, 0, -this.length / 2);
        p5.line(0, -this.length / 2, 0, -this.length);
        p5.strokeWeight(16);
        this.startPoint = p5.point(0, 0);
        p5.pop();
    }
}

export default function Model2() {

    var x = 100;
    var y = 100;

    var skeleton = new Skeleton();
    function setup(p5, canvasParentRef) {
        p5.createCanvas(700, 700).parent(canvasParentRef);
    }

    function draw(p5) {
        p5.background(0);
        p5.translate(p5.width / 2, p5.height / 2);
        if (skeleton) {
            skeleton.draw(p5);
        }

    }

    function mousePressed(p5) {
        if (p5.mouseX > x && p5.mouseX < x + 50 && p5.mouseY > y && p5.mouseY < y + 50) {
            p5.fill(255, 0, 0);
        }
    }

    function mouseDragged(p5) {
        if (p5.mouseX > x && p5.mouseX < x + 50 && p5.mouseY > y && p5.mouseY < y + 50) {
            x = p5.mouseX - 25;
            y = p5.mouseY - 25;
        }
    }

    return <Sketch setup={setup} draw={draw} mousePressed={mousePressed} mouseDragged={mouseDragged} />;
}
