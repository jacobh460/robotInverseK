import Vector2 from "./modules/vector2.js";
import Point from "./modules/point.js";
import Utils from "./modules/utils.js";
import {Robot, Configuration} from "./modules/robot.js";
import InputManager from "./modules/inputManager.js";
import CurveManager from "./modules/curveManager.js";
import Spline from "./modules/Spline.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("mainCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const left = document.getElementById("left");

const timeControl = document.getElementById("timeControl");

const centimeter = 10;

/** @type {Robot} */
const robot = new Robot();

/** @type {InputManager} */
const inputManager = new InputManager(ctx);

/** @type {CurveManager} */
const curveManager = new CurveManager();
curveManager.createCurve();

//reset canvas to prepare for drawing new frame
function clear() {
    const transform = ctx.getTransform();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(transform);
}


//resize canvas so it fills its container
function resizeCanvas() {
    const old = ctx.getTransform();
    canvas.width = left.clientWidth;
    canvas.height = left.clientHeight;
    ctx.setTransform(old);
}


let log;
let logReset;
{
    const logOffset = 12;
    let logY = logOffset;
    log = function(data){
        ctx.fillText(data, 0, logY);
        logY += logOffset;
    }

    logReset = () => logY = logOffset;
}

function drawGrid(){
    const transform = ctx.getTransform();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = "#55575A";
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    const width = centimeter * transform.a;

    for (let i = transform.e % width; i <= canvas.width; i += width){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }

    for (let i = transform.f % width; i <= canvas.height; i += width){
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }

    ctx.stroke();

    ctx.setTransform(transform);
}

//make up direction be positive y
ctx.setTransform(1, 0, 0, -1, 0, 0);



let lastTime = Date.now();
function loop() {
    const newTime = Date.now();
    const deltaTime = (newTime - lastTime)/1000.0;
    lastTime = newTime;

    resizeCanvas();
    clear();
    logReset();


    inputManager.update();
    curveManager.handleInput(inputManager.mouseWorldPos, inputManager.mouseLeftDown);
    curveManager.currentCurve.calc();

    drawGrid();

    let t = 0;
    if (curveManager.currentCurve.points.length > 0)
    {
        t = timeControl.value * curveManager.currentCurve.points[curveManager.currentCurve.points.length - 1].t;
        robot.configuration = curveManager.currentCurve.inverseKinematics(robot, t);
    }
    curveManager.draw(ctx, 0.05);
    robot.draw(ctx);

    {
        const oldTransform = ctx.getTransform();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "white";
        ctx.font = "12px consolas";
        log(`Mouse Screen Position: ${inputManager.mousePos.x}, ${inputManager.mousePos.y}`);
        log(`Mouse World Position: ${inputManager.mouseWorldPos.x}, ${inputManager.mouseWorldPos.y}`);
        log(`${oldTransform.a}, ${oldTransform.b}, ${oldTransform.c}, ${oldTransform.d}, ${oldTransform.e}, ${oldTransform.f}`)
        log(`FPS: ${Math.round(1/deltaTime)}`);
        log(`t: ${t}`);

        ctx.setTransform(oldTransform);
    }

    window.requestAnimationFrame(loop);
}
loop();