export default class Vector2{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y){
        /** @type {Number} */
        this.x = x;
        /** @type {Number} */
        this.y = y;
    }

    /**
     * 
     * @param {Number|Vector2} other 
     * @returns {Vector2}
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
     * @returns {Vector2}
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
     * @returns {Vector2}
     */

    mult(scalar){
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    /**
     * 
     * @param {Number} scalar 
     * @returns {Vector2}
     */
    div(scalar){
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    /**
     * 
     * @param {Vector2} other 
     * @returns {Vector2}
     */
    dot(other){
        return this.x * other.x + this.y * other.y;
    }

    /**
     * 
     * @returns {Vector2} copy of this vector
     */
    copy(){
        return new Vector2(this.x, this.y);
    }

    /**
     * 
     * @param {Vector2} other 
     * @returns {Number} distance between the two positions
     */
    dist(other){
        return Math.sqrt(this.dist_nosqrt(other));
    }

    /**
     * 
     * @param {Vector2} other 
     * @returns {Number}
     */
    dist_nosqrt(other){
        return (this.x - other.x)**2 + (this.y - other.y)**2;
    }

    /**
     * 
     * @param {Number} theta angle in radians to rotate by
     * @returns {Vector2} rotated vector
     */
    rotate(theta){
        return new Vector2(
            this.x * Math.cos(theta) - this.y * Math.sin(theta),
            this.x * Math.sin(theta) + this.y * Math.cos(theta)
        );
    }
}