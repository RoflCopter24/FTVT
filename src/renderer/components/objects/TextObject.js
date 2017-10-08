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

    setSelected() {
        this._selected = true;
        this.stroke('yellow');
        this.strokeEnabled(true);
    }

    setNotSelected() {
        this._selected = false;
        this.strokeEnabled(false);
    }

    pId(value) {
        if (value) {
            this._pId = value;
            this.id(value);
        }
        return this._pId;
    }

    pText(value) {
        if (value) {
            this._pText = value;
            this.text(value);
            this.draw();
        }

        return this._pText;
    }

    txtColor(value) {
        if (value) {
            this._txtColor = value;
            this.fill(value);
            this.draw();
        }

        return this._txtColor;
    }

    pFontSize(value) {
        if (value) {
            this._fontSize = value;
            this.fontSize(value);
            this.draw();
        }
        return this._fontSize;
    }

    toObject() {
        const baseObj = super.toObject();

        baseObj.txtColor = this._txtColor;
        baseObj.fontSize = this._fontSize;
        baseObj.id       = this._pId;

        return baseObj;
    }

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
