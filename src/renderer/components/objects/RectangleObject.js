import Konva from 'konva';

const DEFAULT_FILL_COLOR    = '#ff3eef';
const DEFAULT_STROKE_COLOR  = '#000000';
const DEFAULT_STROKE_WIDTH  = 2;
const DEFAULT_OPACITY       = 0.5;

export default class RectangleObject extends Konva.Rect {
    constructor(startX, startY, rWidth, rHeight, elemId) {
        super({
            x: startX,
            y: startY,
            width: rWidth,
            height: rHeight,
            fill: DEFAULT_FILL_COLOR,
            stroke: DEFAULT_STROKE_COLOR,
            strokeWidth: DEFAULT_STROKE_WIDTH,
            id: elemId,
            name: 'RectangleObject',
            opacity: DEFAULT_OPACITY,
            draggable: true,
        });
        this._opacity = DEFAULT_OPACITY;
        this._border = false;
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
        this.strokeEnabled(false);
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
            this.opacity(this._opacity);
            this.draw();
        }
        return this.fill();
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
     * Render border?
     * @param value
     * @returns {*}
     */
    border(value) {
        if (value) {
            this._border = value;
            if (!this._selected) {
                super.strokeEnabled(this._border);
            }
        }
        return this._border;
    }

    /**
     * Returns a KV-representation of this object for storage/serialization
     * @returns {object}
     */
    toObject() {
        const baseObj = super.toObject();

        baseObj.id          = this.id();
        baseObj.baseColor   = this.fill();
        baseObj.border      = this.border();

        return baseObj;
    }

    /**
     * Creates a new instance from the given KV-Object
     * @param obj
     * @returns {TextObject}
     * @constructor
     */
    static FromObject(obj) {
        const instance = new RectangleObject(obj.attrs.x, obj.attrs.y,
            obj.attrs.width, obj.attrs.height, obj.id);

        instance.setNotSelected();
        instance.fill(obj.baseColor);
        instance._border = obj.border;

        return instance;
    }
}
