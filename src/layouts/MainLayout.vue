<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <!--<q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />-->
        <q-toolbar-title>
          <b>AWS </b>
          <span class="text-body1">
            S3 Explorer
          </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!--<q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
// import EssentialLink from 'components/EssentialLink.vue'
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'MainLayout',
  // components: { EssentialLink },
  setup() {
    // const leftDrawerOpen = ref(false);
    // const essentialLinks = ref(linksData);

    // return {leftDrawerOpen, essentialLinks}
  }
});
</script>
