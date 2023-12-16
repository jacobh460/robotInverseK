import Vector2 from "./vector2.js";


//represents a user-selectable and movable point
export default class Point{

    /** @param {Number} x  */
    /** @param {Number} y  */
    constructor(x, y, radius=3, color="rgba(52, 128, 255, .75)"){
        this.position = new Vector2(x, y);
        this.hidden = false;
        this.radius = radius;
        this.rad_sq = this.radius**2;
        this.color = color;
    }

    /** @param {CanvasRenderingContext2D} context  */
    draw(context){
        if (this.hidden) return;
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }


    /** @param {Vector2} position */
    testInside(other){
        if (this.hidden) return;
        return this.position.dist_nosqrt(other) < this.rad_sq;
    }
}