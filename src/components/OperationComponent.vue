<template>
  <div>
    <q-card flat>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          v-for="operation in operations"
          :key="operation.label"
          :name="operation.value"
          :label="operation.label"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel
          class="q-pa-none"
          v-for="operation in operations"
          :key="operation.label"
          :name="operation.value"
        >
          <div v-if="operation.value === constants.BUCKET_OPERATIONS" class="text-h6">
            <bucket-operation-component />
          </div>
          <div v-if="operation.value === constants.OBJECT_OPERATIONS" class="text-h6">
            <object-operations-component />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Operations } from 'src/helpers/operations';
import Constants from 'src/helpers/constatns'
import BucketOperationComponent from './s3-operations/BucketOperationComponent.vue';
import ObjectOperationsComponent from './s3-operations/ObjectOperationsComponent.vue';

export default defineComponent({
  components: {
    BucketOperationComponent,
    ObjectOperationsComponent
  },
  name: 'OperationComponent',
  setup() {
    return {
      constants: Constants,
      operations: Operations,
      tab: Operations[0].value
    }
  }
});
</script>
