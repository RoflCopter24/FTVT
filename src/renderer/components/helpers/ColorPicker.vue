<template>
    <div class="color-picker" ref="colorpicker">
        <input type="text" :style="'background-color: ' + colorValue" class="form-control" v-model="colorValue"
               @focus="showPicker()" @input="updateFromInput"/>
        <v-color-picker class="color-picker-popup" :value="colors" @input="updateFromPicker" v-if="displayPicker"/>
    </div>
</template>

<script>
    /* eslint-disable */
    import Picker from 'vue-color/src/components/Chrome';

    export default {
        name: 'color-picker',
        components: {
            'v-color-picker': Picker,
        },
        props: ['color'],
        data() {
            return {
                colors: {
                    hex: '#000000',
                },
                colorValue: '',
                displayPicker: false,
            };
        },
        mounted() {
            this.setColor(this.color || '#000000');
        },
        methods: {
            setColor(color) {
                this.updateColors(color);
                this.colorValue = color;
            },
            updateColors(color) {
                if (color.slice(0, 1) === '#') {
                    this.colors = {
                        hex: color,
                    };
                } else if (color.slice(0, 4) === 'rgba') {
                    let rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(','),
                        hex = '#' + ((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1);
                    this.colors = {
                        hex: hex,
                        a: rgba[3],
                    }
                }
            },
            showPicker() {
                document.addEventListener('click', this.documentClick);
                this.displayPicker = true;
            },
            hidePicker() {
                document.removeEventListener('click', this.documentClick);
                this.displayPicker = false;
            },
            togglePicker() {
                this.displayPicker ? this.hidePicker() : this.showPicker();
            },
            updateFromInput() {
                this.updateColors(this.colorValue);
            },
            updateFromPicker(color) {
                this.colors = color;
                if (color.rgba.a === 1) {
                    this.colorValue = color.hex;
                } else {
                    this.colorValue = 'rgba(' + color.rgba.r + ', ' + color.rgba.g + ', ' + color.rgba.b + ', ' + color.rgba.a + ')';
                }
            },
            documentClick(e) {
                const el = this.$refs.colorpicker,
                    target = e.target;
                if (!el) {
                    this.hidePicker();
                    return;
                }
                if (el !== target && !el.contains(target)) {
                    this.hidePicker();
                }
            },
        },
        watch: {
            colorValue(val) {
                if (val) {
                    this.updateColors(val);
                    this.$emit('input', val);
                }
            },
            color() {
                this.setColor(this.color || '#000000');
            }
        },
    };
</script>

<style scoped>
    .color-picker-popup {
        position: fixed;
        left: calc(50px);
        z-index: 9999;

        color: black !important;
    }
</style>