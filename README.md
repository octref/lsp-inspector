# MOVED to https://github.com/Microsoft/language-server-protocol-inspector

---

# LSP Inspector

### Running

- `yarn`
- `yarn serve`

### Demo

http://lsp-inspector.surge.sh

- A log file (log from html Language Server) is loaded by default
- You can collect other logs and load them. For example:
  - Set `css.trace.server: "verbose"`
  - Copy everything inside `CSS Language Server` channel into a log file `css.log`
  - Load it from the web app
- You can try it on a real-world log file, `./logs/vetur.log`. It contains 330k lines of log generated from 10 minutes of usage.