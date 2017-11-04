<template v-show="activeComponent == document.id">
    <div class="document-container">
        <div ref="container" :id="document.id + '-container'" class="document-view">
        </div>

        <player-context-menu :visible="showPlayerMenu"
                             :refresh="playerMenuRefresh" :position="{ x:x, y:y }"
                             :on-add-straight-arrow="onAddStraightArrow"
                             :on-add-complex-arrow="onAddComplexArrow"></player-context-menu>

        <snackbar dark v-model="snackbarStraightArr" :disable-timeout="true">
            Standardpfeil: Auf Zielort klicken
            <v-btn dark flat @click.native="snackbarStraightArr = false; arrowStraightMode = false">Abbrechen</v-btn>
        </snackbar>
        <snackbar dark v-model="snackbarComplexArr" :disable-timeout="true">
            Komplexer Pfeil: Klicken um Wegpunkte hinzuzufügen
            <v-btn dark flat @click.native="snackbarComplexArr = false; arrowComplexMode = false">Abbrechen</v-btn>
            <v-btn dark flat @click.native="addComplexArrow">Bestätigen</v-btn>
        </snackbar>
        <snackbar dark v-model="snackbarCreateLine" :disable-timeout="true">
            Linie erstellen: Klicken um Wegpunkte hinzuzufügen
            <v-btn dark flat @click.native="snackbarCreateLine = false; createLineMode = false">Abbrechen</v-btn>
            <v-btn dark flat @click.native="addLine">Bestätigen</v-btn>
        </snackbar>

        <snackbar dark v-model="snackbarCreateRect" :disable-timeout="true">
            Start- und Endposition durch Klick festlegen
            <v-btn dark flat @click.native="snackbarCreateRect = false; createRectMode = false">Abbrechen</v-btn>
        </snackbar>

        <snackbar dark v-model="snackbarCreateCircle" :disable-timeout="true">
            Start- und Endposition durch Klick festlegen
            <v-btn dark flat @click.native="snackbarCreateCircle = false; createCircleMode = false">Abbrechen</v-btn>
        </snackbar>

        <snackbar v-model="snackbarExporting">
            <v-progress-circular indeterminate class="indigo--text"></v-progress-circular>
            Wird exportiert...
        </snackbar>

        <snackbar v-model="snackbarSaving">
            <v-progress-circular indeterminate class="indigo--text"></v-progress-circular>
            Visualisierung wird gespeichert...
        </snackbar>

        <snackbar v-model="snackbarLoading">
            <v-progress-circular indeterminate class="indigo--text"></v-progress-circular>
            Visualisierung wird geladen...
        </snackbar>

        <v-snackbar v-model="snackbarExportDone" success>
            <v-icon>done</v-icon>
            Export erfolgreich!
        </v-snackbar>

        <v-snackbar v-model="snackbarSaveDone" :timeout="2000" success>
            <v-icon>done</v-icon>
            Erfolgreich gespeichert!
        </v-snackbar>

        <v-snackbar v-model="snackbarLoadDone" :timeout="2000" success>
            <v-icon>done</v-icon>
            Erfolgreich geladen!
        </v-snackbar>

        <v-snackbar v-model="snackbarExportFailed" error multiLine>
            <v-icon>error</v-icon>
            &nbsp;Export fehlgeschlagen!<br/>
            &nbsp;{{exportError}}
        </v-snackbar>

        <v-snackbar v-model="snackbarSaveFailed" error multiLine>
            <v-icon>error</v-icon>
            &nbsp;Speichern fehlgeschlagen!<br/>
            &nbsp;{{saveError}}
        </v-snackbar>

        <v-snackbar v-model="snackbarLoadFailed" error multiLine>
            <v-icon>error</v-icon>
            &nbsp;Laden fehlgeschlagen!<br/>
            &nbsp;{{loadError}}
        </v-snackbar>
    </div>
</template>

