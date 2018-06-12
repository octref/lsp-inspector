import { LspItem } from './store'

export function parseLSPLog(input: string): LspItem[] {
  const logs = input.split('\n\n\n')

  const arr: LspItem[] = []
  logs
    .filter(l => {
      return l.startsWith('[Trace')
    })
    .forEach(l => {
      const parsed = parseRawLog(l)
      if (parsed) {
        arr.push(parsed)
      }
    })

  return arr
}

function parseRawLog(log: string) {
  const rawLogs = log.split('\n')

  const [trace, firstLineJson] = rawLogs

  const reTrace = /\[Trace - (.*)\] (.*)/
  const reJsonFirstLine = /(Params|Result): (.*)/

  if (trace.match(reTrace) && firstLineJson.match(reJsonFirstLine)) {
    const [time, msg] = reTrace.exec(trace).slice(1)
    const [jsonIdentifier, restOfFirstLineJson] = reJsonFirstLine.exec(firstLineJson).slice(1)
    const parsedArg = JSON.parse([restOfFirstLineJson, ...rawLogs.slice(2)].join('\n'))

    return {
      time,
      msg,
      ...extractMsg(msg),
      arg: parsedArg
    }
  }
}

function extractMsg(msg: string) {
  let msgKind

  if (msg.startsWith('Sending notification')) {
    msgKind = 'send-notification'
  } else if (msg.startsWith('Received notification')) {
    msgKind = 'recv-notification'
  } else if (msg.startsWith('Sending request')) {
    msgKind = 'send-request'
  } else if (msg.startsWith('Received request')) {
    msgKind = 'recv-request'
  } else if (msg.startsWith('Sending response')) {
    msgKind = 'send-response'
  } else if (msg.startsWith('Received response')) {
    msgKind = 'recv-response'
  } else {
    return null;
  }

  const reSendNotification = /Sending notification '(.*)'/
  const reRecvNotification = /Received notification '(.*)'/
  const reSendRequest = /Sending request '(.*) - \((\d+)\)'/
  const reRecvRequest = /Received request '(.*) - \((\d+)\)'/
  const reSendResponse = /Sending response '(.*) - \((\d+)\)'.*took (\d+ms)/
  const reRecvResponse = /Received response '(.*) - \((\d+)\)' in (\d+ms)/

  let msgType, msgId, msgLatency
  if (msgKind === 'send-notification') {
    ;[msgType] = reSendNotification.exec(msg).slice(1)
  } else if (msgKind === 'recv-notification') {
    ;[msgType] = reRecvNotification.exec(msg).slice(1)
  } else if (msgKind === 'send-request') {
    ;[msgType, msgId] = reSendRequest.exec(msg).slice(1)
  } else if (msgKind === 'recv-request') {
    ;[msgType, msgId] = reRecvRequest.exec(msg).slice(1)
  } else if (msgKind === 'send-response') {
    ;[msgType, msgId, msgLatency] = reSendResponse.exec(msg).slice(1)
  } else if (msgKind === 'recv-response') {
    ;[msgType, msgId, msgLatency] = reRecvResponse.exec(msg).slice(1)
  } else {
    return null;
  }

  return {
    msgKind,
    msgType,
    msgId,
    msgLatency
  }
}
