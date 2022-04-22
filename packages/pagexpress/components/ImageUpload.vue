<template>
  <div class="flex flex-col w-full justify-center mb-8">
    <div class="rounded-lg shadow-xl bg-gray-50 lg:w-full">
      <div class="m-4">
        <label class="inline-block mb-2 text-gray-500">
          Upload Images (jpg,png,svg,jpeg)
        </label>
        <div class="flex items-center justify-center w-full">
          <label
            class="
              flex flex-col
              w-full
              h-32
              border-4 border-dashed
              hover:bg-gray-100
              hover:border-gray-300
            "
          >
            <div class="flex flex-col items-center justify-center pt-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clip-rule="evenodd"
                />
              </svg>
              <p
                class="
                  pt-1
                  text-sm
                  tracking-wider
                  text-gray-400
                  group-hover:text-gray-600
                "
              >
                Select a photos
              </p>
            </div>
            <input
              ref="input"
              type="file"
              multiple
              class="opacity-0"
              @change="triggerUpload"
            />
          </label>
        </div>
      </div>
    </div>
    <progress v-if="uploadPercentage > 0" class="w-full" max="100" :value.prop="uploadPercentage"></progress>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',

  props: {
    upload: {
      type: Function,
      required: true,
    }
  },

  data() {
    return {
      uploadPercentage: {
        type: Number,
        default: 0,
      },
    };
  },

  methods: {
    triggerUpload() {
      const images = this.$refs.input.files;

      if (images && images.length) {
        this.upload({
          images,
          progressCb: this.updateUploadsProgress
        });
      }
    },

    updateUploadsProgress(event) {
      this.uploadPercentage = parseInt(
        Math.round(( event.loaded / event.total ) * 100)
      );

      if (this.uploadPercentage === 100) {
        setTimeout(() => {
          this.uploadPercentage = 0;
        }, 3000);
      }
    },
  }
};
</script>
