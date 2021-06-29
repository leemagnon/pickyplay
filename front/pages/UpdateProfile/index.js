/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gravatar from 'gravatar';
import { UPLOAD_PROFILE_IMAGE_REQUEST } from '../../reducers/user';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const {
    me,
  } = useSelector((state) => state.user);
  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    imageFormData.append('profileImg', e.target.files[0]);
    dispatch({
      type: UPLOAD_PROFILE_IMAGE_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onSubmit = useCallback(() => {

  }, []);

  return (
    <form encType="multipart/form-data" onFinish={onSubmit}>
      <div>
        <img src={gravatar.url(me.email, { s: '38px', d: 'retro' })} onClick={onClickImageUpload} alt="" />
        <input type="file" name="profileImg" hidden ref={imageInput} onChange={onChangeImages} />
      </div>
    </form>
  );
};

export default UpdateProfile;
