import Utils from "./utils.js";
import Vector2 from "./vector2.js";

export class Configuration{
    /**
     * 
     * @param {Number} L1 
     * @param {Number} thetaA 
     * @param {Number} thetaB 
     */
    constructor(L1, thetaA, thetaB){
        this.L1 = L1;
        this.thetaA = thetaA;
        this.thetaB = thetaB;
    }
}


export class Manipulator {

    constructor() {
        this.L2 = 70;
        this.L3 = 40;
        this.r1 = this.L2 + this.L3;
        this.L1min = 50;
        this.L1max = 130;
        this.liftAngle = Utils.deg2rad(120.0);

        this.configuration = new Configuration(50, Math.PI/2, 0);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Boolean} drawReach 
     */
    draw(ctx, drawReach) {
        if (drawReach){
            const liftStart = new Vector2(this.L1min * Math.cos(this.liftAngle), this.L1min * Math.sin(this.liftAngle));
            const liftEnd = new Vector2(this.L1max * Math.cos(this.liftAngle), this.L1max * Math.sin(this.liftAngle));
            ctx.fillStyle = "rgba(66, 199, 101, 0.15)";
            ctx.beginPath();
            ctx.arc(liftStart.x, liftStart.y, this.r1, this.liftAngle + Math.PI/2, this.liftAngle + 3/2 * Math.PI, false);
            ctx.arc(liftEnd.x, liftEnd.y, this.r1, this.liftAngle + 3/2 * Math.PI, this.liftAngle + Math.PI/2, false);
            ctx.fill();
        }


        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "bevel";


        const liftEnd = new Vector2(
            Math.cos(this.liftAngle) * this.configuration.L1,
            Math.sin(this.liftAngle) * this.configuration.L1
        );

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(liftEnd.x, liftEnd.y);
        const secondX = liftEnd.x + Math.cos(this.configuration.thetaA) * this.L2;
        const secondY = liftEnd.y + Math.sin(this.configuration.thetaA) * this.L2;
        ctx.lineTo(secondX, secondY);
        ctx.lineTo(secondX + Math.cos(this.configuration.thetaB) * this.L3, secondY + Math.sin(this.configuration.thetaB) * this.L3);
        ctx.stroke();
    }


    /**
     * 
     * @param {Vector2} position 
     * @returns {Configuration} robot configuration
     */
    doInverseKinematics(position) {

        //calculate lift length
        const r0 = Math.sqrt(position.x ** 2 + position.y ** 2);

        const theta0 = Math.atan2(position.y, position.x);
        const theta2 = this.liftAngle - theta0;
        const theta3 = Math.PI - Math.asin(r0 * (Math.sin(theta2) / this.r1));
        let L1 = Math.max(Math.min(this.r1 * Math.sin(Math.PI - theta2 - theta3) / Math.sin(theta2), this.L1max), this.L1min);

        if (L1 !== L1){ //check if calculation came out as NaN
            //target cannot be reached, just make it possible for hand to get as close as it possible can
            L1 = Utils.clamp(position.rotate(-this.liftAngle + Math.PI/2).y, this.L1min, this.L1max);
        }

        return this.doInverseKinematics_L1(position, L1);
    }

    /**
     * 
     * @param {Configuration} configuration 
     * @returns {Vector2} end position
     */
    forwardKinematics(configuration){
        return new Vector2(
            configuration.L1 * Math.cos(this.liftAngle) + this.L2 * Math.cos(configuration.thetaA) + this.L3 * Math.cos(configuration.thetaB),
            configuration.L1 * Math.sin(this.liftAngle) + this.L2 * Math.sin(configuration.thetaA) + this.L3 * Math.sin(configuration.thetaB)
        );
    }

    /**
     * 
     * @param {Vector2} position 
     * @param {Number} thetaB in radians
     */
    doInverseKinematics_thetab(position, thetaB){
        const config = new Configuration(0, 0, thetaB);
        const A = position.sub(new Vector2(
            this.L3 * Math.cos(thetaB),
            this.L3 * Math.sin(thetaB)
        ));

        const theta2 = Math.atan2(A.y, A.x);
        const theta3 = 2/3*Math.PI - theta2;
        const sin_theta3 = Math.sin(theta3);
        const d = Math.sqrt(A.x**2 + A.y**2);

        const theta1 = Math.PI - Math.asin(d * sin_theta3 / this.L2);


        config.thetaA = theta1 - 1/3 * Math.PI;
        config.L1 = Utils.clamp(this.L2 * Math.sin(Math.PI - theta3 - theta1) / sin_theta3, this.L1min, this.L1max);
        return config;
    }

    /**
     * 
     * @param {Vector2} position 
     * @param {Number} L1 
     */
    doInverseKinematics_L1(position, L1){
        const config = new Configuration(L1, 0, 0);

        const liftEnd = new Vector2(
            Math.cos(this.liftAngle) * config.L1,
            Math.sin(this.liftAngle) * config.L1
        );

        //calculate joint angles
        {
            const d = Utils.clamp(Math.sqrt((position.x - liftEnd.x) ** 2 + (position.y - liftEnd.y) ** 2), this.L2 - this.L3, this.r1);
            if (position.x < liftEnd.x) {
                config.thetaA = -Math.acos((this.L2 ** 2 + d ** 2 - this.L3 ** 2) / (2 * this.L2 * d)) + Math.atan2(position.y - liftEnd.y, position.x - liftEnd.x);
                const theta3 = -Math.acos((this.L3 ** 2 + this.L2 ** 2 - d ** 2) / (2 * this.L3 * this.L2));
                config.thetaB = - Math.PI + config.thetaA + theta3;
            }
            else {
                config.thetaA = Math.acos((this.L2 ** 2 + d ** 2 - this.L3 ** 2) / (2 * this.L2 * d)) + Math.atan2(position.y - liftEnd.y, position.x - liftEnd.x);
                const theta3 = Math.acos((this.L3 ** 2 + this.L2 ** 2 - d ** 2) / (2 * this.L3 * this.L2));
                config.thetaB = - Math.PI + config.thetaA + theta3;
            }
        }
        return config;
    }

}

export default {Manipulator, Configuration}