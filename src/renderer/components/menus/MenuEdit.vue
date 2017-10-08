<template>
    <v-menu offset-y>
        <v-btn dark slot="activator">Bearbeiten</v-btn>
        <v-list>
            <v-list-tile v-for="item in items" :key="item.title" @click="">
                <v-list-tile-title v-on:click="broadcast(item.selector)">{{ item.title }}</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-menu>
</template>

<script>
    import EventBus from '../helpers/EventBus.js';

    export default {
        data() {
            return {
                items: [
                { title: 'Rückgängig', selector: 'edit:undo' },
                { title: 'Wiederholen', selector: 'edit:redo' },
                { title: 'Entfernen', selector: 'edit:remove' },
                {
                    title: 'Hinzufügen',
                    submenu: [
                        { title: 'Spieler', selector: 'edit:addPlayer' },
                        { title: 'Freitext', selector: 'edit:addText' },
                    ],
                },
                { title: 'Dokument-Einstellungen', selector: 'edit:doc-settings' },
            ],
            };
        },
        methods: {
            broadcast(selector) {
                EventBus.$emit(selector, null);
            },
        },
};
</script>