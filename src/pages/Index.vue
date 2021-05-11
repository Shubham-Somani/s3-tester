<template>
  <q-page>
    <!-- 
      **** Configuration Section ****
    -->
    <div class="row">
      <configuration-component v-if="!isS3Init"/>
      <!-- 
        **** On S3 Initialisation Complete ****
      -->
      <div class="row justify-around full-width q-pa-sm bg-grey-3" v-else>
        <h6 class="display-inline-block no-margin text-positive"> Initialisation Done </h6>
        <q-btn
          class="display-inline-block"
          color="secondary"
          @click.prevent="changeInitStatus"
          label="Edit Configuration"
        />
      </div>
    </div>
    <!-- 
      **** S3 Actions Section ****
    -->
    <div>
      <operation-component v-if="isS3Init"/>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import OperationComponent from 'src/components/OperationComponent.vue';
import ConfigurationComponent from 'src/components/ConfigurationComponent.vue';
import { mapGetters } from 'vuex'
export default defineComponent({
  name: 'Home',
  components: { 
    ConfigurationComponent,
    OperationComponent 
  },
  computed: {
    ...mapGetters({
      isS3Init: 's3Store/getS3InitStatus'
    })
  },
  methods: {
    changeInitStatus () {
      this.$store.commit('s3Store/CHANGE_INIT_S3', !this.isS3Init)
    }
  }
});
</script>
