import Spline from "./Spline.js";
import Point from "./point.js";
import Vector2 from "./vector2.js";

export default class CurveManager{
    /** @type {[Spline]} */
    #curves = [];
    #inc = 0;


    /** @type {Number} */
    #currentCurveIndex = -1;
    get CurrentCurveIndex() {return this.#currentCurveIndex};
    set CurrentCurveIndex(a) {
        this.#dragging = null; 
        this.#currentCurveIndex = a;
        this.resetGui();
    }

    constructor()
    {
        this.dropdown = document.getElementById("curveList");
        this.curveNameInput = document.getElementById("curveName");
        this.points = document.getElementById("points");


        this.curveNameInput.addEventListener("change", (e) => {
            this.currentCurve.name = this.curveNameInput.value;
            this.resetDropdown();
        });

        document.getElementById("addSplineButton").addEventListener("click", (e) => {
            this.createCurve();
        });

        document.getElementById("removeSplineButton").addEventListener("click", (e) => {
            if (this.#curves.length <= 1) return;
            const cont = prompt(`Type '${this.currentCurve.name}' to delete it permanently.`);
            if (cont != this.currentCurve.name) return;

            this.#curves.splice(this.CurrentCurveIndex, 1);
            this.CurrentCurveIndex = this.#curves.length - 1;
            this.resetGui();
        });

        this.dropdown.addEventListener("change", (e) => {
            this.CurrentCurveIndex = this.dropdown.selectedIndex;
        });

        document.getElementById("addPointButton").addEventListener("click", (e) => {
            this.addPoint(0, 0, this.currentCurve.points.length > 0 ? this.currentCurve.points[this.currentCurve.points.length - 1].t + 2 : 0);
        });

        document.getElementById("removePointButton").addEventListener("click", (e) => {
            this.removePoint();
        });


    }



    /**
     * 
     * @param {Number} index 
     * @returns {Spline}
     */
    getCurve = (index) => this.#curves[index];

    get currentCurve(){return this.#curves[this.#currentCurveIndex]};

    get curveCount(){return this.#curves.length;}

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} resolution 
     * @returns 
     */
    draw = (ctx, resolution=0.05) => this.#curves[this.#currentCurveIndex].draw(ctx, resolution);

    /**
     * 
     * @returns list of names corresponding to curves
     */
    getCurves = () => {
        const names = [];
        for (const curve of this.#curves) names.push(curve.name);
        return names;
    };

    resetDropdown(){

        const newChildren = [];
        for (const spline of this.#curves){
            const option = document.createElement("option");
            option.innerText = spline.name;
            newChildren.push(option);
        }
        newChildren[this.#currentCurveIndex].selected = true;
        this.dropdown.replaceChildren(...newChildren);
    }

    resetPointGui(){
        const children = new Array(this.currentCurve.points.length);
        for (let i = 0; i < children.length; ++i){
            children[i] = this.#createPointElement(i);
        }

        this.points.replaceChildren(...children);
    }

    resetGui(){
        this.resetDropdown();
        this.resetPointGui();
        this.curveNameInput.value = this.currentCurve.name;
    }



    /**
     * @returns index of new curve
     */
    createCurve(){
        const name = `spline (${this.#inc++})`;
        this.#curves.push(new Spline(name));
        this.CurrentCurveIndex = this.#curves.length - 1;
        this.resetGui();
        return this.#currentCurveIndex;
    }

    addPoint(x=0, y=0, time=0){
        const a = new Point(x, y, time);
        this.currentCurve.points.push(
            a
        );
        this.points.appendChild(this.#createPointElement(this.currentCurve.points.length - 1));
    }

    removePoint(){
        this.#curves[this.#currentCurveIndex].points.pop();
        this.#dragging = null;
        this.points.lastChild.remove();
    }

    #createPointElement(i){
        const element = this.currentCurve.points[i].createElement();
        element.children[0].addEventListener("keydown", (e) => {
            if (e.keyCode == 46){
                this.currentCurve.points.splice(i, 1);
                this.resetPointGui();
            }
        });

        return element;
    }

    selectionTest(position){
        const currentCurve = this.currentCurve;
        for (let i = currentCurve.points.length - 1; i >= 0; --i){
            const point = currentCurve.points[i];
            if (point.testInside(position)) return point;
        }
        return null;
    }

    /** @type {Point} */
    #dragging = null;
    /**
     * 
     * @param {Vector2} mouseWorldPos 
     * @param {Boolean} mouseLeftDown 
     */
    handleInput(mouseWorldPos, mouseLeftDown){
        if (mouseLeftDown){
            if (this.#dragging != null){
                this.#dragging.position = mouseWorldPos.copy();
            }
            else this.#dragging = this.selectionTest(mouseWorldPos);
        }
        else{
            //if (this.#dragging != null) this.currentCurve.calc();
            this.#dragging = null;
        }
    }
}