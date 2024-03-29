import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import  '@tarojs/async-await'
import dva from './utils/dva'
import {Provider} from '@tarojs/redux';

import models from './models/models';

import {global} from "./utils/common";
const regeneratorRuntime = require('regenerator-runtime/runtime');
global.regeneratorRuntime = regeneratorRuntime;



const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();


import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true
  }

  componentDidMount = async ()=> {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        traceUser: true
      })
    }
    const referrerInfo = this.$router.params.referrerInfo;
    const query = this.$router.params.query;
    !global.extraData && (global.extraData = {});
    // @ts-ignore
    if (referrerInfo && referrerInfo.extraData) {
      // @ts-ignore
      global.extraData = referrerInfo.extraData;
    }
    if (query) {
      global.extraData = {
        ...global.extraData,
        // @ts-ignore
        ...query
      };
    }
    // 获取设备信息
    const sys = await Taro.getSystemInfo();
    if (sys) {
      global.windowWidth = sys.windowWidth;
      global.windowHeight = sys.windowHeight
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index/>
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
