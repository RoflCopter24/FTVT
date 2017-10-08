<template>
    <v-menu offset-y>
        <v-btn dark slot="activator">Datei<v-icon right>arrow_drop_down</v-icon></v-btn>
        <v-list>
            <div v-for="item in items" :key="item.title">
                <v-list-tile v-if="item.title" @click="">
                    <v-list-tile-title v-on:click="broadcast(item.selector)">{{ item.title }}</v-list-tile-title>
                </v-list-tile>
                <v-divider v-else></v-divider>
            </div>
        </v-list>
    </v-menu>
</template>

<script>
    import EventBus from '../helpers/EventBus.js';

    export default {
        data() {
            return {
                items: [
                { title: 'Neu', selector: 'doc:new' },
                { title: 'Öffnen', selector: 'doc:open' },
                { title: 'Speichern', selector: 'doc:save' },
                { title: 'Speichern unter', selector: 'doc:saveAs' },
                { title: 'Schließen', selector: 'doc:close' },
                {},
                { title: 'Exportieren', selector: 'doc:export' },
                {},
                { title: 'Beenden', selector: 'app:quit' },
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