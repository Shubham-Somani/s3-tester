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
          <get-object-component v-if="operation.value === constants.GET_OBJECT" />
          <list-object-component v-if="operation.value === constants.LIST_OBJECT" />
          <upload-object-component v-if="operation.value === constants.UPLOAD_OBJECT" />
          <get-object-presigned-url-component v-if="operation.value === constants.GENERATE_GET_PRESIGNED_URL" />
          <delete-object-component v-if="operation.value === constants.DELETE_OBJECT" />
          <put-object-presigned-url-component v-if="operation.value === constants.GENERATE_PUT_PRESIGNED_URL" />
        </q-tab-panel>
      </q-tab-panels>

    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { ObjectOperations } from 'src/helpers/operations';
import Constants from 'src/helpers/constatns';
import ListObjectComponent from './object/ListObjectComponent.vue';
import GetObjectComponent from './object/GetObjectComponent.vue';
import GetObjectPresignedUrlComponent from './object/GetObjectPresignedUrlComponent.vue';
import PutObjectPresignedUrlComponent from './object/PutObjectPresignedUrlComponent.vue';
import UploadObjectComponent from './object/UploadObjectComponent.vue';
import DeleteObjectComponent from './object/DeleteObjectComponent.vue';

export default defineComponent({
  name: 'ObjectOperationsComponent',
  components: {
    ListObjectComponent,
    GetObjectComponent,
    GetObjectPresignedUrlComponent,
    PutObjectPresignedUrlComponent,
    UploadObjectComponent,
    DeleteObjectComponent
  },
  setup() {
    return {
      constants: Constants,
      operations: ObjectOperations,
      bucketTab: ObjectOperations[0].value
    }
  }
});
</script>
