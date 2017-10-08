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

        <snackbar v-model="snackbarExporting">
            <v-progress-circular indeterminate class="indigo--text"></v-progress-circular>
            Wird exportiert...
        </snackbar>

        <v-snackbar v-model="snackbarExportDone" success>
            <v-icon>done</v-icon>
            Export erfolgreich!
        </v-snackbar>

        <v-snackbar v-model="snackbarExportFailed" error multiLine>
            <v-icon>error</v-icon>
            &nbsp;Export fehlgeschlagen!<br/>
            &nbsp;{{exportError}}
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
              dragStart: null,
              dragStop: null,
              playerMenuRefresh: false,
              snackbarStraightArr: false,
              snackbarComplexArr: false,
              snackbarExporting: false,
              snackbarExportDone: false,
              snackbarExportFailed: false,
              exportError: '',
          };
        },
        methods: {
            addPlayer() {
                const p = new PlayerObject(0, 0, 'Player ' + this.document.newPlayerCount);

                p.on('click', this.onSelectedObject);
                p.on('dragend', this.onPlayerDragEnd);
                this.document.objects.add(p);
                this.document.objects.draw();

                this.document.newPlayerCount++;
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
                    this.arrowComplexPoints.pop());
            },
            broadcast(selector) {
                EventBus.$emit(selector, null);
            },
            computePlayerCtxMenuPos(playerObj) {
                const objPos = playerObj.getAbsolutePosition();
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

                this.document.stage.on('click', this.onContainerClick);

                if (this.document.wasLoaded) {
                    const bgImgObj = new Image();
                    bgImgObj.onload = () => {
                        this.document.background.get('#bgImage')[0].image(bgImgObj);
                        this.document.background.draw();
                    };
                    bgImgObj.src = '/static/FussballFeld.jpg';
                } else {
//                    const rect = new Konva.Rect({
//                        x: 0,
//                        y: 0,
//                        width: this.document.stage.getWidth(),
//                        height: this.document.stage.getHeight(),
//                        fill: 'green',
//                        stroke: 'black',
//                        strokeWidth: 1,
//                    });
//                    this.document.background.add(rect);

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
                    bgImgObj.src = '/static/FussballFeld.jpg';
                }

                this.document.stage.add(this.document.background);
                this.document.stage.add(this.document.objects);
                this.document.stage.draw();
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
                    this.$nextTick(function () {
                        this.computePlayerCtxMenuPos(doc.selectedObject);
                        this.showPlayerMenu = true;
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
            onContainerClick(ev) {
                const cO = ev.target;
                const isP = cO instanceof Konva.Circle;
                const isT = cO instanceof Konva.Text;

                if (!isP && !isT) {
                    if (this.arrowStraightMode) {
                        this.dragStop = {
                            x: ev.evt.x - 300,
                            y: ev.evt.y - 128,
                        };
                        console.log(this.dragStop);
                        this.arrowStraightMode = false;
                        this.addStraightArrow();
                        return;
                    } else if (this.arrowComplexMode) {
                        // If arrow complex mode we add this location as
                        // another path point
                        this.arrowComplexPoints.push({
                            x: ev.evt.x - 300,
                            y: ev.evt.y - 128,
                        });
                        return;
                    }

                    ev.evt.preventDefault();
                    this.showPlayerMenu = false;
                    this.x = 0;
                    this.y = 0;
                    if (this.document.selectedObject !== null) {
                        this.document.selectedObject.setNotSelected();
                        this.document.selectedObject = null;
                        this.document.objects.draw();
                    }
                }
            },
            onPlayerDragEnd() {
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
