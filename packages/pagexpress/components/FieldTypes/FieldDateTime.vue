<template>
  <div class="field is-fullwidth">
    <label class="label">{{ label }}</label>
    <datepicker
      input-class="input"
      placeholder="Pick a date"
      :value="value"
      @selected="onChange"
    ></datepicker>
  </div>
</template>

<script>
export default {
  name: 'FieldDateTime',

  components: {
    Datepicker: () => import('vuejs-datepicker'),
  },

  props: {
    label: {
      type: String,
      required: true,
    },

    value: {
      type: String,
      default: null,
    },
  },

  methods: {
    onChange(value) {
      const date = new Date(value);

      this.$emit('update', date.toISOString());
    },
  },
};
</script>
