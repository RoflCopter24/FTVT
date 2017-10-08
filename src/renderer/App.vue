<template>
    <div id="app">
        <v-app dark toolbar>
            <v-system-bar window fixed style="-webkit-app-region: drag; -webkit-user-select: none;">
                <div v-if="!isMacOS" style="-webkit-app-region: no-drag;">
                    <file-menu></file-menu>
                    <edit-menu></edit-menu>
                </div>
                <v-spacer></v-spacer>
                {{title}}
                <v-spacer></v-spacer>
                <div style="-webkit-app-region: no-drag;">
                    <v-icon class="window-btn-minimize" @click="winMinimize">remove</v-icon>
                    <v-icon class="window-btn-maximize" @click="winMaximize">check_box_outline_blank</v-icon>
                    <v-icon class="window-btn-close" @click="winClose">close</v-icon>
                </div>
            </v-system-bar>
            <v-tabs dark v-model="active">
                <toolbar></toolbar>
                <v-tabs-bar class="indigo">
                    <v-tabs-item v-for="doc in documents" :key="doc.id" :href="'#' + doc.id" ripple> {{ doc.title }}</v-tabs-item>
                    <v-tabs-slider class="cyan"></v-tabs-slider>
                </v-tabs-bar>
                <v-tabs-items>
                    <v-tabs-content v-for="doc in documents" :key="doc.id" :id="doc.id">
                        <main>
                            <hierarchy-view :selected-object="doc.selectedObject"></hierarchy-view>
                            <document-view :document.sync="doc" :active-component="active"></document-view>
                        </main>
                    </v-tabs-content>
                </v-tabs-items>
            </v-tabs>
        </v-app>
    </div>
</template>

<script>
  import WelcomeView from '@/components/views/WelcomeView';
  import DocumentView from '@/components/views/DocumentView';
  import HierarchyView from '@/components/views/HierarchyView';
  import Toolbar from '@/components/menus/Toolbar';
  import FileMenu from '@/components/menus/MenuFile';
  import EditMenu from '@/components/menus/MenuEdit';

  export default {
    name: 'test-project',
      props: ['documents', 'settings', 'active', 'isMacOS'],
    components: {
        WelcomeView,
        DocumentView,
        HierarchyView,
        Toolbar,
        FileMenu,
        EditMenu,
    },
    data: () => ({
      title: 'FTVT',
    }),
    methods: {
        winMinimize() {
            this.$electron.remote.getCurrentWindow().minimize();
        },
        winMaximize() {
            const currWin = this.$electron.remote.getCurrentWindow();
            if (currWin.isMaximized()) {
                currWin.unmaximize();
                return;
            }
            currWin.maximize();
        },
        winClose() {
            this.$electron.remote.getCurrentWindow().close();
        },
    },
  };
</script>

<style lang="stylus">
  @import './assets/stylus/main.styl'
</style>


<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  /* Global CSS */
    $window-border-radius: 8px;


    html, #app {
        border-radius: $window-border-radius;
    }

    html,body {
        overflow-y: hidden;
        background-color: transparent;
    }

    .tabs {
        height: calc(100vh - 32px);

        .tabs__items, .tabs__content {
            height: 100%;
        }
    }

    main {
        height:100%;
    }

    .window-btn {
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: #c5cae9;
        }
    }

    .window-btn-minimize {
        @extend .window-btn;
    }

    .window-btn-maximize {
        @extend .window-btn;
    }

    .window-btn-close {
        @extend .window-btn;
    }

    .system-bar {
        border-top-left-radius: $window-border-radius;
        border-top-right-radius: $window-border-radius;

        div {
            border-radius: 0;
        }
    }

    .tabs, .tabs__items, .tabs__content {
        border-bottom-left-radius: $window-border-radius;
        border-bottom-right-radius: $window-border-radius;
    }

</style>
