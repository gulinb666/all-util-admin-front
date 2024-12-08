import {Button, Flex, Form, Image, Input, Skeleton, Space} from 'antd';
import {SendOutlined} from "@ant-design/icons";
import {useFormRules} from "@/hooks/common/form.ts";
import CodeUtil from "@/utils/codeUtil.ts";
import CodeEnum from "@/enum/codeEnum.ts";
import React, {useEffect, useState} from "react";
import CookieUtil from "@/utils/cookieUtil.ts";
import StringUtil from "@/utils/stringUtil.ts";
import {FlatResponseData} from "~/packages/axios";
import {getCaptcha, verifyImageVerifyCode} from "@/service/api/captcha.ts";
import {adminLoginSendEmailVerifyCode, adminLoginVerifyEmailCode} from "@/service/api/email.ts";
import imageVerifyCodeError from "@/assets/imgs/imageVerifyCodeError.png";

export const Component = () => {
  const { label, isCounting} = useCaptcha();
  const { t } = useTranslation();
  const { toggleLoginModule } = useRouterPush();

  const [emailVerifyCodeLogin] = Form.useForm<EmailVerifyCodeLogin>();
  const { formRules} = useFormRules();

  const startText: string = "获取邮箱验证码";
  const loadingText: string = "X秒后重新获取邮箱验证码";
  const endText: string = "重新获取邮箱验证码";

  const codeUtil: CodeUtil = new CodeUtil();
  codeUtil.setStartText(startText);
  codeUtil.setLoadingText(loadingText);
  codeUtil.setEndText(endText);
  codeUtil.setEndTime(CodeEnum.END_TIME);

  const [text, setText] = useState(codeUtil.getStartText());

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  let isEmailVerifyCode: boolean = true;

  const [ imageVerifyCodeLoading, setImageVerifyCodeLoading ] = useState(true);

  const getEmailVerifyCode = async (loading: boolean = true): Promise<void> => {
    const params: EmailVerifyCodeLogin = await emailVerifyCodeLogin.getFieldsValue();
    const email: string = params.email;
    if (!email) {
      window.$message?.error("请先输入邮箱");
      return;
    }
    let emailRegExp: RegExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!emailRegExp.test(email)) {
      window.$message?.error("邮箱格式不正确");
      return;
    }
    try {
      await verifyCaptcha();
      let isSend: boolean = false;
      if (isEmailVerifyCode) {
        codeUtil.startCountDown((loadingText: string, loadingStatus: LoadingStatus): void => {
          if (loading == null || loading) {
            setLoading(loadingStatus.loading);
          } else {
            setLoading(loading);
          }
          if (!isSend) {
            isSend = true;
            let emailKey: string = CookieUtil.getCookie(CodeEnum.EMAIL_CODE_ID);
            adminLoginSendEmailVerifyCode(email, StringUtil.isEmpty(emailKey) ? "" : emailKey)
              .then((res: FlatResponseData<Api.Email.SendEmailVerifyCode>) => {
                let data = res.response.data.data;
                if (res.response.data.code === 1000) {
                  window.$message?.success("邮箱验证码下发成功，请注意查收！");
                  CookieUtil.setCookie(CodeEnum.EMAIL_CODE_ID, data.codeKey, data.expireTime, data.timeUnit);
                }
              });
          }
          setDisabled(loadingStatus.disabled);
          setText(loadingText);
        })
          .then((endText: string): void => {
            setText(endText);
          })
          .finally((): void => {
            isEmailVerifyCode = false;
          });
      }
    } catch (err: any) {
      window.$message?.error(err.message);
    }
  };

  const [endTimeFromLocalStorage] = useState(codeUtil.getEndTimeFromLocalStorage());

  useEffect((): void => {
    if (endTimeFromLocalStorage != null) {
      getEmailVerifyCode(false);
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

  const verifyCaptcha = async (): Promise<void> => {
    let codeId: string = CookieUtil.getCookie(CodeEnum.CODE_ID);
    if (StringUtil.isNotEmpty(codeId)) {
      let params: EmailVerifyCodeLogin = await emailVerifyCodeLogin.getFieldsValue();
      if (StringUtil.isEmpty(params.imageVerify)) {
        throw new Error("请输入图形验证码");
      }
      if (params.imageVerify.length !== 6) {
        throw new Error("图形验证码必须为6位");
      }
      try {
        let verifyImageVerifyCodeResult: FlatResponseData<Api.Captcha.VerifyCaptcha> = await verifyImageVerifyCode(codeId, params.imageVerify);
        let code = verifyImageVerifyCodeResult.response.data.code;
        if (code === 1000) {
          isEmailVerifyCode = true;
        } else {
          isEmailVerifyCode = false;
        }
      } finally {
        getImageVerifyCode();
      }
    } else {
      getImageVerifyCode();
      throw new Error("图形验证码已过期，请重新获取");
    }
  };

  async function handleSubmit(): Promise<void> {
    const params: EmailVerifyCodeLogin = await emailVerifyCodeLogin.validateFields();
    try {
      await verifyEmailCode(params.emailVerifyCode);
    } catch (err: any) {
      window.$message?.error(err.message);
    }
  }

  async function verifyEmailCode(code: string): Promise<void> {
    if (StringUtil.isEmpty(code)) {
      throw new Error("请输入验证码");
    }
    let emailCodeKey: string = CookieUtil.getCookie(CodeEnum.EMAIL_CODE_ID);
    if (StringUtil.isEmpty(emailCodeKey)) {
      throw new Error("邮箱验证码已过期，请重新获取");
    } else {
      await adminLoginVerifyEmailCode(emailCodeKey, code);
    }
  }

  useKeyPress('enter', (): void => {
    handleSubmit();
  });

  return (
    <>
      <h3 className="text-18px text-primary font-medium">邮箱验证码登录</h3>
      <Form
        className="pt-24px"
        form={emailVerifyCodeLogin}
      >
        <Form.Item
          name="email"
          rules={formRules.email}
        >
          <Input
            placeholder="请输入邮箱"
            allowClear={true}
          ></Input>
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
        <Form.Item
          name="emailVerifyCode"
          rules={formRules.emailVerifyCode}
        >
          <Flex>
            <Input
              placeholder="请输入邮箱验证码"
              count={{
                show: true,
                max: 6
              }}
              maxLength={6}
              allowClear={true}
            ></Input>
            <Button
              disabled={disabled}
              loading={loading}
              className="ml-5"
              type="primary"
              icon={<SendOutlined />}
              // @ts-ignore
              onClick={getEmailVerifyCode}
            >{ text }</Button>
          </Flex>
        </Form.Item>
        <Space
          direction="vertical"
          className="w-full"
          size={18}
        >
          <Button
            type="primary"
            size="large"
            shape="round"
            block
            onClick={handleSubmit}
          >
            确认登录
          </Button>

          <Button
            size="large"
            shape="round"
            block
            onClick={() => toggleLoginModule('pwd-login')}
          >
            返回
          </Button>
        </Space>
      </Form>
    </>
  );
};

Component.displayName = 'CodeLogin';
