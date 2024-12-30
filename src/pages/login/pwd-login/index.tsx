import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Form, Image, Input, Skeleton, Space } from 'antd';
import { useLogin } from '@/hooks/common/login';
import {getCaptcha, verifyImageVerifyCode} from '@/service/api/captcha.ts';
import type { FlatResponseData } from '~/packages/axios';
import StringUtil from '@/utils/stringUtil.ts';
import CodeEnum from '@/enum/codeEnum.ts';
import CookieUtil from '@/utils/cookieUtil.ts';

import imageVerifyCodeError from '@/assets/imgs/imageVerifyCodeError.png';
import {adminLogin, getAdminInfoByToken} from "@/service/api/admin.ts";
import {windows} from "rimraf";
import TimeUnitEnum from "@/enum/timeUnitEnum.ts";
import DateUtil from "@/utils/dateUtil.ts";
import {router} from "@/router";
import {localStg} from "@/utils/storage.ts";
import {getRole} from "@/service/api/role.ts";
import {getMenuList} from "@/service/api/menu.ts";

interface Account {
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
    let codeKey: string = CookieUtil.getCookie(CodeEnum.CODE_ID);
    if (StringUtil.isEmpty(codeKey)) {
      window.$message?.error("图形验证码已过期，请重新获取");
      getImageVerifyCode();
      return;
    }
    let verifyImageCode: FlatResponseData<Api.Captcha.VerifyCaptcha> = await verifyImageVerifyCode(codeKey, params.imageVerify);
    if (verifyImageCode.response.data.code !== 1000) {
      getImageVerifyCode();
      return;
    }
    let data: Api.Admin.Admin = {
      username: params.username,
      password: params.password
    };
    let adminLoginResult: FlatResponseData<Api.Admin.Admin> = await adminLogin(data);
    let response = adminLoginResult.response.data;
    if (response.code === 1000) {
      // 获取用户的角色信息
      let getAdminInfoByTokenResult: FlatResponseData = await getAdminInfoByToken();
      let res = getAdminInfoByTokenResult.response.data;
      if (res.code === 1000) {
        localStg.set("userInfo", res.data);
      }
      let roleId: string = res.data.roleId;
      getRole(roleId)
        .then((result: FlatResponseData<Api.Role.Role>): void => {
          let information = result.response.data;
          if (information.code === 1000) {
            getMenuList()
              .then((menuResult: FlatResponseData<Api.Menu.Menu>): void => {
                let menuRes = menuResult.response.data;
                if (menuRes.code === 1000) {
                  window.$notification?.success({
                    message: "欢迎登录",
                    description: `${res.data.nickname}${DateUtil.getTimeGreeting()}`
                  });
                  // router.push("/home");
                }
              })
              .catch(error => {
                console.log(error);
                getImageVerifyCode();
              });
          }
        })
        .catch(err => {
          console.log(err);
          getImageVerifyCode();
        });
      // CookieUtil.setCookie(response.data.tokenName, response.data.tokenValue, response.data.tokenTimeout, TimeUnitEnum.SECONDS);
    } else {
      getImageVerifyCode();
    }
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
      <h3 className="text-18px text-primary font-medium">密码登录</h3>
      <Form
        className="pt-24px"
        form={pwdLogin}
      >
        <Form.Item
          rules={formRules.username}
          name="username"
        >
          <Input
            placeholder="请输入用户名"
            allowClear={true}
          />
        </Form.Item>

        <Form.Item
          rules={formRules.password}
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
