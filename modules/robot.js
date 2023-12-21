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


export class Robot {

    constructor() {
        this.L2 = 70;
        this.L3 = 40;
        this.r1 = this.L2 + this.L3;
        this.L1min = 50;
        this.L1max = 130;
        this.liftAngle = Utils.deg2rad(120.0);

        this.configuration = new Configuration(50, Math.PI/2, 0);
    }

    /** @param {CanvasRenderingContext2D} ctx  */
    draw(ctx) {
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
        const L1 = Math.max(Math.min(this.r1 * Math.sin(Math.PI - theta2 - theta3) / Math.sin(theta2), this.L1max), this.L1min);


        return this.doInverseKinematics_L1(position, L1);
    }


    /**
     * 
     * @param {Vector2} position 
     * @param {Number} thetaB 
     */
    doInverseKinematics_thetab(position, thetaB){

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
            const d = Math.max(Math.min(Math.sqrt((position.x - liftEnd.x) ** 2 + (position.y - liftEnd.y) ** 2), this.r1), this.L2 - this.L3);
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

export default {Robot, Configuration}