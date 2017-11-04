import Konva from 'konva';

const DEFAULT_STROKE_COLOR  = '#000000';
const DEFAULT_STROKE_WIDTH  = 4;
const DEFAULT_OPACITY       = 1;

export default class LineObject extends Konva.Line {
    /**
     * Constructs a new instance of the {LineObject} class
     * @param linePoints All points on this line
     * @param elemId ID of this instance
     * @description
     * The LineObject is not really a line but a path connecting multiple
     * points, so you can basically create crazy shapes with it by adding
     * multiple points
     */
    constructor(linePoints, elemId) {
        super({
            points: linePoints,
            stroke: DEFAULT_STROKE_COLOR,
            strokeWidth: DEFAULT_STROKE_WIDTH,
            opacity: DEFAULT_OPACITY,
            name: 'LineObject',
            id: elemId,
            draggable: true,
        });
        this._opacity = DEFAULT_OPACITY;
        this._strokeColor = DEFAULT_STROKE_COLOR;
    }

    /**
     * Enables the selection mode for this object
     */
    setSelected() {
        this._selected = true;
        super.stroke('yellow');
    }

    /**
     * Enables the selection mode for this object
     */
    setNotSelected() {
        this._selected = false;
        super.stroke(this._strokeColor);
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
     * Legacy property that controls the current stroke color
     * @param value The new fill color or {null} to retrieve the current one
     * @returns {string}
     */
    baseColor(value) {
        if (value) {
            this.stroke(value);
            this._strokeColor = value;
            super.opacity(this._opacity);
        }
        return this._strokeColor;
    }

    /**
     * Legacy property that controls the current opacity
     * @param value
     * @returns {*}
     */
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
        baseObj.strokeColor = this._strokeColor;
        baseObj.opacity     = this.opacity();

        return baseObj;
    }

    /**
     * Creates a new instance from the given KV-Object
     * @param obj
     * @returns {LineObject}
     * @constructor
     */
    static FromObject(obj) {
        console.log(obj);
        const instance = new LineObject(obj.attrs.points, obj.id);

        instance._opacity = obj.opacity;
        instance.baseColor(obj.strokeColor);
        instance.strokeWidth(obj.attrs.strokeWidth);

        return instance;
    }
}
