export default class Vector2{
    constructor(x, y){
        /** @type {Number} */
        this.x = x;
        /** @type {Number} */
        this.y = y;
    }

    /**
     * 
     * @param {Number|Vector2} other 
     * @returns 
     */
    add(other){
        if (typeof(other) == "number"){
            return new Vector2(this.x + other, this.y + other);
        }
        else{
            return new Vector2(this.x + other.x, this.y + other.y);
        }
    }

    /**
     * 
     * @param {Number|Vector2} other 
     * @returns 
     */
    sub(other){
        if (typeof(other) == "number"){
            return new Vector2(this.x - other, this.y - other);
        }
        else{
            return new Vector2(this.x - other.x, this.y - other.y);
        }
    }
    /**
     * 
     * @param {Number} scalar 
     * @returns 
     */

    mult(scalar){
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    /**
     * 
     * @param {Number} scalar 
     * @returns 
     */
    div(scalar){
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    /**
     * 
     * @param {Vector2} other 
     * @returns 
     */
    dot(other){
        return this.x * other.x + this.y * other.y;
    }

    copy(){
        return new Vector2(this.x, this.y);
    }

    /**
     * 
     * @param {Vector2} other 
     */
    dist(other){
        Math.sqrt(this.dist_nosqrt(other));
    }

    /**
     * 
     * @param {Vector2} other 
     * @returns 
     */
    dist_nosqrt(other){
        return (this.x - other.x)**2 + (this.y - other.y)**2;
    }
}