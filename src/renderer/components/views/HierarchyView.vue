<template>
    <v-navigation-drawer permanent clipped dark>
        <v-layout row class="h-100">
            <v-flex xs12 class="h-100">
                <v-form v-model="valid" @submit="submit">
                    <v-list class="h-100">
                        <v-list-tile>
                            <h5>Inspektor</h5>
                        </v-list-tile>
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