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



    /**
     * 
     * @param {Number} x 
     * @param {Number} min 
     * @param {Number} max 
     * @returns 
     */
    static clamp(x, min, max){
        return Math.max(Math.min(x, max), min)
    }

    /**
     * returns the equivalent of an angle within the range 0 <= theta <= 2*PI
     * @param {Number} angle in radians
     * @returns {Number}
     */
    static normalize_angle(angle){
        const x = angle % (2*Math.PI);
        return x < 0 ? x + Math.PI * 2 : x;
    }

}