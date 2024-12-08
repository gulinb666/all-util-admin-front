import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Form, Image, Input, Skeleton, Space } from 'antd';
import { useLogin } from '@/hooks/common/login';
import { getCaptcha } from '@/service/api/captcha.ts';
import type { FlatResponseData } from '~/packages/axios';
import StringUtil from '@/utils/stringUtil.ts';
import CodeEnum from '@/enum/codeEnum.ts';
import CookieUtil from '@/utils/cookieUtil.ts';

import imageVerifyCodeError from '@/assets/imgs/imageVerifyCodeError.png';

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
    src: '',
    codeId: ''
  });

  const [imageVerifyCodeLoading, setImageVerifyCodeLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false); // 控制图像是否加载

  function getImageVerifyCode(): void {
    setImageVerifyCodeLoading(true);
    setImageLoaded(false); // 重置图像加载状态

    const codeId: string | null = CookieUtil.getCookie(CodeEnum.CODE_ID);
    let imageVerifyCodeId: string = '';

    if (codeId != null && StringUtil.isNotEmpty(codeId)) {
      imageVerifyCodeId = codeId;
    }

    getCaptcha(imageVerifyCodeId)
      .then((res: FlatResponseData<Api.Captcha.Captcha>): void => {
        if (res.data != null) {
          setImageVerifyCode(res.data);
          CookieUtil.setCookie(CodeEnum.CODE_ID, res.data.codeId, res.data.expireTime, res.data.timeUnit);
          setImageLoaded(true); // 成功加载图像
        }
      })
      .catch(() => {
        setImageLoaded(false); // 加载失败保持为未加载
      })
      .finally(() => {
        setImageVerifyCodeLoading(false);
      });
  }

  useEffect(() => {
    getImageVerifyCode();
  }, []);

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
          <Flex align={'center'}>
            <Input
              count={{ show: true, max: 6 }}
              maxLength={6}
              placeholder="请输入图形验证码"
              allowClear={true}
              className="inputCode"
            />
            {imageVerifyCodeLoading ? (
              <Skeleton.Image
                active={true}
                className="code"
                style={{ width: "90%", height: 50, marginLeft: 5 }}
              />
            ) : (
              <>
                {imageLoaded ? (
                  <Image
                    src={imageVerifyCode.src}
                    alt={imageVerifyCode.codeId}
                    className="code"
                    preview={false}
                    title="看不清楚？点我换一张！"
                    fallback={imageVerifyCodeError}
                    onClick={getImageVerifyCode}
                    onError={() => setImageLoaded(false)} // 加载失败时更新状态
                  />
                ) : (
                  <Image
                    src={imageVerifyCodeError} // 显示错误图像
                    alt="错误图像"
                    className="code"
                    preview={false}
                  />
                )}
              </>
            )}
            <Button
              type="link"
              className="refreshCode"
              onClick={getImageVerifyCode}
            >
              看不清楚？点我换一张！
            </Button>
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
