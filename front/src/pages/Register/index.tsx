/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Button, Form,
} from 'antd';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerValidation } from '../../utils/yup';

interface IRegisterInput {
  email: string;
  nickname: string;
  password: string;
  passwordCheck: string;
}

const Register = () => {
  const { register, handleSubmit } = useForm<IRegisterInput>({
    resolver: yupResolver(registerValidation),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      passwordCheck: '',
    },
  });

  const onSubmit: SubmitHandler<IRegisterInput> = (data) => console.log(data);

  return (
    <Form onFinish={handleSubmit(onSubmit)} size="large">
      <div>
        <label htmlFor="email">이메일</label>
        <input {...register('email')} placeholder="이메일" />
      </div>
      <div>
        <label htmlFor="password">비밀번호</label>
        <input {...register('password')} placeholder="비밀번호" />
      </div>
      <div>
        <label htmlFor="passwordCheck">비밀번호확인</label>
        <input {...register('passwordCheck')} placeholder="비밀번호확인" />
      </div>
      <div>
        <label htmlFor="nickname">닉네임</label>
        <input {...register('nickname')} placeholder="닉네임" />
      </div>
      <div>
        <Button type="primary" htmlType="submit" block>
          가입하기
        </Button>
      </div>
    </Form>
  );
};

export default Register;
