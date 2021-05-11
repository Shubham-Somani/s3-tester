<template>
  <div>
    <q-form @submit.prevent="createBucket" ref="createBucketForm">
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
        <p class="input-label q-my-xs">Bucket Name
          <span class="text-red">*</span>
        </p>
        <q-input
          input-class="text-standout-input"
          standout="bg-accent"
          type="text"
          v-model="createBucketForm.bucket"
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
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs q-pb-md">
        <p class="input-label q-my-xs">ACL
          <span class="text-red">*</span>
        </p>
        <q-select
          standout="bg-accent"
          input-class="text-standout-input"
          class="text-standout-input"
          v-model="createBucketForm.acl"
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
      <div class="q-pt-lg text-right">
        <q-btn
          color="secondary"
          type="submit"
          label="Create Bucket"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'CreateBucketComponent',
  setup() {
    return {
      createBucketForm: ref({
        bucket: '',
        acl: 'private'
      }),
      aclOptions: [
        'authenticated-read',
        'private',
        'public-read',
        'public-read-write'
      ]
    }
  },
  methods: {
    createBucket() {
      this.$q.loading.show()
      this.$store.dispatch('s3Store/createBucket', this.createBucketForm)
        .then((resp: { message: string }) => {
          this.$q.loading.hide()
          if (resp)
           this.$q.notify({ position: 'bottom', message: resp.message, color: 'positive' })
           this.createBucketForm = {
             bucket: '',
             acl: 'private'
           };
           (this.$refs.createBucketForm as Vue & { resetValidation: () => boolean }).resetValidation()
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
