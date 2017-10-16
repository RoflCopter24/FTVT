import Konva from 'konva';

const DEFAULT_FONT_SIZE     = 18;
const DEFAULT_FONT_FAMILY   = 'Roboto';
const DEFAULT_COLOR         = '#ffffff';

export default class TextObject extends Konva.Text {
    constructor(startX, startY, startText, elemId) {
        super({
            x: startX,
            y: startY,
            text: startText,
            fontSize: DEFAULT_FONT_SIZE,
            fontFamily: DEFAULT_FONT_FAMILY,
            fill: DEFAULT_COLOR,
            name: 'TextObject',
            id: elemId,
            draggable: true,
        });
        this._pId = elemId;
        this._pText = startText;
        this._fontSize = DEFAULT_FONT_SIZE;
        this._txtColor = DEFAULT_COLOR;
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
     * Disables the selection mode for this object
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
            this._pId = value;
            this.id(value);
        }
        return this._pId;
    }

    /**
     * Legacy property that controls the text of this object
     * @param value The new text or {null} to retrieve the current one
     * @returns {string}
     */
    pText(value) {
        if (value) {
            this._pText = value;
            this.text(value);
            this.draw();
        }

        return this._pText;
    }

    /**
     * Legacy property that sets or gets the current text color.
     * @param value New color in HEX or {null} to get the current one.
     * @returns {string}
     */
    txtColor(value) {
        if (value) {
            this._txtColor = value;
            this.fill(value);
            this.draw();
        }

        return this._txtColor;
    }

    /**
     * Legacy property to set or get the current font size.
     * @param value New font size or {null} to retrieve the current one.
     * @returns {number}
     */
    pFontSize(value) {
        if (value) {
            this._fontSize = value;
            this.fontSize(value);
            this.draw();
        }
        return this._fontSize;
    }

    /**
     * Returns a KV-representation of this object for storage/serialization
     * @returns {object}
     */
    toObject() {
        const baseObj = super.toObject();

        baseObj.txtColor = this._txtColor;
        baseObj.fontSize = this._fontSize;
        baseObj.id       = this._pId;

        return baseObj;
    }

    /**
     * Creates a new instance from the given KV-Object
     * @param obj
     * @returns {TextObject}
     * @constructor
     */
    static FromObject(obj) {
        const instance = new TextObject(obj.attrs.x, obj.attrs.y, obj.attrs.text, obj.id);

        instance.setNotSelected();
        instance._fontSize  = obj.fontSize;
        instance._txtColor  = obj.txtColor;
        instance._pText     = instance.text();
        instance._pId       = instance.id();

        instance.fontSize(obj.fontSize);
        instance.fill(obj.txtColor);

        return instance;
    }
}
