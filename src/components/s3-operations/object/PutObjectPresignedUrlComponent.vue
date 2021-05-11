<template>
  <div>
    <q-form @submit.prevent="getPutSignedUrl">
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
        <p class="input-label q-my-xs">Bucket Name
          <span class="text-red">*</span>
        </p>
        <q-input
          input-class="text-standout-input"
          standout="bg-accent"
          type="text"
          v-model="getPutURLObjectForm.bucket"
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
          v-model="getPutURLObjectForm.key"
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
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs q-pb-md">
        <p class="input-label q-my-xs">ACL
          <span class="text-red">*</span>
        </p>
        <q-select
          standout="bg-accent"
          input-class="text-standout-input"
          class="text-standout-input"
          v-model="getPutURLObjectForm.acl"
          :options="aclOptions"
          options-selected-class="text-secondary"
        >
          <template v-slot:prepend>
            <q-icon class="text-standout-input" name="lock" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="text-right">
        <q-btn
          type="submit"
          color="secondary"
          label="Generate URL"
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
  name: 'PutObjectPresignedUrlComponent',
  setup() {
    const aclOptions = [
      'authenticated-read',
      'aws-exec-read',
      'bucket-owner-full-control',
      'bucket-owner-read',
      'private',
      'public-read',
      'public-read-write'
    ]
    return {
      getPutURLObjectForm: ref({
        bucket: '',
        key: '',
        acl: 'private'
      }),
      presignedUrl: '',
      aclOptions: ref(aclOptions)
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
    getPutSignedUrl() {
      this.$q.loading.show()
      this.presignedUrl = ''
      this.$store.dispatch('s3Store/getPutSignedUrl', this.getPutURLObjectForm)
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
