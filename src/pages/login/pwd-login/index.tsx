import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Flex, Form, Image, Input, Skeleton, Space, Spin} from 'antd';
import {useLogin} from '@/hooks/common/login';
import {getCaptcha} from "@/service/api/captcha.ts";
import {FlatResponseData} from "~/packages/axios";
import StringUtil from "@/utils/stringUtil.ts";
import CodeEnum from "@/enum/codeEnum.ts";
import CookieUtil from "@/utils/cookieUtil.ts";
import {useRouter} from "~/packages/simple-router";

type AccountKey = 'super' | 'admin' | 'user';
interface Account {
  key: AccountKey;
  label: string;
  userName: string;
  password: string;
}

type LoginParams = Pick<Account, 'userName' | 'password'>;

export function Component() {
  const { toggleLoginModule } = useRouterPush();
  const { t } = useTranslation();
  const { loading, toLogin } = useLogin();
  const { formRules } = useFormRules();
  const [pwdLogin] = Form.useForm<PwdLogin>();

  const [imageVerifyCode, setImageVerifyCode] = useState({
    src: "",
    codeId: ""
  });

  const [ imageVerifyCodeLoading, setImageVerifyCodeLoading ] = useState(true);

  function getImageVerifyCode(): void {
    setImageVerifyCodeLoading(true);
    let codeId: string | null = CookieUtil.getCookie(CodeEnum.CODE_ID);
    let imageVerifyCodeId: string = "";
    if (codeId != null) {
      if (StringUtil.isNotEmpty(codeId)) {
        imageVerifyCodeId = codeId;
      }
    }
    getCaptcha(imageVerifyCodeId)
      .then((res: FlatResponseData<Api.Captcha.Captcha>): void => {
        if (res.data != null) {
          setImageVerifyCode(res.data);
          CookieUtil.setCookie(CodeEnum.CODE_ID, res.data.codeId, res.data.expireTime, res.data.timeUnit);
        }
      })
      .finally(() => {
        setImageVerifyCodeLoading(false);
      });
  }

  useEffect(() => {
    getImageVerifyCode();
  }, []);

  const router = useRouter();

  async function handleSubmit() {
    const params: PwdLogin = await pwdLogin.validateFields();
    // toLogin()
  }

  useKeyPress('enter', () => {
    handleSubmit();
  });

  function handleAccountLogin(account: Account) {
    toLogin(account);
  }

  const accounts: Account[] = [
    // 这里填充账户信息
  ];

  return (
    <>
      <h3 className="text-18px text-primary font-medium">{t('page.login.pwdLogin.title')}</h3>
      <Form
        className="pt-24px"
        form={pwdLogin}
      >
        <Form.Item
          rules={formRules.userName}
          name="userName"
        >
          <Input
            placeholder="请输入用户名"
            allowClear={true}
          />
        </Form.Item>

        <Form.Item
          rules={formRules.pwd}
          name="password"
        >
          <Input.Password
            autoComplete="password"
            placeholder="请输入密码"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item
          rules={formRules.imageVerifyCode}
          name="imageVerify"
        >
          <Flex align={"center"}>
            <Input
              count={{
                show: true,
                max: 6
              }}
              maxLength={6}
              placeholder="请输入图形验证码"
              allowClear={true}
            />
            {
              imageVerifyCodeLoading
              ?
              (
                <Skeleton.Image
                  active={true}
                  className="code"
                />
              )
              :
              (
                <Image
                  src={imageVerifyCode.src}
                  alt={imageVerifyCode.codeId}
                  className="code"
                  placeholder={true}
                  preview={false}
                  title='看不清楚？点我换一张！'
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                  onClick={getImageVerifyCode}
                />
              )
            }
            <Button type='link' className='refreshCode' onClick={getImageVerifyCode}>看不清楚？点我换一张！</Button>
          </Flex>
        </Form.Item>
        <Space
          direction="vertical"
          className="w-full"
          size={24}
        >
          <div className="flex-y-center justify-between">
            <Checkbox>记住我</Checkbox>

            <Button
              type="text"
              onClick={() => toggleLoginModule('reset-pwd')}
            >
              忘记密码？
            </Button>
          </div>
          <Button
            type="primary"
            size="large"
            loading={loading}
            shape="round"
            onClick={handleSubmit}
            block
          >
            确认登录
          </Button>
          <div className="flex-y-center justify-between gap-12px">
            <Button
              className="flex-1"
              block
              onClick={() => toggleLoginModule('email-code-login')}
            >
              邮箱验证码登录
            </Button>
            <Button
              className="flex-1"
              block
              onClick={() => toggleLoginModule('phone-code-login')}
            >
              短信验证码登录
            </Button>
          </div>
        </Space>
      </Form>
    </>
  );
}
