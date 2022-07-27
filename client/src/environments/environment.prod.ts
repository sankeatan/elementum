export const environment = {
  production: true,
  title: "Prod",
  serverURL: "https://hogbod.dev",
  IoConnectionOptions: {
    reconnectionDelay: 100,
    reconnection: true,
    reconnectionAttemps: 100,
    transports: ['websocket', 'polling']
  }
}
