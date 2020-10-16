const conf = {
  client: {
    host: process.env.REACT_APP_CLIENT_HOST,
    ip: process.env.REACT_APP_CLIENT_IP,
    port: process.env.REACT_APP_CLIENT_PORT
  },
  server: {
    host: process.env.REACT_APP_SERVER_HOST,
    ip: process.env.REACT_APP_SERVER_IP,
    port: process.env.REACT_APP_SERVER_PORT,
    url: `https://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}`,
    socketUrl: `wss://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}`
  }
}

export default conf
