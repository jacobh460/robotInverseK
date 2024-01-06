import Point from "./point.js";
import Vector2 from "./vector2.js";
import {Manipulator} from "./manipulator.js";
import Utils from "./utils.js";

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

    /**
     * 
     * @param {Manipulator} robot 
     * @param {Number} t 
     */
    inverseKinematics(robot, t){
        const position = this.evaluate(t);
        if (this.points.length == 0) return position;

            //if there is only one point, don't interpolate
        if (this.points.length == 1){
            if (this.points[0].L1 != null) return robot.doInverseKinematics_L1(position, this.points[0].L1);
            if (this.points[0].thetaB != null) return robot.doInverseKinematics_thetab(position, Utils.deg2rad(this.points[0].thetaB));
            return robot.doInverseKinematics(position);
        }

        //determine which two points t is between
        let i = 1;
        while (t > this.points[i].t) ++i;

        //check if interpolation is even needed
        if (!(this.points[i].mustInterpolate || this.points[i-1].mustInterpolate)) return robot.doInverseKinematics(position);

        //robot cannot interpolate between different lift heights and different wrist angles
        if ((this.points[i].L1 != null && this.points[i-1].thetaB != null) || (this.points[i].thetaB != null && this.points[i-1].L1 != null)) 
            return robot.doInverseKinematics(position); //just ignore the user-defined angles

        //determine which value to interpolate
        if (this.points[i].thetaB != null || this.points[i-1].thetaB != null){ //need to interpolate thetaB
            //fill in missing values by performing inverse kinematics
            let first = this.points[i-1].thetaB;
            let second = this.points[i].thetaB;


            if (first == null)
                first = robot.doInverseKinematics(this.points[i-1].position).thetaB;
            else first = Utils.deg2rad(first); //user is expected to enter an angle in degrees

            if (second == null)
                second = robot.doInverseKinematics(this.points[i].position).thetaB;
            else second = Utils.deg2rad(second);

            //avoid wacky interpolation
            const shortest = Utils.shortest_angle(first, second);


            //lerp
            //const newTheta = Utils.lerp(this.points[i-1].t, first, this.points[i].t, first + shortest, t);
            const newTheta = first + shortest * (t - this.points[i-1].t)/(this.points[i].t-this.points[i-1].t);

            //run inverse kinematics
            return robot.doInverseKinematics_thetab(position, newTheta);
        }
        else{ //need to interpolate lift height
            //fill in missing values by performing inverse kinematics
            let first = this.points[i-1].L1;
            let second = this.points[i].L1;
            if (first == null)
                first = robot.doInverseKinematics(this.points[i-1].position).L1;
            else if (second == null)
                second = robot.doInverseKinematics(this.points[i].position).L1;

            //lerp
            const newL1 = Utils.lerp(this.points[i-1].t, first, this.points[i].t, second, t);

            //run inverse kinematics 
            return robot.doInverseKinematics_L1(position, newL1);
        }

    }

    evaluate(t){
        if (this.points.length == 0) return new Vector2(15, 115);//just fudged these numbers because they don't matter
        if (this.points.length == 1) return this.points[0].position;
        if (this.set_x.length == 0 || this.set_y.length == 0) return this.points[this.points.length - 1].position;


        //determine which piece of the piecewise function needs to be evaluated
        let current_piece = 0;
        while (t > this.points[current_piece + 1].t) ++current_piece;

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
        ctx.lineWidth = 0.35;
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