<script>
    import Konva from 'konva';
    import EventBus from '../helpers/EventBus';
    import PlayerObject from '../objects/PlayerObject';
    import TextObject from '../objects/TextObject';
    import PlayerContextMenu from '../menus/PlayerContext';
    import Snackbar from '../helpers/Snackbar';
    import RectangleObject from '../objects/RectangleObject';
    import EllipseObject from '../objects/EllipseObject';
    import LineObject from '../objects/LineObject';

    export default {
        name: 'document',
        props: ['document', 'activeComponent'],
        components: {
            PlayerContextMenu,
            Snackbar,
        },
        data() {
          return {
              showPlayerMenu: false,
              x: 0,
              y: 0,
              arrowStraightMode: false,
              arrowComplexMode: false,
              arrowComplexPoints: [],
              blockContainerClick: false,
              createRectMode: false,
              createCircleMode: false,
              createRectSecPoint: false,
              createCircleSecPoint: false,
              createLineMode: false,
              dragStart: null,
              dragStop: null,
              playerMenuRefresh: false,
              snackbarStraightArr: false,
              snackbarComplexArr: false,
              snackbarCreateRect: false,
              snackbarCreateCircle: false,
              snackbarCreateLine: false,
              snackbarExporting: false,
              snackbarExportDone: false,
              snackbarExportFailed: false,
              snackbarLoading: false,
              snackbarLoadDone: false,
              snackbarLoadFailed: false,
              snackbarSaving: false,
              snackbarSaveDone: false,
              snackbarSaveFailed: false,
              exportError: '',
              saveError: '',
              loadError: '',
              staticAssetDir: this.$electron.remote.getGlobal('staticDir'),
          };
        },
        methods: {
            addCircle() {
                const radiusX = (this.dragStop.x - this.dragStart.x) / 2;
                const radiusY = (this.dragStop.y - this.dragStart.y) / 2;
                const c = new EllipseObject(this.dragStart.x + radiusX, this.dragStart.y + radiusY,
                                        'Circle_' + this.document.newCircleCount,
                                        radiusX, radiusY);

                c.on('click', this.onSelectedObject);

                this.document.objects.add(c);
                this.document.objects.draw();

                this.document.newCircleCount++;
            },
            addPlayer() {
                const p = new PlayerObject(0, 0, 'Player ' + this.document.newPlayerCount);

                p.on('click', this.onSelectedObject);
                p.on('dragend', this.onPlayerDragEnd);

                this.document.objects.add(p);
                this.document.objects.draw();

                this.document.newPlayerCount++;
            },
            addLine() {
                const l = new LineObject(this.linePoints, 'Line_' +
                    this.document.newLineCount);
                l.on('click', this.onSelectedObject);

                this.document.objects.add(l);
                this.document.objects.draw();

                this.createLineMode = false;
                this.snackbarCreateLine = false;

                this.document.newLineCount++;
            },
            addRectangle() {
                const r = new RectangleObject(this.dragStart.x,
                    this.dragStart.y, this.dragStop.x - this.dragStart.x,
                    this.dragStop.y - this.dragStart.y,
                    'Rectangle_' + this.document.newRectCount);

                r.on('click', this.onSelectedObject);

                this.document.objects.add(r);
                this.document.objects.draw();

                this.document.newRectCount++;
            },
            addText() {
                const t = new TextObject(0, 0, 'Freitext', 'text' + this.document.newTextCount);

                t.on('click', this.onSelectedObject);
                this.document.objects.add(t);
                this.document.objects.draw();
                this.document.newTextCount++;
            },
            addStraightArrow() {
                this.snackbarStraightArr = false;
                if (!this.document.selectedObject || !this.dragStop) {
                    return;
                }

                this.document.selectedObject.addStraightArrow(this.dragStop);
            },
            addComplexArrow() {
                this.snackbarComplexArr = false;
                if (!this.document.selectedObject || !this.dragStop) {
                    return;
                }

                this.document.selectedObject.addComplexArrow(this.arrowComplexPoints,
                    this.arrowComplexPoints.pop()); // Last Point of the path is also the end
            },
            broadcast(selector) {
                EventBus.$emit(selector, null);
            },
            computePlayerCtxMenuPos(playerObj) {
                if (playerObj === null) {
                    console.error('PlayerCtxMenu: Parameter NULL!');
                    return;
                }

                const objPos = playerObj.getPosition();
                const objHeight = playerObj.baseHeight();
                this.x = (300 + objPos.x);
                this.y = (130 + objPos.y) - objHeight;
            },
            init(containerId) {
                this.document.stage = new Konva.Stage({
                    container: containerId,
                    width: window.innerWidth - 300,
                    height: window.innerHeight - 128,
                });

                if (this.document.wasLoaded) {
                    const bgImgObj = new Image();
                    bgImgObj.onload = () => {
                        this.document.background.get('#bgImage')[0].image(bgImgObj);
                        this.document.background.draw();
                    };
                    bgImgObj.src = this.staticAssetDir + '/FussballFeld.jpg';

                    const currObjects = this.document.objects.children;

                    for (let i = 0; i < currObjects.length; i++) {
                        if (currObjects[i] instanceof PlayerObject ||
                            currObjects[i] instanceof TextObject ||
                            currObjects[i] instanceof RectangleObject ||
                            currObjects[i] instanceof EllipseObject ||
                            currObjects[i] instanceof LineObject) {
                            currObjects[i].on('click', this.onSelectedObject);
                        }
                    }
                } else {
                    const bgImgObj = new Image();
                    bgImgObj.onload = () => {
                        const bgImg = new Konva.Image({
                            x: 0,
                            y: 0,
                            image: bgImgObj,
                            width: this.document.stage.getWidth(),
                            height: this.document.stage.getHeight(),
                            id: 'bgImage',
                            name: 'bgImage',
                        });

                        this.document.background.add(bgImg);
                        this.document.background.draw();
                    };
                    bgImgObj.src = this.staticAssetDir + '/FussballFeld.jpg';
                }

                this.document.stage.on('click', this.onContainerClick);
                this.document.stage.add(this.document.background);
                this.document.stage.add(this.document.objects);
                this.document.stage.draw();
            },
            removeArrowsOnSelection() {
                if (this.document.selectedObject instanceof PlayerObject) {
                    this.document.selectedObject.clearArrows();
                    this.document.objects.drawScene();
                }
            },
            saveImage(filePath, image) {
                const nativeImg = this.$electron.nativeImage.createFromDataURL(image);
                const fs = this.$electron.remote.require('fs');
                fs.writeFile(filePath, nativeImg.toJPEG(95), this.onSaveImageError);
            },
            onSaveImageError(err) {
                if (err) {
                    this.snackbarExporting = false;
                    this.exportError = err.message;
                    this.snackbarExportFailed = true;
                }

                this.snackbarExporting = false;
                this.snackbarExportDone = true;
            },
            onSelectedObject(ev) {
                const doc = this.document;

                this.arrowStraightMode = false;
                this.arrowComplexMode = false;
                this.createLineMode = false;

                if (doc.selectedObject !== null) {
                    doc.selectedObject.setNotSelected();
                    this.showPlayerMenu = false;
                }
                doc.selectedObject = ev.currentTarget;
                this.x = ev.evt.clientX;
                this.y = ev.evt.clientY;
                doc.selectedObject.setSelected();
                doc.objects.draw();

                if (doc.selectedObject instanceof PlayerObject) {
                    this.blockContainerClick = true;
                    ev.bubbles = false;
                    this.$nextTick(() => {
                        this.computePlayerCtxMenuPos(doc.selectedObject);
                        this.showPlayerMenu = true;
                        this.blockContainerClick = false;
                    });
                }
            },
            onAddStraightArrow() {
                this.arrowStraightMode = true;
                this.snackbarStraightArr = true;
            },
            onAddComplexArrow() {
                this.arrowComplexMode = true;
                this.snackbarComplexArr = true;
                this.arrowComplexPoints = [];
            },
            onAddLine() {
                this.createLineMode = true;
                this.snackbarCreateLine = true;
                this.linePoints = [];
            },
            onContainerClick(ev) {
                const cO = ev.target;
                const isP = cO instanceof Konva.Group;
                const isT = cO instanceof Konva.Text;
                const isR = cO instanceof Konva.Rect;
                const isC = cO instanceof Konva.Ellipse;
                const isL = cO instanceof Konva.Line;

                if (!isP && !isT && !isR && !isC && !isL) {
                    if (this.arrowStraightMode) {
                        this.dragStop = {
                            x: ev.evt.x - 300,
                            y: ev.evt.y - 128,
                        };
                        this.arrowStraightMode = false;
                        this.addStraightArrow();
                        return;
                    } else if (this.arrowComplexMode) {
                        this.dragStop = {
                            x: ev.evt.x - 300,
                            y: ev.evt.y - 128,
                        };
                        // If arrow complex mode we add this location as
                        // another path point
                        this.arrowComplexPoints.push({
                            x: ev.evt.x - 300,
                            y: ev.evt.y - 128,
                        });
                        return;
                    } else if (this.createRectMode) {
                        // createRectSecPoint determines whether this is
                        // the start point of the rectangle of the finishing one.
                        if (!this.createRectSecPoint) {
                            this.dragStart = {
                                x: ev.evt.x - 300,
                                y: ev.evt.y - 128,
                            };
                            this.createRectSecPoint = true;

                            return;
                        }

                        this.dragStop = {
                            x: ev.evt.x - 300,
                            y: ev.evt.y - 128,
                        };
                        this.createRectSecPoint = false;
                        this.createRectMode = false;
                        this.snackbarCreateRect = false;
                        this.addRectangle();

                        return;
                    } else if (this.createCircleMode) {
                        //
                        if (!this.createCircSecPoint) {
                            this.dragStart = {
                                x: ev.evt.x - 300,
                                y: ev.evt.y - 128,
                            };
                            this.createCircSecPoint = true;

                            return;
                        }

                        this.dragStop = {
                            x: ev.evt.x - 300,
                            y: ev.evt.y - 128,
                        };
                        this.createCircSecPoint = false;
                        this.createCircleMode = false;
                        this.snackbarCreateCircle = false;
                        this.addCircle();

                        return;
                    } else if (this.createLineMode) {
                        this.linePoints.push(ev.evt.x - 300);
                        this.linePoints.push(ev.evt.y - 128);
                    }

                    ev.evt.preventDefault();
                    this.showPlayerMenu = false;
                    this.x = 0;
                    this.y = 0;

                    if (this.document.selectedObject !== null && !this.blockContainerClick) {
                        this.document.selectedObject.setNotSelected();
                        this.document.selectedObject = null;
                        this.document.objects.draw();
                    }
                }
            },
            onPlayerDragEnd() {
                // When the player stops dragging the selected object, we must
                // recompute the position for the context menu
                this.$nextTick(function () {
                    this.computePlayerCtxMenuPos(this.document.selectedObject);
                });
            },
        },
        mounted() {
            window.setTimeout(() => { this.init(this.document.id + '-container'); }, 1000);

            EventBus.$on('edit:addPlayer', () => {
                const isActive  = (this.activeComponent === this.document.id);

                if (isActive) {
                    this.addPlayer();
                }
            });

            EventBus.$on('edit:addText', () => {
                const isActive  = (this.activeComponent === this.document.id);

                if (isActive) {
                    this.addText();
                }
            });

            EventBus.$on('edit:addRectangle', () => {
                const isActive = (this.activeComponent === this.document.id);

                if (isActive) {
                    this.dragStart = null;
                    this.dragStop = null;
                    this.createRectMode = true;
                    this.snackbarCreateRect = true;
                }
            });

            EventBus.$on('edit:addCircle', () => {
                const isActive = (this.activeComponent === this.document.id);

                if (isActive) {
                    this.dragStart = null;
                    this.dragStop = null;
                    this.createCircleMode = true;
                    this.snackbarCreateCircle = true;
                }
            });

            EventBus.$on('edit:addLine', () => {
                const isActive = (this.activeComponent === this.document.id);

                if (isActive) {
                    this.onAddLine();
                }
            });

            EventBus.$on('doc:redraw', () => {
                const isActive = (this.activeComponent === this.document.id);

                if (isActive) {
                    this.document.objects.draw();
                }
            });

            EventBus.$on('app:doExport', (filePath) => {
                const isActive  = (this.activeComponent === this.document.id);

                if (!isActive) {
                    return;
                }
                if (!filePath || filePath === '') {
                    return;
                }
                this.snackbarExporting = true;
                this.document.stage.toDataURL({
                   callback: imgUrl => this.saveImage(filePath, imgUrl),
                });
            });

            EventBus.$on('app:startSave', () => { this.snackbarSaving = true; });
            EventBus.$on('app:startLoad', () => { this.snackbarLoading = true; });
            EventBus.$on('app:loadSuccess', () => {
               this.snackbarLoading = false;
               this.snackbarLoadDone = true;
            });
            EventBus.$on('app:saveSuccess', () => {
                this.snackbarSaving = false;
                this.snackbarSaveDone = true;
            });
            EventBus.$on('app:loadError', (msg) => {
                this.snackbarLoading = false;
                this.loadError = msg;
                this.snackbarLoadFailed = true;
            });
            EventBus.$on('app:saveError', (msg) => {
                this.snackbarSaving = false;
                this.saveError = msg;
                this.snackbarSaveFailed = true;
            });
            EventBus.$on('edit:selClearArrows', () => {
                const isActive  = (this.activeComponent === this.document.id);

                if (isActive && this.document.selectedObject) {
                    this.removeArrowsOnSelection();
                }
            });
            EventBus.$on('edit:selDelete', () => {
                const isActive  = (this.activeComponent === this.document.id);

                if (isActive && this.document.selectedObject) {
                    this.showPlayerMenu = false;
                    this.document.selectedObject.setNotSelected();
                    this.document.selectedObject.destroy();
                    this.document.selectedObject = null;
                    this.document.objects.draw();
                }
            });
        },
        computed: {
            containerOffset: function containerOffset() {
                const bodyRect  = document.body.getBoundingClientRect();
                const cntRect   = this.$el.getBoundingClientRect();
                return { x: cntRect.left - bodyRect.left, y: cntRect.top - bodyRect.top };
            },
        },
    };

</script>

<style lang="scss">
    .document-container, canvas {
        border-bottom-right-radius: 8px!important;
    }

    .document-view {
        margin-left: 300px;
        width: calc(100% - 300px);
        height: calc(100vh - 130px);
        border-bottom-right-radius: 8px!important;
    }
</style>
