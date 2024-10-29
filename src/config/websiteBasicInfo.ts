import basicInfo from "@/config/basicInfo.ts";
import BasicInfo from "@/config/basicInfo.ts";

class WebsiteBasicInfo {

  private _websiteInfo: WebsiteBasicInfoEntity;

  constructor() {
    this._websiteInfo = {
      title: basicInfo.title,
      logo: basicInfo.logo,
      ico: basicInfo.ico,
      keywords: basicInfo.keywords,
      description: basicInfo.description,
      author: basicInfo.author,
      version: basicInfo.version,
      copyright: basicInfo.copyright,
    };
  }

  public getWebsiteInfo(): WebsiteBasicInfoEntity {
    return this._websiteInfo;
  }

  public getTitle(): string {
    return this._websiteInfo.title;
  }

  public getLogo(): string {
    return this._websiteInfo.logo;
  }

  public getIco(): string {
    return this._websiteInfo.ico;
  }

  public getKeywords(): string {
    return this._websiteInfo.keywords;
  }

  public getDescription(): string {
    return this._websiteInfo.description;
  }

  public getAuthor(): string {
    return this._websiteInfo.author;
  }

  public getVersion(): string {
    return this._websiteInfo.version;
  }

  public getCopyright(): string {
    return this._websiteInfo.copyright;
  }

  public setIco(ico: string): void {
    this._websiteInfo.ico = ico;
  }

  public setLogo(logo: string): void {
    this._websiteInfo.logo = logo;
  }

}

export default new WebsiteBasicInfo();
