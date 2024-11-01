class NetworkStateUtil {

  /**
   * 检测是否连接网络
   * @return {boolean} 连接上了网络返回true，否则返回false
   */
  public static isOnline(): boolean | Boolean {
    let isOnline: boolean = false;
    if (navigator.onLine) {
      isOnline = true;
    }
    return isOnline;
  }

  /**
   * 获取网络状态信息
   * @return {NetworkState} 返回网络状态信息
   */
  public static networkState(): NetworkState {
    // @ts-ignore
    let networkState: any = navigator.connection;
    let networkStateInfo: NetworkState = {
      networkStateType: ""
    };
    if (NetworkStateUtil.isOnline()) {
      networkStateInfo = {
        networkStateType: networkState.effectiveType,
        networkStateRTT: networkState.rtt,
        networkStateDownLink: networkState.downlink
      };
    } else {
      networkStateInfo = {
        networkStateType: "offline",
      }
    }
    return networkStateInfo;
  }

}

export default NetworkStateUtil;
