import { LocalServerConfig, AppInfo, ClientInfo } from "../../model/DataModels";

export interface CommonState {
  showQrCodeDialog: boolean;
  navBarConfig: NavBarConfig;
  registerUrl: string;
  localServerConfig: LocalServerConfig;
  clientInfos: Array<ClientInfo>;
}

export interface NavBarConfig {
  leftItem: boolean;
  leftCallback: Function;
  rightItem: boolean;
  rightCallback: Function;
  title: string;
}

export interface AppState {
  appInfo: AppInfo;
}