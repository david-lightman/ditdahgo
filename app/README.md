# README

## About

This is the official Wails Vanilla template.

You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

The app now lets you enter a signaling server URL in the connection panel. If left blank in a bound call,
the Go backend falls back to the `SIGNAL_SERVER_URL` environment variable and then to `http://localhost:8080`.

## Building

To build a redistributable, production mode package, use `wails build`.
