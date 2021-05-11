<template>
  <div>
    <q-form @submit.prevent="getSignedUrl">
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
        <p class="input-label q-my-xs">Bucket Name
          <span class="text-red">*</span>
        </p>
        <q-input
          input-class="text-standout-input"
          standout="bg-accent"
          type="text"
          v-model="getURLObjectForm.bucket"
          placeholder="Bucket Name"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Bucket name is required',
          ]"
        >
          <template v-slot:prepend>
            <q-icon class="text-standout-input" name="fas fa-box-open" />
          </template>
        </q-input>
      </div>
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
        <p class="input-label q-my-xs">Object Path (key)
          <span class="text-red">*</span>
        </p>
        <q-input
          input-class="text-standout-input"
          standout="bg-accent"
          type="text"
          v-model="getURLObjectForm.key"
          placeholder="Object Path"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Object path is required',
          ]"
        >
          <template v-slot:prepend>
            <q-icon class="text-standout-input" name="fas fa-box-open" />
          </template>
        </q-input>
      </div>
      <div class="text-right">
        <q-btn
          type="submit"
          color="secondary"
          label="Get URL"
        />
      </div>
    </q-form>
    <q-card @click.prevent="copyUrl" v-if="this.presignedUrl" flat class="bg-grey-3 q-mt-md">
      <q-card-section class="text-right q-py-xs">
        <q-btn flat icon="content_copy" />
      </q-card-section>
      <q-card-section class="q-pb-md q-pt-none overflow-auto">
        <pre class="no-margin text-body2 text-blue">{{ this.presignedUrl }}</pre>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { copyToClipboard } from 'quasar';

export default defineComponent({
  name: 'GetObjectPresignedUrlComponent',
  setup() {
    return {
      getURLObjectForm: ref({
        bucket: 'pwazabbit',
        key: 'icons/icon-512x512.png'
      }),
      presignedUrl: ''
    }
  },
  methods: {
    copyUrl() {
      copyToClipboard(this.presignedUrl)
        .then(() => {
          this.$q.notify({ position: 'bottom', message: 'URL copied to clipboard', color: 'positive' })
        })
        .catch(() => {
          // fail
        })
    },
    getSignedUrl() {
      this.$q.loading.show()
      this.presignedUrl = ''
      this.$store.dispatch('s3Store/getSignedUrl', this.getURLObjectForm)
        .then((resp: string) => {
          this.$q.loading.hide()
          this.presignedUrl = resp
        })
        .catch((err: string) => {
          console.log(err)
          this.$q.loading.hide()
          this.$q.notify({ position: 'bottom', message: err, color: 'negative' })
        })
    }
  }
});
</script>
