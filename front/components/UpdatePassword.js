import React from 'react';
import { useSelector } from 'react-redux';

const UpdatePassword = () => {
  const { me } = useSelector((state) => state.user);
  console.log(me);

  return <div>패스워드변경페이지</div>;
};

export default UpdatePassword;
