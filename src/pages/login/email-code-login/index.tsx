import {Button, Flex, Form, Image, Input, Space, Spin} from 'antd';
import {SendOutlined} from "@ant-design/icons";
import {useFormRules} from "@/hooks/common/form.ts";
import CodeUtil from "@/utils/codeUtil.ts";
import CodeEnum from "@/enum/codeEnum.ts";
import React, {useEffect, useState} from "react";
import CookieUtil from "@/utils/cookieUtil.ts";
import StringUtil from "@/utils/stringUtil.ts";
import {FlatResponseData} from "~/packages/axios";
import {getCaptcha, verifyImageVerifyCode} from "@/service/api/captcha.ts";
import ResultEnum from "@/enum/resultEnum.ts";

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

  let isEmailVerifyCode: boolean = false;

  const [getImageVerifyCodeSpin, setGetImageVerifyCodeSpin] = useState(false);

  const getEmailVerifyCode = async (loading: boolean = true): Promise<void> => {
    let verifyCaptchaResult: boolean = await verifyCaptcha();
    if (verifyCaptchaResult) {
      if (isEmailVerifyCode) {
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
          })
          .finally((): void => {
            isEmailVerifyCode = false;
          });
      }
    } else {
      window.$message?.error("请先填写图形验证码");
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

  function getImageVerifyCode(): void {
    setGetImageVerifyCodeSpin(true);
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
        setGetImageVerifyCodeSpin(false);
      });
  }

  useEffect((): void => {
    getImageVerifyCode();
  }, []);

  const verifyCaptcha = async (): Promise<boolean> => {
    let codeId: string = CookieUtil.getCookie(CodeEnum.CODE_ID);
    if (StringUtil.isNotEmpty(codeId)) {
      let params: EmailVerifyCodeLogin = await emailVerifyCodeLogin.getFieldsValue();
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

  async function handleSubmit(): Promise<void> {
    const params: EmailVerifyCodeLogin = await emailVerifyCodeLogin.validateFields();
    console.log(params);
    await verifyCaptcha();
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
          name="phone"
          rules={formRules.email}
        >
          <Input placeholder="请输入邮箱"></Input>
        </Form.Item>
        <Form.Item
          rules={formRules.imageVerifyCode}
          name="imageVerify"
        >
          <Flex>
            <Input
              count={{
                show: true,
                max: 6
              }}
              maxLength={6}
              placeholder="请输入图形验证码"
            />
            <Image
              src={imageVerifyCode.src}
              alt={imageVerifyCode.codeId}
              className="code"
              placeholder={true}
              preview={false}
              title='看不清楚？点我换一张！'
              fallback="data:image/png;base64,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"
              onClick={getImageVerifyCode} />
            <Button type='link' className='refreshCode' onClick={getImageVerifyCode}>看不清楚？点我换一张！</Button>
          </Flex>
        </Form.Item>
        <Form.Item
          name="code"
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
      <Spin
        fullscreen={true}
        spinning={getImageVerifyCodeSpin}
        tip={ResultEnum.LOADING_TEXT}
        size="large"
      />
    </>
  );
};

Component.displayName = 'CodeLogin';
