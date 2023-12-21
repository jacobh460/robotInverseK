import Vector2 from "./vector2.js";


//represents a user-selectable and movable point
export default class Point{

    #position;
    get position(){
        return this.#position;
    }

    set position(newPos){
        this.#position = newPos;
        this.updateElement();
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} t 
     * @param {Number} radius 
     * @param {String} color 
     */
    constructor(x, y, t, radius=3){
        this.#position = new Vector2(x, y);
        this.hidden = false;
        this.radius = radius;
        this.t = t;
        this.rad_sq = this.radius**2;
        this.color = "rgba(52, 128, 255, .75)";
        this.element = null;
    }

    /** @param {CanvasRenderingContext2D} context  */
    draw(context){
        if (this.hidden) return;
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }


    /** @param {Vector2} position */
    testInside(other){
        if (this.hidden) return;
        return this.position.dist_nosqrt(other) < this.rad_sq;
    }

    updateElement(){
        this.element.children[0].children[0].value = this.position.x.toFixed(3);
        this.element.children[0].children[1].value = this.position.y.toFixed(3);
        this.element.children[0].children[2].value = this.t.toFixed(3);
    }

    updatePoint(){
        this.#position.x = Number(this.element.children[0].children[0].value);
        this.#position.y = Number(this.element.children[0].children[1].value);
        this.t = Number(this.element.children[0].children[2].value);
    }

    createElement(){
        const newElement = document.createElement("div");
        newElement.addEventListener("focusout", () => this.color = "rgba(52, 128, 255, .75)");
        newElement.addEventListener("focusin", () => this.color = "rgba(255, 52, 52, .75)");
        newElement.className = "pointData";
        const positionDiv = document.createElement("div");
        positionDiv.className = "position";
        const classes = ["pointProperty left", "pointProperty left right", "pointProperty right"];
        for (const cla of classes){
            const input = document.createElement("input");
            input.type = "number";
            input.className = cla;
            input.addEventListener("change", () => this.updatePoint());
            positionDiv.appendChild(input);
        }
        newElement.appendChild(positionDiv);
        this.element = newElement;
        this.updateElement();
        return newElement;
    }
}