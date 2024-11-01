import { getPaletteColorByNumber, mixColor } from '@sa/color';
import { Card } from 'antd';
import { Outlet } from 'react-router-dom';
import { getDarkMode, getThemeSettings } from '@/store/slice/theme';
import Header from './modules/Header';

import bgUrl from "../../assets/imgs/bg.jpg";
import bgMbUrl from "../../assets/imgs/bg-1.9MB.jpg";
import bg484KbUrl from "../../assets/imgs/bg-484KB.jpg";
import bg269KbUrl from "../../assets/imgs/bg-269KB.jpg";

import "../../styles/css/login.css";
import NetworkStateUtil from "@/utils/networkStateUtil.ts";

const COLOR_WHITE = '#ffffff';

function useBgColor() {
  const darkMode = useAppSelector(getDarkMode);
  const { themeColor } = useAppSelector(getThemeSettings);

  const bgThemeColor = darkMode ? getPaletteColorByNumber(themeColor, 600) : themeColor;
  const ratio = darkMode ? 0.5 : 0.2;
  const bgColor = mixColor(COLOR_WHITE, themeColor, ratio);

  return {
    bgThemeColor,
    bgColor
  };
}

export function Component() {
  const { bgThemeColor, bgColor } = useBgColor();

  let backgroundImageUrl: any = null;
  let networkState: NetworkState = NetworkStateUtil.networkState();
  if (NetworkStateUtil.isOnline()) {
    // @ts-ignore
    if (networkState.networkStateRTT < 200) {
      backgroundImageUrl = bgUrl;
    } // @ts-ignore
    else if (networkState.networkStateRTT < 600) {
      backgroundImageUrl = bgMbUrl;
    } // @ts-ignore
    else if (networkState.networkStateRTT < 2200) {
      backgroundImageUrl = bg484KbUrl;
    } else {
      backgroundImageUrl = bg269KbUrl;
    }
  }
  return (
    <div
      className="relative size-full flex-center overflow-hidden bg"
      style={{ background: `url(${backgroundImageUrl}) no-repeat`, backgroundSize: "100% 100%" }}
    >
      <Card
        bordered={false}
        className="relative z-4 w-auto rd-12px opacity-75"
      >
        <div className="w-400px lt-sm:w-300px">
          <Header />
          <main className="pt-24px">
            <Outlet />
          </main>
        </div>
      </Card>
    </div>
  );
}
