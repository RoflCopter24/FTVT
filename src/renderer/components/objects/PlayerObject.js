import Konva from 'konva';

class PlayerObject extends Konva.Group {
    /**
     * Constructs a new instance of the PlayerObject class
     * @param {number} startX     Position on the x-Axis
     * @param {number} startY     Position on the y-Axis
     * @param {string} objectName Name of the Object
     */
    constructor(startX, startY, objectName, loaded) {
        super({
            x: startX,
            y: startY,
            rotation: 0,
            draggable: true,
            id: objectName,
            name: 'PlayerObject',
        });

        this._title      = objectName;
        this._baseColor  = '#ff0000';
        this._txtColor   = '#ffffff';
        if (!loaded) {
            this.base = this.createBaseCircle(this.baseColor());
            this.baseText = this.createBaseText(this.title(), 16, 'Roboto', this.txtColor());

            this.add(this.base);
            this.add(this.baseText);
        }
        this._selected   = false;
        this.aCounter   = 0;
    }

    baseColor(value) {
        if (value) {
            this._baseColor = value;
            if (this.base) {
                this.base.fill(value);
                this.draw();
            }
        }
        return this._baseColor;
    }

    /**
     * Returns the width of the base component
     * @returns {number}
     */
    baseWidth() {
        return (this.base) ? this.base.getWidth() : 0;
    }

    /**
     * Returns the height of the base component
     * @returns {number}
     */
    baseHeight() {
        return (this.base) ? this.base.getHeight() : 0;
    }

    selected(value) {
        if (value) {
            this._selected = value;
        }
        return this._selected;
    }

    txtColor(value) {
        if (value) {
            this._txtColor = value;
            if (this.baseText) {
                this.baseText.fill(value);
                this.draw();
            }
        }
        return this._txtColor;
    }

    /**
     * Sets the title of this object which is displayed on the
     * baseText-Object
     * @param newTitle The new title for this object
     */
    title(newTitle) {
        if (newTitle) {
            this._title = newTitle;
            if (this.baseText) {
                this.baseText.text(newTitle);
                this.baseText.setOffset({
                    x: this.baseText.getWidth() / 2,
                    y: this.baseText.getHeight() / 2,
                });
                this.draw();
            }
        }
        return this._title;
    }

    /**
     * Returns the current x-Axis value
     * @returns {number | Konva.Node}
     */
    x() {
        return super.x();
    }

    /**
     * Returns the current y-Axis value
     * @returns {number | Konva.Node}
     */
    y() {
        return super.y();
    }

    /**
     * Adds a straight arrow from this object to the specified
     * target position.
     * @param {Object} endPos The target position
     */
    addStraightArrow(endPos) {
        const arr = this.createStraightArrow({ x: 0,  y: 0 }, endPos,
            this.id() + 'Arrow' + this.aCounter, '#000', '#000');

        this.add(arr);
        arr.moveDown();
        arr.moveDown();
        this.draw();
        this.aCounter++;
    }

    /**
     * Adds a complex arrow starting from this object and extending
     * over the specified array of points to the end position.
     * @param splinePoints The waypoints of the spline
     * @param endPos Endposition of the spline
     */
    addComplexArrow(splinePoints, endPos) {
        const arr = this.createComplexArrow(splinePoints, endPos,
            this.id() + 'Arrow' + this.aCounter, '#000', '#000');

        this.add(arr);
        arr.moveDown();
        arr.moveDown();
        this.draw();
        this.aCounter++;
    }

