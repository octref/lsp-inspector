export interface LspItem {
  time: string;
  msg: string;
  msgKind: string;
  msgType: string;
  msgId: string;
  msgLatency: string;
  arg: any;
}

export function transform(input: string): LspItem[] {
  const logs = input.split('\n\n\n')

  return logs
    .filter(l => {
      return l.startsWith('[Trace')
    })
    .map(parseRawLog)
}

function parseRawLog(log: string) {
  const rawLogs = log.split('\n')

  const [trace, firstLineJson] = rawLogs

  const reTrace = /\[Trace - (.*)\] (.*)\./
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
    msgKind = 'notification'
  } else if (msg.startsWith('Sending request')) {
    msgKind = 'request'
  } else {
    msgKind = 'response'
  }

  const reNotification = /Sending notification '(.*)'/
  const reRequest = /Sending request '(.*) - \(\d+\)'/
  const reResponse = /Received response '(.*) - \(\d+\)' in (\d+)ms/

  let msgType, msgId, msgLatency
  if (msgKind === 'notification') {
    [msgType] = reNotification.exec(msg).slice(1)
  } else if (msgKind === 'request') {
    [msgType, msgId] = reRequest.exec(msg).slice(1)
  } else {
    [msgType, msgId, msgLatency] = reResponse.exec(msg).slice(1)
  }

  return {
    msgKind,
    msgType,
    msgId,
    msgLatency
  }
}
