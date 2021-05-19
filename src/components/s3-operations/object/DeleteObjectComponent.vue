<template>
  <div>
    <q-form @submit.prevent="deleteObject" ref="deleteObjectForm">
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
        <p class="input-label q-my-xs">Bucket Name
          <span class="text-red">*</span>
        </p>
        <q-input
          input-class="text-standout-input"
          standout="bg-accent"
          type="text"
          v-model="deleteObjectFormParams.bucket"
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
          v-model="deleteObjectFormParams.key"
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
          label="Delete Object"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
export default defineComponent({
  name: 'DeleteObjectComponent',
  setup() {
    return {
      deleteObjectFormParams: ref({
        bucket: '',
        key: ''
      })
    }
  },
  methods: {
    deleteObject() {
      this.$q.loading.show()
      this.$store.dispatch('s3Store/deleteObject', this.deleteObjectFormParams)
        .then((resp: { message: string }) => {
          this.$q.loading.hide()
          this.$q.notify({ position: 'bottom', message: resp.message, color: 'positive' });
          this.deleteObjectFormParams = {
            bucket: '',
            key: ''
          };
          (this.$refs.deleteObjectForm as Vue & { resetValidation: () => boolean }).resetValidation()
        })
        .catch((err: string) => {
          console.log(err)
          this.$q.loading.hide()
          this.$q.notify({ position: 'top', message: err, color: 'negative' })
        })
    }
  }
});
</script>
