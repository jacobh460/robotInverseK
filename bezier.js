import Point from "./point.js";
import Vector2 from "./vector2.js";


export default class Spline {
    /**
     * 
     * @param {String} name 
     */
    constructor(name) {
        this.name = name;

        /** @type {[Point]} */
        this.points = [];
    }


    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Number} step resolution
     */
    draw(ctx, step = 0.05) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#49b74d";

        if (this.points.length > 1) {
            const coefficients = [1];
            for (let i = 0; i < this.points.length - 1; ++i) coefficients.push(coefficients[i] * (this.points.length - 1 - i) / (i + 1));

            let last = this.points[0];
            ctx.beginPath();
            ctx.moveTo(last.position.x, last.position.y);
            for (let t = 0; t <= 1; t += step) {
                let pt = new Vector2(0, 0);

                for (let i = 0; i < this.points.length; ++i) {
                    pt = pt.add(
                        this.points[i].position.mult(
                            coefficients[i] * ((1 - t) ** (this.points.length - i - 1)) * (t ** i)
                        )
                    );
                }

                ctx.lineTo(pt.x, pt.y);
                last = pt;
            }
            ctx.stroke();
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }


}