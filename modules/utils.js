import Vector2 from "./vector2.js";


export default class Utils{


    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Vector2} position 
     * @returns 
     */
    static s2w(context, position){
        const currentTransform = context.getTransform();
        return new Vector2((position.x - currentTransform.e)/currentTransform.a, (position.y - currentTransform.f)/currentTransform.d);
    }

    /** @param {Number} deg */
    static deg2rad(deg){
        return deg * Math.PI/180;
    }

    /** @param {Number} rad */
    static rad2deg(rad){
        return rad * 180/Math.PI;
    }

    /**
     * 
     * @param {Number} y0 
     * @param {Number} x0 
     * @param {Number} x1 
     * @param {Number} y1 
     * @param {Number} x 
     * @returns {Number}
     */
    static lerp(x0, y0, x1, y1, x){
        return (y0 * (x1 - x) + y1 * (x - x0))/(x1 - x0);
    }

}