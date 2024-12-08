import {Button, Flex, Form, Image, Input, Skeleton, Space, Spin} from 'antd';
import {SendOutlined} from "@ant-design/icons";
import CodeUtil from "@/utils/codeUtil.ts";
import CodeEnum from "@/enum/codeEnum.ts";
import React, {useEffect, useState} from "react";
import CookieUtil from "@/utils/cookieUtil.ts";
import StringUtil from "@/utils/stringUtil.ts";
import {FlatResponseData} from "~/packages/axios";
import {getCaptcha, verifyImageVerifyCode} from "@/service/api/captcha.ts";
import imageVerifyCodeError from "@/assets/imgs/imageVerifyCodeError.png";

export const Component = () => {
  const { label, isCounting} = useCaptcha();
  const { t } = useTranslation();
  const { toggleLoginModule } = useRouterPush();
  const { formRules} = useFormRules();

  const startText: string = "获取短信验证码";
  const loadingText: string = "X秒后重新获取短信验证码";
  const endText: string = "重新获取短信验证码";

  const codeUtil: CodeUtil = new CodeUtil();
  codeUtil.setStartText(startText);
  codeUtil.setLoadingText(loadingText);
  codeUtil.setEndText(endText);
  codeUtil.setEndTime(CodeEnum.END_TIME);

  const [text, setText] = useState(codeUtil.getStartText());

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  let isEmailVerifyCode: boolean = false;

  const [ imageVerifyCodeLoading, setImageVerifyCodeLoading ] = useState(true);

  const getPhoneVerifyCode = async (loading: boolean = true): Promise<void> => {
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
          .finally(() => {
            isEmailVerifyCode = false;
          });
      }
    } else {
      window.$message?.error("请先填写图形验证码");
    }
  };

  const verifyCaptcha = async (): Promise<boolean> => {
    let codeId: string = CookieUtil.getCookie(CodeEnum.CODE_ID);
    if (StringUtil.isNotEmpty(codeId)) {
      let params: PhoneCodeLogin = await phoneVerifyCodeLogin.getFieldsValue();
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

  const [endTimeFromLocalStorage] = useState(codeUtil.getEndTimeFromLocalStorage());

  useEffect((): void => {
    if (endTimeFromLocalStorage != null) {
      getPhoneVerifyCode(false);
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

  const [ phoneVerifyCodeLogin ] = Form.useForm<PhoneCodeLogin>();

  async function handleSubmit(): Promise<void> {
    const params = await phoneVerifyCodeLogin.validateFields();
    console.log(params);
    await verifyCaptcha();
    // request to reset password
    window.$message?.success(t('page.login.common.validateSuccess'));
  }

  useKeyPress('enter', (): void => {
    handleSubmit();
  });

  return (
    <>
      <h3 className="text-18px text-primary font-medium">短信验证码登录</h3>
      <Form
        className="pt-24px"
        form={phoneVerifyCodeLogin}
      >
        <Form.Item
          name="phone"
          rules={formRules.phone}
        >
          <Input
            placeholder="请输入手机号"
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
          name="code"
          rules={formRules.phoneVerifyCode}
        >
          <Flex>
            <Input
              placeholder="请输入短信验证码"
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
              onClick={getPhoneVerifyCode}
            >{text}</Button>
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
