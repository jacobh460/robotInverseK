import Vector2 from "./vector2.js";


//represents a user-selectable and movable point with adjustable properties for inverse kinematics
export default class Point{

    #position;
    get position(){
        return this.#position;
    }

    set position(newPos){
        this.#position = newPos;
        this.#updateElement();
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

        /** @type {Number} length of arm at this point, null if not set*/
        this.L1 = null;
        /** @type {Number} angle of wrist in degrees at this point, null if not set*/
        this.thetaB = null;
    }

    get mustInterpolate() {return !(this.L1 == null && this.thetaB == null);}

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

    #updateElement(){
        this.element.children[0].children[0].value = this.position.x.toFixed(3);
        this.element.children[0].children[1].value = this.position.y.toFixed(3);
        this.element.children[0].children[2].value = this.t.toFixed(3);
    }

    #updatePoint(){
        this.#position.x = Number(this.element.children[0].children[0].value);
        this.#position.y = Number(this.element.children[0].children[1].value);
        this.t = Number(this.element.children[0].children[2].value);
        this.thetaB = this.element.children[1].children[1].value == "" ? null : Number(this.element.children[1].children[1].value);
        this.L1 = this.element.children[1].children[3].value == "" ? null : Number(this.element.children[1].children[3].value);
    
        console.log(this);
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
            input.addEventListener("change", () => this.#updatePoint());
            positionDiv.appendChild(input);
        }
        newElement.appendChild(positionDiv);

        {
            const lockDiv = document.createElement("div");
            lockDiv.className = "locks";
            const L1 = document.createElement("label");
            L1.innerText = "theta_b";
            const in1 = document.createElement("input");
            in1.type = "number";
            in1.className = "lockInput left right";
            const L2 = document.createElement("label");
            L2.innerText = "L_1";
            const in2 = document.createElement("input");
            in2.type = "number";
            in2.className = "lockInput right";

            //clear value of L1 when thetaB is set
            in1.addEventListener("change", () => {this.element.children[1].children[3].value = ""; this.#updatePoint();});
            //clear value of thetaB when L1 is set
            in2.addEventListener("change", () => {this.element.children[1].children[1].value = "";this.#updatePoint();});
            
            
            lockDiv.appendChild(L1);
            lockDiv.appendChild(in1);
            lockDiv.appendChild(L2);
            lockDiv.appendChild(in2);

            newElement.appendChild(lockDiv);
        }
        this.element = newElement;
        this.#updateElement();
        return newElement;
    }
}