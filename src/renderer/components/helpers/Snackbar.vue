<script>
    import {
        VSlideYTransition,
        VSlideYReverseTransition,
    } from 'vuetify';

    import Contextualable from 'vuetify/src/mixins/contextualable';
    import Toggleable from 'vuetify/src/mixins/toggleable';

    export default {
        name: 'snackbar',
        components: {
            VSlideYTransition,
            VSlideYReverseTransition,
        },
        mixins: [Contextualable, Toggleable],
        data() {
            return {
                activeTimeout: {},
            };
        },
        props: {
            absolute: Boolean,
            bottom: Boolean,
            left: Boolean,
            multiLine: Boolean,
            right: Boolean,
            top: Boolean,
            disableTimeout: Boolean,
            timeout: {
                type: Number,
                default: 6000,
            },
            vertical: Boolean,
        },
        computed: {
            classes() {
                return {
                    'snack': true,
                    'snack--active': this.isActive,
                    'snack--absolute': this.absolute,
                    'snack--bottom': this.bottom || !this.top,
                    'snack--left': this.left,
                    'snack--multi-line': this.multiLine && !this.vertical,
                    'snack--right': this.right,
                    'snack--top': this.top,
                    'snack--vertical': this.vertical,
                    'primary': this.primary,
                    'secondary': this.secondary,
                    'success': this.success,
                    'info': this.info,
                    'warning': this.warning,
                    'error': this.error,
                };
            },
            computedTransition() {
                return this.top ? 'v-slide-y-transition' : 'v-slide-y-reverse-transition';
            },
        },
        watch: {
            isActive() {
                if (!this.disableTimeout) {
                    this.setTimeout();
                }
            },
        },
        methods: {
            setTimeout() {
                clearTimeout(this.activeTimeout);

                if (this.isActive && this.timeout) {
                    this.activeTimeout = setTimeout(() => {
                        this.isActive = false;
                    }, this.timeout);
                }
            },
        },
        mounted() {
            if (!this.disableTimeout) {
                this.setTimeout();
            }
        },
        render(h) {
            const children = [];

            if (this.isActive) {
                children.push(h('div', {
                    'class': 'snack__content',
                }, this.$slots.default));
            }

            return h('div', {
                'class': this.classes,
                on: this.$listeners,
            }, [h(this.computedTransition, children)]);
        },
    };
</script>

<style lang="stylus" src="vuetify/src/stylus/components/_snackbars.styl"></style>
<style lang="scss">
    .snack__content {
        background-color: #424242;
    }
</style>
