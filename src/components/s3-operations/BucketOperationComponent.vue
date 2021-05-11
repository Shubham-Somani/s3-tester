<template>
  <div>
    <q-card flat>
      <q-tabs
        v-model="bucketTab"
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

      <q-tab-panels v-model="bucketTab" animated>
        <q-tab-panel
          class="q-px-sm"
          v-for="operation in operations"
          :key="operation.label"
          :name="operation.value"
        >
          <create-buckets-component v-if="operation.value === constants.CREATE_BUCKET" />
          <list-buckets-component v-if="operation.value === constants.LIST_BUCKET" />
          <delete-bucket-component v-if="operation.value === constants.DELETE_BUCKET" />
        </q-tab-panel>
      </q-tab-panels>

    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { BucketOperations } from 'src/helpers/operations';
import Constants from 'src/helpers/constatns'
import DeleteBucketComponent from './bucket/DeleteBucketComponent.vue';
import ListBucketsComponent from './bucket/ListBucketsComponent.vue';
import CreateBucketsComponent from './bucket/CreateBucketsComponent.vue';

export default defineComponent({
  components: {
    DeleteBucketComponent,
    ListBucketsComponent,
    CreateBucketsComponent,
  },
  name: 'BucketOperationComponent',
  setup() {
    return {
      constants: Constants,
      operations: BucketOperations,
      bucketTab: BucketOperations[0].value
    }
  }
});
</script>
