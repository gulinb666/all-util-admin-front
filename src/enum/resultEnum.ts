enum ResultEnum {

  NETWORK_ERROR = "未连接网络，请连接网络后重试",

  BACKEND_NO_START_ERROR = "服务器未启动，请联系站点管理员咨询",

  TIME_OUT_ERROR = "请求超时，请稍后重试",

  THE_CURRENT_NUMBER_OF_VISITORS_IS_LARGE = "工聚小助手太火爆惹，请耐心等一会儿～如遇长时间等待可刷新重试",

  LOADING_TEXT = "工聚小助手正在全力加载中，请稍等片刻～"

}

export default ResultEnum;
