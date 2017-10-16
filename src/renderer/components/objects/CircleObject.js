import Konva from 'konva';

const DEFAULT_FILL_COLOR = '#ffffff';
const DEFAULT_STROKE_COLOR = '#000000';
const DEFAULT_STROKE_WIDTH = 2;

export default class CircleObject extends Konva.Circle {
    constructor(startX, startY, cRadius, elemId) {
        super({
            x: startX,
            y: startY,
            radius: cRadius,
            fill: DEFAULT_FILL_COLOR,
            stroke: DEFAULT_STROKE_COLOR,
            strokeWidth: DEFAULT_STROKE_WIDTH,
            name: 'CircleObject',
            id: elemId,
        });
    }

    /**
     * Enables the selection mode for this object
     */
    setSelected() {
        this._selected = true;
        this.stroke('yellow');
    }

    /**
     * Enables the selection mode for this object
     */
    setNotSelected() {
        this._selected = false;
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
        }
        return this.fill();
    }

    /**
     * Returns a KV-representation of this object for storage/serialization
     * @returns {object}
     */
    toObject() {
        const baseObj = super.toObject();

        baseObj.id          = this.id();
        baseObj.baseColor   = this.fill();
        baseObj.radius      = this.radius();

        return baseObj;
    }

    /**
     * Creates a new instance from the given KV-Object
     * @param obj
     * @returns {TextObject}
     * @constructor
     */
    static FromObject(obj) {
        const instance = new CircleObject(obj.attrs.x, obj.attrs.y,
            obj.radius, obj.id);

        instance.setNotSelected();
        instance.fill(obj.baseColor);

        return instance;
    }
}
