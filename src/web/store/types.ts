export interface CommonState {
  showQrCodeDialog: boolean;
  registerUrl: string;
  localServerConfig: {
    serverIP: string;
    proxyHttpPort: number;
    proxySocketPort: number;
  };
}
