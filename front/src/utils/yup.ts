import * as yup from 'yup';

export const registerValidation = yup.object({
  email: yup.string().required('이메일을 입력해주세요.'),
  nickname: yup.string().required('닉네임을 입력해주세요.'),
  password: yup.string().required('비밀번호를 입력해주세요.').max(20, '비밀번호는 20자리 이하여야 합니다.').min(8, '비밀번호는 8자리 이상이여야 합니다.'),
  passwordCheck: yup.string().oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.'),
});
