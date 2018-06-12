<template>
  <div class="file-picker">
    <p>
      Set [languageId].trace.server: "verbose" -> Copy log into a file -> Load it here
    </p>
    <input type="file" @change="handleFiles">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    handleFiles(e) {
      const reader = new FileReader()
      const store = this.$store
      reader.onload = () => {
        store.commit('updateLog', reader.result)
      }

      reader.readAsText(e.target.files[0])
    }
  }
})
</script>

<style>
.file-picker {
  margin-bottom: 24px;
}
</style>
