<template>
    <v-navigation-drawer permanent clipped dark>
        <v-layout row class="h-100">
            <v-flex xs12 class="h-100">
                <v-form v-model="valid" @submit="submit">
                    <v-list class="h-100">
                        <v-list-tile>
                            <h5>Inspektor</h5>
                        </v-list-tile>
                        <!--
                            PlayerObject
                        -->
                        <v-list-tile v-if="selectedObject !== null && objectIsPlayer">
                                <v-text-field label="Name" v-bind:value="selectedObject.title()" v-on:input="val => { selectedObject.title(val) }" :rules="nameRules" :counter="15"></v-text-field>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsPlayer">
                                <label for="bg-color">
                                    Farbe: <input type="color" v-bind:value="selectedObject.baseColor()" v-on:input="ev => { selectedObject.baseColor(ev.target.value) }" id="bg-color" name="bg-color">
                                </label>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsPlayer">
                                <label for="txt-color">
                                    Textfarbe: <input type="color" v-bind:value="selectedObject.txtColor()" v-on:input="ev => { selectedObject.txtColor(ev.target.value) }" id="txt-color" name="txt-color">
                                </label>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsPlayer">
                                <v-btn color="warning" flat dark @click="broadcast('edit:selClearArrows')">
                                    <v-icon>delete</v-icon>Pfeile
                                </v-btn>
                                <v-btn color="error" flat dark @click="broadcast('edit:selDelete')">
                                    <v-icon>delete</v-icon>Objekt
                                </v-btn>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsPlayer">
                            <v-btn color="error" flat dark @click="selectedObject.moveUp(); broadcast('doc:redraw');">
                                <v-icon>flip_to_front</v-icon>Vorne
                            </v-btn>
                            <v-btn color="error" flat dark @click="selectedObject.moveDown(); broadcast('doc:redraw');">
                                <v-icon>flip_to_back</v-icon>Hinten
                            </v-btn>
                        </v-list-tile>
                        <!--
                            TextObject
                        -->
                        <v-list-tile v-if="selectedObject !== null && objectIsText">
                            <v-text-field label="ID" v-bind:value="selectedObject.pId()" v-on:input="val => { selectedObject.pId(val) }" :rules="nameRules" :counter="15"></v-text-field>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsText">
                            <v-text-field label="Text" v-bind:value="selectedObject.pText()" v-on:input="val => { selectedObject.pText(val) }" ></v-text-field>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsText">
                            <label for="txt-color-2">
                                Textfarbe: <input type="color" v-bind:value="selectedObject.txtColor()" v-on:input="ev => { selectedObject.txtColor(ev.target.value) }" id="txt-color-2" name="txt-color">
                            </label>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsText">
                            <v-slider v-bind:value="selectedObject.pFontSize()" v-on:input="val => { selectedObject.pFontSize(val) }" :step="2" min="12" max="96" snap thumb-label dark></v-slider>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsText">
                            <v-btn color="error" flat dark @click="selectedObject.moveUp(); broadcast('doc:redraw');">
                                <v-icon>flip_to_front</v-icon>Vorne
                            </v-btn>
                            <v-btn color="error" flat dark @click="selectedObject.moveDown(); broadcast('doc:redraw');">
                                <v-icon>flip_to_back</v-icon>Hinten
                            </v-btn>
                            <v-btn color="error" flat dark @click="broadcast('edit:selDelete')">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-list-tile>
                        <!--
                            RectangleObject
                        -->
                        <v-list-tile v-if="selectedObject !== null && objectIsRect">
                            <v-text-field label="ID" v-bind:value="selectedObject.pId()" v-on:input="val => { selectedObject.pId(val); }" :rules="nameRules" :counter="15"></v-text-field>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsRect">
                            <label for="txt-color-3">
                                Rechteckfarbe: <input type="color" v-bind:value="selectedObject.baseColor()" v-on:input="ev => { selectedObject.baseColor(ev.target.value); }" id="txt-color-3" name="txt-color">
                            </label>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsRect">
                            <v-btn color="error" flat dark @click="selectedObject.moveUp(); broadcast('doc:redraw');">
                                <v-icon>flip_to_front</v-icon>Vorne
                            </v-btn>
                            <v-btn color="error" flat dark @click="selectedObject.moveDown(); broadcast('doc:redraw');">
                                <v-icon>flip_to_back</v-icon>Hinten
                            </v-btn>
                            <v-btn color="error" flat dark @click="broadcast('edit:selDelete')">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-list-tile>
                        <!--
                            EllipseObject
                        -->
                        <v-list-tile v-if="selectedObject !== null && objectIsEllipse">
                            <v-text-field label="ID" v-bind:value="selectedObject.pId()" v-on:input="val => { selectedObject.pId(val); }" :rules="nameRules" :counter="15"></v-text-field>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsEllipse">
                            <label for="txt-color-4">
                                Rechteckfarbe: <input type="color" v-bind:value="selectedObject.baseColor()" v-on:input="ev => { selectedObject.baseColor(ev.target.value); }" id="txt-color-4" name="txt-color">
                            </label>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsEllipse">
                            Transparenz: &nbsp;
                            <v-slider v-bind:value="selectedObject.opacity()" v-on:input="val => { selectedObject.opacity(val) }" :step=".1" min="0.0" max="1.0" snap thumb-label dark></v-slider>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsEllipse">
                            <v-btn color="error" flat dark @click="selectedObject.moveUp(); broadcast('doc:redraw');">
                                <v-icon>flip_to_front</v-icon>Vorne
                            </v-btn>
                            <v-btn color="error" flat dark @click="selectedObject.moveDown(); broadcast('doc:redraw');">
                                <v-icon>flip_to_back</v-icon>Hinten
                            </v-btn>
                            <v-btn color="error" flat dark @click="broadcast('edit:selDelete')">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-list-tile>
                        <!--
                            LineObject
                        -->
                        <v-list-tile v-if="selectedObject !== null && objectIsLine">
                            <v-text-field label="ID" v-bind:value="selectedObject.pId()" v-on:input="val => { selectedObject.pId(val); }" :rules="nameRules" :counter="15"></v-text-field>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsLine">
                            <label for="line-color">
                                Linienfarbe: <input type="color" v-bind:value="selectedObject.baseColor()" v-on:input="ev => { selectedObject.baseColor(ev.target.value); }" id="line-color" name="line-color">
                            </label>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsLine">
                            Transparenz: &nbsp;
                            <v-slider v-bind:value="selectedObject.opacity()" v-on:input="val => { selectedObject.opacity(val) }" :step=".1" min="0.0" max="1.0" snap thumb-label dark></v-slider>
                        </v-list-tile>
                        <v-list-tile v-if="selectedObject !== null && objectIsLine">
                            <v-btn color="error" flat dark @click="selectedObject.moveUp(); broadcast('doc:redraw');">
                                <v-icon>flip_to_front</v-icon>Vorne
                            </v-btn>
                            <v-btn color="error" flat dark @click="selectedObject.moveDown(); broadcast('doc:redraw');">
                                <v-icon>flip_to_back</v-icon>Hinten
                            </v-btn>
                            <v-btn color="error" flat dark @click="broadcast('edit:selDelete')">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-list-tile>
                    </v-list>
                </v-form>
            </v-flex>
        </v-layout>
    </v-navigation-drawer>
