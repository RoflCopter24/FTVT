<template>
    <v-card light v-show="visible" id="player-menu">
        <v-card-actions>
            <v-btn icon flat class="indigo--text" @click="onAddStraightArrow"><v-icon>arrow_forward</v-icon></v-btn>
            <v-btn icon flat class="indigo--text" @click="onAddComplexArrow"><v-icon>redo</v-icon></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        name: 'PlayerContextMenu',
        props: ['visible', 'position', 'onAddStraightArrow', 'onAddComplexArrow'],
        methods: {
            updatePos: function ux() {
                this.$el.style.left = (this.position.x - (this.width / 2)) + 'px';
                this.$el.style.top = (this.position.y - (this.height / 2)) + 'px';

                console.log(this.width, this.height);
            },
        },
        mounted: function m() {
            this.$el.style.height = '52px';
            this.$el.style.width = '96px';
            this.$watch('position', function () {
                this.updatePos();
            });
        },
        updated: function u() {
            this.$el.style.position = 'fixed';
            this.$el.style.left = this.position.x;
            this.$el.style.top = this.position.y;
            this.updatePos();
        },
        computed: {
            width() {
                const width = window.getComputedStyle(document.getElementById('player-menu')).width;
                return (width !== 'auto') ? parseInt(width.split('px')[0], 10) : 0;
            },
            height() {
                const height = window.getComputedStyle(document.getElementById('player-menu')).height;
                return (height !== 'auto') ? parseInt(height.split('px')[0], 10) : 0;
            },
        },
    };
</script>

<style lang="scss">

</style>