<template>
  <div
    v-if="!hidden"
    class="field-wrapper"
    :class="{
      'basis-full': ['html', 'image', 'list'].includes(fieldType),
      [cssClass]: cssClass,
    }"
  >
    <FieldText
      v-if="fieldType === 'text'"
      :label="label"
      :options="options"
      :value="value || null"
      @update="update"
    />

    <FieldHtml
      v-if="fieldType === 'html'"
      :label="label"
      :value="value || null"
      @update="update"
    />

    <FieldList
      v-if="fieldType === 'list'"
      :label="label"
      :options="options"
      :values="value || []"
      @update="update"
    />

    <FieldBoolean
      v-if="fieldType === 'boolean'"
      :label="label"
      :value="value || false"
      @update="update"
    />

    <FieldClientImage
      v-if="fieldType === 'client-image'"
      :label="label"
      :value="value || undefined"
      :component-name="componentName"
      @update="update"
    />

    <FieldImage
      v-if="fieldType === 'image'"
      :label="label"
      :value="value || undefined"
      @update="update"
    />

    <FieldGallery
      v-if="fieldType === 'gallery'"
      :label="label"
      :value="value || undefined"
      @update="update"
    />

    <FieldHeader
      v-if="fieldType === 'header'"
      :label="label"
      :value="value || undefined"
      @update="update"
    />

    <FieldDateTime
      v-if="fieldType === 'datetime'"
      :label="label"
      :value="value || undefined"
      @update="update"
    />
  </div>
</template>

<script>
import {
  FieldBoolean,
  FieldClientImage,
  FieldDateTime,
  FieldGallery,
  FieldHeader,
  FieldHtml,
  FieldImage,
  FieldList,
  FieldText,
} from './FieldTypes';

export default {
  name: 'Field',

  components: {
    FieldBoolean,
    FieldClientImage,
    FieldDateTime,
    FieldGallery,
    FieldHeader,
    FieldHtml,
    FieldImage,
    FieldList,
    FieldText,
  },

  props: {
    cssClass: {
      type: String,
      default: '',
    },

    fieldType: {
      type: String,
      required: true,
    },

    hidden: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      required: true,
    },

    value: {
      type: [String, Array, Boolean, Object],
      default: null,
    },

    options: {
      type: Array,
      default: () => [],
    },

    placeholder: {
      type: String,
      default: '',
    },

    update: {
      type: Function,
      required: true,
    },

    componentName: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="postcss" scoped>
.field-wrapper {
  &:not(:last-of-type) {
    padding-bottom: var(--spacing);
  }

  &:last-of-type {
    .field {
      margin-bottom: 0;
    }
  }
}
</style>
