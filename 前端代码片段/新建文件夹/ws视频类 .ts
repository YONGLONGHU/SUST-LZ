export class ReconnectingWebSocket {
  url: string;
  msgCb: (this: WebSocket, ev: MessageEvent<any>) => any;
  websocket: WebSocket | null;
  isReconnecting: boolean;
  reconnectInterval: number;
  isManualClose: boolean;

  constructor({
    url,
    msgCb
  }: {
    url: string;
    msgCb: (this: WebSocket, ev: MessageEvent<any>) => any;
  }) {
    this.url = url;
    this.msgCb = msgCb;
    this.websocket = null;
    this.isReconnecting = false;
    this.reconnectInterval = 1000; // 重连间隔时间，单位：毫秒
    this.isManualClose = false; // 是否是手动关闭连接
  }

  connect() {
    this.websocket = new WebSocket(this.url);

    this.websocket.onopen = () => {
      this.isReconnecting = false;
      this.isManualClose = false;
    };

    this.websocket.onmessage = this.msgCb;

    this.websocket.onclose = () => {
      if (!this.isReconnecting && !this.isManualClose) {
        this.reconnect();
      }
    };

    this.websocket.onerror = () => {
      if (!this.isReconnecting && !this.isManualClose) {
        this.reconnect();
      }
    };
  }

  send(message: any) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(message);
    } else {
      console.error(
        "WebSocket not connected. Unable to send message:",
        message
      );
    }
  }

  close() {
    this.isManualClose = true; // 标记为手动关闭
    if (this.websocket) {
      this.websocket.close();
    }
  }

  reconnect() {
    this.isReconnecting = true;
    console.log("Reconnecting...");

    // 尝试重新连接
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }
}
