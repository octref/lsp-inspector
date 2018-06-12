<template>
  <span class="msg" :class="item.msgKind" @click="toggleArg">
    <div>
      <font-awesome-icon class="fa-icon" icon="comment" v-if="item.msgKind === 'send-request'" />
      <font-awesome-icon class="fa-icon" icon="comment-alt" v-if="item.msgKind === 'send-notification'" />
      <font-awesome-icon class="fa-icon" icon="comment" v-if="item.msgKind === 'send-response'" />

      <span class="msg-type" v-if="isLeft">
        {{ item.msgType }}
      </span>

      <span class="msg-timestamp">{{ timestampOrLatency }}</span>

      <span class="msg-type" v-if="!isLeft">
        {{ item.msgType }}
      </span>

      <font-awesome-icon class="fa-icon" icon="comment" transform="flip-h" v-if="item.msgKind === 'recv-response'" />
      <font-awesome-icon class="fa-icon" icon="comment-alt" tranform="flip-h" v-if="item.msgKind === 'recv-notification'" />
      <font-awesome-icon class="fa-icon" icon="comment" transform="flip-h" v-if="item.msgKind === 'recv-request'" />
    </div>
    <message-detail :item="item" v-if="this.expanded"></message-detail>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import MessageDetail from '@/components/MessageDetail.vue'

export default Vue.extend({
  name: 'message',
  components: {
    FontAwesomeIcon,
    MessageDetail
  },
  props: ['item'],
  data() {
    return {
      expanded: false
    }
  },
  computed: {
    isLeft() {
      return this.item.msgKind === 'send-request' || this.item.msgKind === 'send-notification' || this.item.msgKind === 'send-response'
    },
    timestampOrLatency() {
      return this.item.msgKind === 'recv-response' || this.item.msgKind === 'send-response'
        ? this.item.msgLatency
        : this.item.time;
    }
  },
  methods: {
    toggleArg() {
      this.expanded = !this.expanded
    }
  }
})
</script>

<style scoped>
.msg {
  font-family: 'Input Mono';
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 10px 20px;
}
.msg-timestamp {
  color: #e8a1a1;
  font-size: 10px;
}

.send-request,
.send-notification,
.send-response {
  align-self: flex-start;
  text-align: left;
}
.recv-response,
.recv-notification,
.recv-request {
  align-self: flex-end;
  text-align: right;
}

.send-request,
.recv-response {
  color: #1c791cbd;
}
.send-notification,
.recv-notification {
  color: #bb9911de;
}
.recv-request,
.send-response {
  color: #356fa5f7;
}

/**
 * Hover / Expand
 */

.msg {
  transition: background-color 0.1s ease-in;
}
.msg:hover {
  background-color: rgba(221, 221, 221, 0.3);
}
</style>
