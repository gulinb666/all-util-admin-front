import ThemeSchemaSwitch from '@/components/stateful/ThemeSchemaSwitch';
import WebsiteBasicInfo from "@/config/websiteBasicInfo.ts";
import {Image} from "antd";

const Header = memo(() => {
  const { t } = useTranslation();

  return (
    <header className="flex-y-center justify-between">
      <Image
        width={60}
        height={60}
        preview={false}
        src={WebsiteBasicInfo.getLogo()}
      ></Image>
      <h3 className="text-28px text-primary font-500 lt-sm:text-22px">{WebsiteBasicInfo.getTitle()}</h3>
      <div className="i-flex-col">
        <ThemeSchemaSwitch
          showTooltip={false}
          className="text-20px lt-sm:text-18px"
        />
      </div>
    </header>
  );
});

export default Header;
