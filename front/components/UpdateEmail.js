import React from 'react';
import { useSelector } from 'react-redux';

const UpdateEmail = () => {
  const { me } = useSelector((state) => state.user);
  console.log(me);
  return <div>이메일변경페이지</div>;
};

export default UpdateEmail;
