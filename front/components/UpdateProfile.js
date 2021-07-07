import React from 'react';
import { useSelector } from 'react-redux';

const UpdateProfile = () => {
  const { me } = useSelector((state) => state.user);
  console.log(me);

  return <div>프로필변경페이지</div>;
};

export default UpdateProfile;
