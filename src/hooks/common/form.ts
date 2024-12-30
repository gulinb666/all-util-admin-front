import type { FormInstance } from 'antd';
import {REG_CODE_SIX, REG_EMAIL, REG_IMAGE_VERIFY, REG_PHONE, REG_PWD, REG_USER_NAME} from '@/constants/reg';
import { $t } from '@/locales';
import StringUtil from "@/utils/stringUtil.ts";
export function useFormRules() {
  const patternRules = {
    username: {
      pattern: REG_USER_NAME,
      message: "用户名必须为3-16位之间",
      validateTrigger: 'onChange'
    },
    phone: {
      pattern: REG_PHONE,
      message: "手机号格式不正确",
      validateTrigger: 'onChange'
    },
    password: {
      pattern: REG_PWD,
      message: "密码必须在6-16位之间",
      validateTrigger: 'onChange'
    },
    phoneVerifyCode: {
      pattern: REG_CODE_SIX,
      message: "短信验证码必须为6位数字",
      validateTrigger: 'onChange'
    },
    email: {
      pattern: REG_EMAIL,
      message: "邮箱格式不正确",
      validateTrigger: 'onChange'
    },
    imageVerifyCode: {
      pattern: REG_IMAGE_VERIFY,
      message: "图形验证码必须为6位"
    },
    emailVerifyCode: {
      pattern: REG_CODE_SIX,
      message: "邮箱验证码必须为6位数字"
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    username: [createRequiredRule("请输入用户名"), patternRules.username],
    phone: [createRequiredRule("请输入手机号"), patternRules.phone],
    password: [createRequiredRule("请输入密码"), patternRules.password],
    phoneVerifyCode: [createRequiredRule("请输入短信验证码"), patternRules.phoneVerifyCode],
    email: [createRequiredRule("请输入邮箱"), patternRules.email],
    imageVerifyCode: [createRequiredRule("请输入图形验证码"), patternRules.imageVerifyCode],
    emailVerifyCode: [createRequiredRule("请输入邮箱验证码"), patternRules.emailVerifyCode]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }

  /** create a rule for confirming the password */
  function createConfirmPwdRule(from: FormInstance) {
    const confirmPwdRule: App.Global.FormRule[] = [
      {
        validator: (rule, value) => {
          const pwd = from.getFieldValue('password');
          if (StringUtil.isEmpty(value)) {
            return Promise.reject("请再次输入密码");
          }
          if (value.trim() !== '' && value !== pwd) {
            return Promise.reject("两次输入的密码不一致");
          }
          return Promise.resolve();
        },
        validateTrigger: 'onChange'
      }
    ];
    return confirmPwdRule;
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createConfirmPwdRule
  };
}
