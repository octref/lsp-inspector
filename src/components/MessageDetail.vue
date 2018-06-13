<template>
  <div class="msg-detail">
    <b>{{ this.item.msgType }}</b>
    <pre>
      <code>{{ JSON.stringify(item.arg, null, 2) }}</code>
    </pre>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['item'],
  computed: {
  }
})
</script>

<style>
.msg-detail {
  border: 1px solid #eee;
  padding: 20px;
  font-size: 12px;
  text-align: left;
}

pre {
  text-align: left;
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;

  white-space: normal;
  text-align: left;
  overflow: auto;
  overflow-wrap: break-word;
  border-radius: 6px;
}
code {
  white-space: pre-wrap;
  font-family: 'Input Mono', Menlo, Monaco, 'Courier New', monospace !important;
  font-size: 12px;
  border-radius: 2px;
  padding: 0.2rem 0.3rem;
}
</style>
