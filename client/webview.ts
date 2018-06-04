import { LspItem } from './transform';

const header = `
<meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline'; script-src 'unsafe-inline'; style-src 'unsafe-inline';">
<style>
table { border: 2px solid #fff; }
td { vertical-align: top; }
pre { white-space: pre-wrap; }

.wrapper {
  display: flex;
  flex-flow: column;
}
.right { align-self: flex-end; }
.left, .right {
  width: 40vw;
}
</style>
`

const footer = `
</div>
<script>
(function () {
  window.addEventListener('message', event => {
    window.scrollTo(0,document.body.scrollHeight);
  });
}())
</script>
`

export const generateHTML = (items: LspItem[]) => {
  let html = `${header}<div class='wrapper'>`

  items.forEach(i => {
    if (i) {
      const className = i.msgKind === 'response' ? 'right' : 'left'
      html += `
<div class='${className}'>
  <table>
  <tr>
    <td>time</td>
    <td>${i.time}</td>
  </tr>
  <tr>
    <td>Kind</td>
    <td>${i.msgKind}</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>${i.msgType}</td>
  </tr>
  <tr>
    <td>Latency</td>
    <td>${i.msgLatency ? i.msgLatency : 'N/A'}</td>
  </tr>
  <tr>
    <td>Arguments</td>
    <td>
      <pre>
        <code>
${JSON.stringify(i.arg, null, 2)}
        </code>
      </pre>
    </td>
  </tr>
  </table>
</div>
`
    }
  })

  html += footer

  return html
}