</template>

<script>
    import EventBus from '../helpers/EventBus.js';
    import PlayerObject from '../objects/PlayerObject';
    import TextObject from '../objects/TextObject';
    import RectangleObject from '../objects/RectangleObject';
    import EllipseObject from '../objects/EllipseObject';
    import LineObject from '../objects/LineObject';

    export default {
        props: ['selectedObject'],
        data() {
          return {
              valid: false,
              nameRules: [
                  v => !!v || 'Name is required',
                  v => v.length <= 15 || 'Name must be less than 15 characters',
              ],
          };
        },
        methods: {
            broadcast(selector) {
                EventBus.$emit(selector, null);
            },
            submit(ev) {
              ev.preventDefault();
            },
        },
        computed: {
            objectIsPlayer: function objectIsPlayer() {
                return this.selectedObject instanceof PlayerObject;
            },
            objectIsText: function objectIsText() {
                return this.selectedObject instanceof TextObject;
            },
            objectIsRect: function objectIsRect() {
                return this.selectedObject instanceof RectangleObject;
            },
            objectIsEllipse: function objectIsEllipse() {
                return this.selectedObject instanceof EllipseObject;
            },
            objectIsLine: function objectIsLine() {
                return this.selectedObject instanceof LineObject;
            },
        },
    };

</script>

<style lang="scss">
    .navigation-drawer--permanent {
        margin-top: 130px !important;
        height: calc(100vh - 130px) !important;
    }

    .h-100 {
        height: 100%;
    }

    .navigation-drawer {
        border-bottom-left-radius: 8px;
    }
</style>