import React, { useEffect, useState } from 'react';
import {Button, Flex, Form, Image, Input, Radio, Skeleton, Space, Spin} from 'antd';
import { SendOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import CodeUtil from "@/utils/codeUtil.ts";
import CodeEnum from "@/enum/codeEnum.ts";
import CookieUtil from "@/utils/cookieUtil.ts";
import StringUtil from "@/utils/stringUtil.ts";
import {getCaptcha, verifyImageVerifyCode} from "@/service/api/captcha.ts";
import {FlatResponseData} from "~/packages/axios";
import imageVerifyCodeError from "@/assets/imgs/imageVerifyCodeError.png";

export const Component = () => {
  const { t } = useTranslation();
  const { toggleLoginModule } = useRouterPush();
  const { formRules, createConfirmPwdRule } = useFormRules();

  const [forgetPassword] = Form.useForm<ForgetPassword>();

  const [emailOrPhoneVerifyCodeLogin, setEmailOrPhoneVerifyCodeLogin] = useState(0);

  const loginMethod: LoginMethod[] = [
    {
      label: "邮箱验证码找回",
      key: 0
    },
    {
      label: "手机验证码找回",
      key: 1
    }
  ];

  const [codeUtil] = useState(new CodeUtil());
  const [text, setText] = useState(codeUtil.getStartText());
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const loadingText: string = `X秒后重新获取${emailOrPhoneVerifyCodeLogin === 0 ? '邮箱' : '短信'}验证码`;
  const endText: string = `重新获取${emailOrPhoneVerifyCodeLogin === 0 ? '邮箱' : '短信'}验证码`;

  codeUtil.setLoadingText(loadingText);
  codeUtil.setEndText(endText);

  let isEmailVerifyCode: boolean = false;

  const [ imageVerifyCodeLoading, setImageVerifyCodeLoading ] = useState(true);

  const getEmailOrPhoneVerifyCode = async (loading: boolean = true): Promise<void> => {
    let verifyCaptchaResult: boolean = await verifyCaptcha();
    if (verifyCaptchaResult) {
      if (isEmailVerifyCode) {
        codeUtil.setEndTime(CodeEnum.END_TIME);
        codeUtil.startCountDown((loadingText: string, loadingStatus: LoadingStatus): void => {
          if (loading == null || loading) {
            setLoading(loadingStatus.loading);
          } else {
            setLoading(loading);
          }
          setDisabled(loadingStatus.disabled);
          setText(loadingText);
        })
          .then((endText: string): void => {
            setText(endText);
          });
      }
    } else {
      window.$message?.error("请先填写图形验证码");
    }
  };

  const verifyCaptcha = async (): Promise<boolean> => {
    let codeId: string = CookieUtil.getCookie(CodeEnum.CODE_ID);
    if (StringUtil.isNotEmpty(codeId)) {
      let params: ForgetPassword = await forgetPassword.getFieldsValue();
      if (StringUtil.isEmpty(params.imageVerify)) {
        return false;
      }
      try {
        let verifyImageVerifyCodeResult: FlatResponseData<Api.Captcha.VerifyCaptcha> = await verifyImageVerifyCode(codeId, params.imageVerify);
        if (verifyImageVerifyCodeResult.response.data.code === 1000) {
          isEmailVerifyCode = true;
        }
      } finally {
        getImageVerifyCode();
      }
    }
    return true;
  };

  useEffect((): void => {
    const startText: string = `获取${emailOrPhoneVerifyCodeLogin === 0 ? '邮箱' : '短信'}验证码`;
    codeUtil.setStartText(startText);
    setText(startText);
    forgetPassword.setFieldsValue({ emailOrPhone: emailOrPhoneVerifyCodeLogin });
  }, [emailOrPhoneVerifyCodeLogin]);

  const [endTimeFromLocalStorage] = useState(codeUtil.getEndTimeFromLocalStorage());

  useEffect((): void => {
    if (endTimeFromLocalStorage != null) {
      getEmailOrPhoneVerifyCode(false);
    }
  }, [endTimeFromLocalStorage]);

  useEffect(() => {
    return (): void => {
      codeUtil.stopCountDown();
    };
  }, []);

  const [imageVerifyCode, setImageVerifyCode] = useState({
    src: "",
    codeId: ""
  });

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
    const params = await forgetPassword.validateFields();
    console.log(params);
  }

  return (
    <>
      <h3 className="text-18px text-primary font-medium">忘记密码</h3>
      <Form
        form={forgetPassword}
        layout="vertical"
        initialValues={{ emailOrPhone: emailOrPhoneVerifyCodeLogin }} // 设置初始值
        className="pt-24px"
      >
        <Form.Item name="emailOrPhone">
          <Radio.Group buttonStyle="solid" onChange={e => setEmailOrPhoneVerifyCodeLogin(e.target.value)}>
            {
              loginMethod.map((item: LoginMethod) => {
                return (
                  <Radio.Button value={item.key} disabled={disabled} key={item.key}>{item.label}</Radio.Button>
                );
              })
            }
          </Radio.Group>
        </Form.Item>
        {
          emailOrPhoneVerifyCodeLogin === 1 ? (
            <Form.Item name="phone" rules={formRules.phone}>
              <Input
                placeholder="请输入手机号码"
                allowClear={true}
              />
            </Form.Item>
          ) : (
            <Form.Item name="email" rules={formRules.email}>
              <Input
                placeholder="请输入邮箱"
                allowClear={true}
              />
            </Form.Item>
          )
        }
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
        {
          emailOrPhoneVerifyCodeLogin === 1 ? (
            <Form.Item name="code" rules={formRules.phoneVerifyCode}>
              <Flex>
                <Input
                  placeholder="请输入短信验证码"
                  count={{ show: true, max: 6 }}
                  maxLength={6}
                  allowClear={true}
                />
                <Button
                  disabled={disabled}
                  loading={loading}
                  className="ml-5"
                  type="primary"
                  icon={<SendOutlined />}
                  // @ts-ignore
                  onClick={getEmailOrPhoneVerifyCode}
                >{text}</Button>
              </Flex>
            </Form.Item>
          ) : (
            <Form.Item name="emailCode" rules={formRules.emailVerifyCode}>
              <Flex>
                <Input
                  placeholder="请输入邮箱验证码"
                  count={{ show: true, max: 6 }}
                  maxLength={6}
                  allowClear={true}
                />
                <Button
                  disabled={disabled}
                  loading={loading}
                  className="ml-5"
                  type="primary"
                  icon={<SendOutlined />}
                  // @ts-ignore
                  onClick={getEmailOrPhoneVerifyCode}
                >{text}</Button>
              </Flex>
            </Form.Item>
          )
        }
        <Form.Item name="password" rules={formRules.pwd}>
          <Input.Password autoComplete="new-password" placeholder="请输入密码" />
        </Form.Item>
        <Form.Item name="confirmPassword" rules={createConfirmPwdRule(forgetPassword)}>
          <Input.Password autoComplete="new-password" placeholder="请再次输入密码" />
        </Form.Item>
        <Space direction="vertical" className="w-full" size={18}>
          <Button type="primary" size="large" shape="round" block onClick={handleSubmit}>
            确认修改
          </Button>
          <Button size="large" shape="round" block onClick={() => toggleLoginModule('pwd-login')}>
            返回
          </Button>
        </Space>
      </Form>
    </>
  );
};

Component.displayName = 'ResetPwd';
