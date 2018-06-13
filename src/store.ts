import Vue from 'vue'
import Vuex from 'vuex'
import { parseLSPLog } from '@/logparser';

Vue.use(Vuex)

export type MsgKind =
  | 'send-notification'
  | 'recv-notification'
  | 'send-request'
  | 'recv-request'
  | 'send-response'
  | 'recv-response'

export interface LspItem {
  time: string
  msg: string
  msgKind: MsgKind
  msgType: string
  msgId: string
  msgLatency: string
  arg: any
}
export type Filter =
  | 'a' // All
  | 'w' // Workspace
  | 't' // Text
  | 'd' // Diagnostics
  | 'l' // Language
export interface State {
  items: LspItem[]
  query: string
  filter: Filter
}

let items: LspItem[] = require('./lsp.json')

const defaultState: State = {
  items,
  query: '',
  filter: 'a'
}

export default new Vuex.Store({
  state: defaultState,
  mutations: {
    updateLog(state, rawLog: string) {
      const parsedLog = parseLSPLog(rawLog)
      items = parsedLog
      state.items = parseLSPLog(rawLog)
    },
    search(state, query: string) {
      state.query = query
      state.items = items.filter(item => {
        return itemShouldShow(item, state)
      })
    },
    updateFilter(state, filter) {
      state.filter = filter
      state.items = items.filter(item => {
        return itemShouldShow(item, state)
      })
    }
  },
  actions: {}
})

function itemShouldShow(item: LspItem, state: State) {
  return itemMatchesQuery(item, state.query) && itemMatchesFilter(item, state.filter)
}

function itemMatchesQuery(item: LspItem, query: string) {
  return item.msgType.toLowerCase().includes(query.toLowerCase())
}

function itemMatchesFilter(item: LspItem, filter: Filter) {
  const textSyncMsgTypes = [
    'textDocument/didOpen',
    'textDocument/didChange',
    'textDocument/willSave',
    'textDocument/willSaveWaitUntil',
    'textDocument/didSave',
    'textDocument/didClose'
  ]

  switch (filter) {
    case 'a':
      return true
    case 'w':
      return item.msgType.startsWith('workspace')
    case 't':
      return textSyncMsgTypes.indexOf(item.msgType) !== -1
    case 'd':
      return item.msgType === 'textDocument/publishDiagnostics'
    case 'l':
      return item.msgType.startsWith('textDocument') && textSyncMsgTypes.indexOf(item.msgType) === -1 
  }
}
