import * as path from 'path'

import { ExtensionContext, OutputChannel } from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient'
import * as vscode from 'vscode'
import { transform } from './transform'
import { generateHTML } from './webview';

export function activate(context: ExtensionContext) {
  const serverModule = context.asAbsolutePath(path.join('server', 'dist', 'serverMain.js'))
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6006'] }

  let output = ''
  const fooChannel = {
    name: 'foo',
    append(value: string) {
      output += value
      updateWebview()
    },
    appendLine(value: string) {
      output += value + '\n'
      updateWebview()
    },
    clear() {
      output = ''
    },
    show() {
      console.log(output)
    }
  }

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'markdown' },
      { scheme: 'untitled', language: 'markdown' }
    ],
    outputChannel: fooChannel as OutputChannel,
    synchronize: {
      configurationSection: []
    }
  }

  const client = new LanguageClient('mls', 'Markdown Language Server', serverOptions, clientOptions)

  const disposable = client.start()
  context.subscriptions.push(disposable)

  let panel: vscode.WebviewPanel
  vscode.commands.registerCommand('lspView.open', () => {
    if (!panel) {
      panel = vscode.window.createWebviewPanel('lspView', 'LSP View', 2, {
        enableScripts: true,
        retainContextWhenHidden: true
      })
    } else {
      panel.reveal()
    }

    updateWebview()
  })

  function updateWebview() {
    if (panel) {
      const outputObject = transform(output)

      // const html = `<pre><code>${JSON.stringify(outputObject, null, 2)}</code></pre>`
      const html = generateHTML(outputObject)
      panel.webview.html = html
      panel.webview.postMessage('scroll')
    }
  }
}
