import Spline from "./bezier.js";
import Point from "./point.js";
import Vector2 from "./vector2.js";

export default class CurveManager{
    /** @type {[Spline]} */
    #curves = [];
    #inc = 0;


    /** @type {Number} */
    #currentCurveIndex = -1;
    get currentCurveIndex() {return this.#currentCurveIndex};
    set currentCurveIndex(a) {this.#dragging = null; this.#currentCurveIndex = a;}

    constructor()
    {
        
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

    /**
     * @returns index of new curve
     */
    createCurve(){
        const name = `bezier (${this.#inc++})`;
        this.#curves.push(new Spline(name));
        this.#currentCurveIndex = this.#curves.length - 1;
        return this.#currentCurveIndex;
    }

    addPoint(x=0, y=0){
        this.#curves[this.#currentCurveIndex].points.push(
            new Point(x, y)
        );
    }

    removePoint(){
        this.#curves[this.#currentCurveIndex].points.pop();
        this.#dragging = null;
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
            if (this.#dragging != null) this.#dragging.position = mouseWorldPos.copy();
            else this.#dragging = this.selectionTest(mouseWorldPos);
        }
        else{
            this.#dragging = null;
        }


    }

    
}