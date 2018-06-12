<template>
  <div class="home">
    <file-picker></file-picker>
    <filter-bar></filter-bar>
    <search-bar></search-bar>
    <message-list></message-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FilePicker from '@/components/FilePicker.vue'
import FilterBar from '@/components/FilterBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import MessageList from '@/components/MessageList.vue'

export default Vue.extend({
  name: 'home',
  components: {
    FilePicker,
    MessageList,
    FilterBar,
    SearchBar
  },
});
</script>

<style>
.home {
  margin-bottom: 60px;
}

</style>

