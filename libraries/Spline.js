import Point from "./point.js";
import Vector2 from "./vector2.js";

class set_element{
    constructor(a, b, c, d, x){
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.x = x;
    }
}

export default class Spline {
    /**
     * 
     * @param {String} name 
     */
    constructor(name) {
        this.name = name;

        /** @type {[Point]} */
        this.points = [];

        /** @type {[set_element]} */
        this.set_x = [];
        /** @type {[set_element]} */
        this.set_y = [];
    }

    /**
     * 
     * @param {Number} i 
     * @param {Boolean} x 
     * @returns {Number}
     */
    #get_dependent(i, x){
        return x ? this.points[i].position.x : this.points[i].position.y;
    }

    // https://en.wikipedia.org/wiki/Spline_(mathematics)
    #spline_impl(x){
        if (this.points.length == 0) return [];
        const n = this.points.length - 1;
        const output_set = new Array(n);
        const a = new Array(n+1);
        const b = new Array(n);
        const d = new Array(n);
        const h = new Array(n);
        const alpha = new Array(n);
        const c = new Array(n+1);
        const l = new Array(n+1);
        const mu = new Array(n+1);
        const z = new Array(n+1);

        for (let i = 0; i <= n; ++i){
            a[i] = this.#get_dependent(i, x);
        }

        for (let i = 0; i < n; ++i){
            h[i] = this.points[i+1].t - this.points[i].t;
        }

        for (let i = 1; i < n; ++i){
            alpha[i] = 3.0 / h[i] * (a[i + 1] - a[i]) - 3.0 / h[i - 1] * (a[i] - a[i - 1]);
        }

        l[0] = 1;
        mu[0] = 0;
        z[0] = 0;

        for (let i = 1; i < n; ++i){
            l[i] = 2 * (this.points[i + 1].t - this.points[i - 1].t) - h[i - 1] * mu[i - 1];
            mu[i] = h[i] / l[i];
            z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
        }

        l[n] = 1;
        z[n] = 0;
        c[n] = 0;

        for (let j = n - 1; j >= 0; j--)
        {
            c[j] = z[j] - mu[j] * c[j + 1];
            b[j] = (a[j + 1] - a[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3.0;
            d[j] = (c[j + 1] - c[j]) / (3.0 * h[j]);
        }

        for (let i = 0; i < n; ++i){
            output_set[i] = new set_element(
                a[i], b[i], c[i], d[i], this.points[i].t
            );
        }

        return output_set;
    }

    calc(){
        this.set_x = this.#spline_impl(true);
        this.set_y = this.#spline_impl(false);
    }

    evaluate(t){
        let current_piece = 0;
        if (this.points.length == 0) return new Vector2(15, 115);
        if (this.points.length == 1) return this.points[0].position;
        if (this.set_x.length == 0) return this.points[this.points.length - 1].position;

        while (t > this.points[current_piece + 1].t) current_piece++;

        let x;
        {
            const f = this.set_x[current_piece];
            const d = (t - f.x);
            x = f.a + f.b * d + f.c * d ** 2 + f.d * d **3;
        }

        let y;
        {
            const f = this.set_y[current_piece];
            const d = (t - f.x);
            y = f.a + f.b * d + f.c * d ** 2 + f.d * d **3;
        }

        return new Vector2(x, y);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Number} step resolution
     */
    draw(ctx, step = 0.05) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#49b74d";
        ctx.lineCap = "round";
        ctx.lineJoin = "bevel";

        if (this.points.length > 0){
            ctx.beginPath();
            const start = this.evaluate(0);
            ctx.moveTo(start.x, start.y);
            //draw spline path
            for (let t = step; t < this.points[this.points.length - 1].t; t += step){
                const pos = this.evaluate(t);
                ctx.lineTo(pos.x, pos.y);
            }

            const end = this.points[this.points.length - 1].position;
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
        
        for (const point of this.points){
            point.draw(ctx);
        }
    }


}