import Vector2 from "./vector2.js";


export default class Utils{


    /** @param {Vector2} position   */
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

}