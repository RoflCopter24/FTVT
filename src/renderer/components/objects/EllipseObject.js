import Konva from 'konva';

const DEFAULT_FILL_COLOR    = '#ffffff';
const DEFAULT_STROKE_COLOR  = '#000000';
const DEFAULT_STROKE_WIDTH  = 2;
const DEFAULT_OPACITY       = 0.5;

export default class EllipseObject extends Konva.Ellipse {
    /**
     * Constructs a new instance of the {EllipseObject} class
     * @param startX X-value of the first point
     * @param startY Y-value of the first point
     * @param elemId ID of this instance
     * @param endX X-value of the end point
     * @param endY Y-value of the end point
     * @description
     * The EllipseObject is treated as a rectangle during creation,
     * so the start end end point will not be part of the ellipse itself
     * but rather the bounding rectangle.
     * The position of the object will be the center of the ellipse
     */
    constructor(startX, startY, elemId, endX, endY) {
        super({
            x: startX + ((endX - startX) / 2), // Calculate the center X
            y: startY + ((endY - startY) / 2), // Calculate the center Y 
            fill: DEFAULT_FILL_COLOR,
            stroke: DEFAULT_STROKE_COLOR,
            strokeWidth: DEFAULT_STROKE_WIDTH,
            opacity: DEFAULT_OPACITY,
            name: 'EllipseObject',
            id: elemId,
            width: endX - startX,
            height: endY - startY,
            draggable: true,
        });
        this._opacity = DEFAULT_OPACITY;
    }

    /**
     * Enables the selection mode for this object
     */
    setSelected() {
        this._selected = true;
        this.stroke('yellow');
        this.strokeEnabled(true);
    }

    /**
     * Enables the selection mode for this object
     */
    setNotSelected() {
        this._selected = false;
        this.stroke(DEFAULT_STROKE_COLOR);
    }

    /**
     * Legacy property that controls the ID of this
     * object
     * @param value The new ID for this object or {null} to retrieve the value
     * @returns {string}
     */
    pId(value) {
        if (value) {
            this.id(value);
        }
        this.draw();
        return this.id();
    }

    /**
     * Legacy property that controls the current fill color
     * @param value The new fill color or {null} to retrieve the current one
     * @returns {string}
     */
    baseColor(value) {
        if (value) {
            this.fill(value);
            super.opacity(this._opacity);
            this.draw();
        }
        return this.fill();
    }

    opacity(value) {
        if (value) {
            this._opacity = value;
            super.opacity(this._opacity);
            this.draw();
        }
        return this._opacity;
    }

    /**
     * Returns a KV-representation of this object for storage/serialization
     * @returns {object}
     */
    toObject() {
        const baseObj = super.toObject();

        baseObj.id          = this.id();
        baseObj.baseColor   = this.fill();
        baseObj.opacity     = this._opacity;

        return baseObj;
    }

    /**
     * Creates a new instance from the given KV-Object
     * @param obj
     * @returns {TextObject}
     * @constructor
     */
    static FromObject(obj) {
        const instance = new EllipseObject(obj.attrs.x, obj.attrs.y,
            obj.id, obj.attrs.width, obj.attrs.height);

        instance.fill(obj.baseColor);
        instance._opacity = obj.opacity;

        return instance;
    }
}
