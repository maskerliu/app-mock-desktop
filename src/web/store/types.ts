import { LocalServerConfig, ClientInfo } from "../../model/DataModels";

export interface CommonState {
  showQrCodeDialog: boolean;
  registerUrl: string;
  localServerConfig: LocalServerConfig;
  clientInfos: Array<ClientInfo>;
}
