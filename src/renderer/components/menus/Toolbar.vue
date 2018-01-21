<template>
    <v-toolbar class="indigo" dense>
        <v-btn flat @click="broadcast('edit:addPlayer')">
            <v-icon>directions_run</v-icon>
            Spieler
        </v-btn>
        <v-btn flat @click="broadcast('edit:addText')">
            <v-icon>text_fields</v-icon>
            Freitext
        </v-btn>
        <v-btn flat @click="broadcast('edit:addRectangle')">
            <v-icon>add_box</v-icon>
            Rechteck
        </v-btn>
        <v-btn flat @click="broadcast('edit:addCircle')">
            <v-icon>add_circle</v-icon>
            Kreis
        </v-btn>
        <v-btn flat @click="broadcast('edit:addLine')">
            <v-icon>add</v-icon>
            Linie
        </v-btn>
        <v-btn flat @click="broadcast('edit:addBall')">
            <v-icon-soccer>soccer</v-icon-soccer>
            Fussball
        </v-btn>
    </v-toolbar>
</template>

<script>
import EventBus from '../helpers/EventBus.js';
import VIconSoccer from '../helpers/v-icon-soccer';

export default {
    components: { VIconSoccer },
    methods: {
        broadcast(selector) {
            EventBus.$emit(selector, null);
        },
    },
};
</script>