    clearArrows() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            const isArrow = this.children[i] instanceof Konva.Arrow;
            console.log(isArrow);
            if (isArrow) {
                this.children.splice(i, 1);
            }
        }
    }

    /**
     * Creates and returns a new simple {Konva.Arrow} object.
     * @param startPos Startposition of the arrow, rel to this object
     * @param endPos Target position of the arrow
     * @param objId The internal ID of the arrow object
     * @param fillColor
     * @param strokeColor
     * @param strokeW Width of the arrow line
     * @param pLen Pointer length
     * @param pWidth Pointer width
     * @returns {Konva.Arrow}
     */
    createStraightArrow(startPos, endPos, objId, fillColor, strokeColor,
                        strokeW = 2, pLen = 20, pWidth = 20) {
        return new Konva.Arrow({
            x: startPos.x,
            y: startPos.y,
            id: objId,
            points: [0, 0, endPos.x - this.getAbsolutePosition().x,
                endPos.y - this.getAbsolutePosition().y],
            pointerLength: pLen,
            pointerWidth: pWidth,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: strokeW,
        });
    }

    /**
     * Creates and returns a new {Konva.Arrow} object constructed from
     * a spline path
     * @param splinePoints The points of the arrow path on the canvas
     * @param endPos The last position of the path
     * @param objId Internal ID of the Arrow object
     * @param fillColor
     * @param strokeColor
     * @param strokeW Line width of the arrow path
     * @param pLen Length of the pointer head
     * @param pWidth width of the pointer head
     * @returns {Konva.Arrow}
     */
    createComplexArrow(splinePoints, endPos, objId, fillColor, strokeColor,
                       strokeW = 4, pLen = 20, pWidth = 20) {
        const pointArr = [0, 0];
        const currObjPos = this.getAbsolutePosition();

        for (let i = 0; i < splinePoints.length; i++) {
            pointArr.push(splinePoints[i].x - currObjPos.y);
            pointArr.push(splinePoints[i].y - currObjPos.y);
        }
        pointArr.push(endPos.x - currObjPos.x);
        pointArr.push(endPos.y - currObjPos.y);

        return new Konva.Arrow({
            x: 0,
            y: 0,
            id: objId,
            points: pointArr,
            pointerLength: pLen,
            pointerWidth: pWidth,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: strokeW,
            tension: 0,
        });
    }

    /**
     * Creates a circle with a radius of 32 and a black outline
     * that is named using this.name + '_base' and positioned
     * at the current position.
     * @param {string} color The color of the resulting circle
     * @returns {Konva.Circle}
     */
    createBaseCircle(color) {
        return new Konva.Circle({
            x: this.x(),
            y: this.y(),
            radius: 32,
            fill: color,
            stroke: 'black',
            strokeWidth: 4,
            name: 'PlayerObjectBase',
            id: this.title() + '_base',
        });
    }

    /**
     * Creates a {Konva.Text} object at the current position with
     * the specified parameters.
     * @param {string} desiredText      The desired text
     * @param {number} desFontSize      Font Size of this text
     * @param {string} desFontFamily    CSS-FontFamily for the text
     * @param {string} desColor         CSS-Color of the text
     * @returns {Konva.Text}
     */
    createBaseText(desiredText, desFontSize, desFontFamily, desColor) {
        const textObj = new Konva.Text({
            x: this.x(),
            y: this.y(),
            text: desiredText,
            fontSize: desFontSize,
            fontFamily: desFontFamily,
            fill: desColor,
            name: 'PlayerObjectText',
            id: this.title() + '_baseText',
        });
        textObj.setOffset({
            x: textObj.getWidth() / 2,
            y: textObj.getHeight() / 2,
        });
        return textObj;
    }

    /**
     * Destroys this object and removes it from the graph
     */
    destroy() {
        super.destroy();
    }

    /**
     * Sets the selection attribute and changes
     * the color outline to yellow.
     */
    setSelected() {
        this.base.stroke('yellow');
        this.selected = true;
    }

    /**
     * Sets the selection attribute to false and
     * the outline back to black.
     */
    setNotSelected() {
        this.base.stroke('black');
        this.selected = false;
    }

    /**
     * Returns the current position of the object
     * @returns Konva.Vector2d
     */
    getPosition() {
        return super.getAbsolutePosition();
    }

    /**
     * Returns a string representing this object
     * @returns {string}
     */
    toString() {
        return this.title() + ' (' + this.x() + ',' + this.y() + ')';
    }

    /**
     * Returns a JSON string representing this object and its data
     * @returns {string}
     */
    toJSON() {
        return JSON.stringify(this.toObject());
    }

    /**
     * Returns a storeable object for serialization
     * @returns {any}
     */
    toObject() {
        const baseObj = super.toObject();

        baseObj.baseColor = this.baseColor();
        baseObj.txtColor = this.txtColor();
        baseObj.aCounter = this.aCounter;

        return baseObj;
    }

    /**
     * Creates an instance of this object from a JSON string
     * @param json The JSON string
     * @returns {PlayerObject}
     * @constructor
     */
    static FromJSON(json) {
        const jsonObj       = JSON.parse(json);

        return this.FromObject(jsonObj);
    }

    /**
     * Creates a PlayerObject Instance from the specified KV Object
     * @param obj
     * @returns {PlayerObject}
     * @constructor
     */
    static FromObject(obj) {
        const instance      = new PlayerObject(obj.attrs.x, obj.attrs.y, obj.attrs.id, true);
        instance._baseColor = obj.baseColor;
        instance._txtColor  = obj.txtColor;
        instance.aCounter   = obj.aCounter;

        for (let i = 0; i < obj.children.length; i++) {
            const child = obj.children[i];
            const childInstance = Konva.Node.create(child);
            instance.add(childInstance);
        }

        instance.base       = instance.find('.PlayerObjectBase')[0];
        instance.baseText   = instance.find('.PlayerObjectText')[0];

        return instance;
    }
}
export default PlayerObject;
