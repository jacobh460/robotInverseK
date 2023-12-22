import Vector2 from "./vector2.js";
import Utils from "./utils.js";

export default class InputManager {

    /** @param {CanvasRenderingContext2D} renderingContext  */
    constructor(renderingContext) {
        this.ctx = renderingContext;

        //position of mouse on screen
        /** @type {Vector2} */
        this.mousePos = new Vector2(0, 0);
        /** @type {Vector2} */
        this.lastMousePos = new Vector2(0, 0);


        //position of mouse in world
        /** @type {Vector2} */
        this.mouseWorldPos = new Vector2(0, 0);
        /** @type {Vector2} */
        this.lastMouseWorldPos = new Vector2(0, 0);

        this.mouseLeftDown = false;

        this.drawHandPath = false;

        this.drawReach = false;

        renderingContext.canvas.addEventListener("keyup", (e) => {
            switch (e.key){
                case "q":
                    this.drawHandPath = !this.drawHandPath;
                    break;
                case "w":
                    this.drawReach = !this.drawReach;
                    break;
                default:
                    break;
            }
        });

        /** @type {boolean} */
        this.panning = false;
        renderingContext.canvas.addEventListener("mousedown", (e) => {
            switch(e.button){
                case 1:
                    this.panning = true;
                    break;
                case 0:
                    this.mouseLeftDown = true;
                    break;
                default:
                    break;
            }
        });
        renderingContext.canvas.addEventListener("mouseup", (e) => {
            switch(e.button){
                case 1:
                    this.panning = false;
                    break;
                case 0:
                    this.mouseLeftDown = false;
                    break;
                default:
                    break;
            }
        });
        renderingContext.canvas.addEventListener("mousemove", (e) => {
            this.mousePos = new Vector2(e.offsetX, e.offsetY);
        });

        this.zoom = 1;

        renderingContext.canvas.addEventListener("wheel", (e) => {
            this.zoom = Math.max(1, this.zoom *  (e.deltaY < 0 ? 1.5 : 1/1.5));

            const transform = renderingContext.getTransform();
            //determine new transform to make sure mouse position stays in same spot in world coordinates after zoom
            transform.e = -((this.zoom * (this.mousePos.x - transform.e)) / transform.a - this.mousePos.x);
            transform.f = -((this.zoom * (this.mousePos.y - transform.f)) / transform.a - this.mousePos.y);
            transform.a = this.zoom;
            transform.d = -this.zoom;
            renderingContext.setTransform(transform);
        });


    }

    //meant to be called once per frame
    update() {
        this.mouseWorldPos = Utils.s2w(this.ctx, this.mousePos);
        //panning
        const change = this.mousePos.sub(this.lastMousePos);
        if (this.panning) this.ctx.translate(change.x / this.zoom, -change.y / this.zoom);
        this.lastMousePos = this.mousePos.copy();
    }
}