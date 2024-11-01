interface NetworkState {
  networkStateType: string;
  /**
   * ms
   */
  networkStateRTT?: number;
  /**
   * Mb/s
   */
  networkStateDownLink?: number;
}
