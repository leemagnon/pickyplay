import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button } from 'antd';
import gravatar from 'gravatar';
import axios from 'axios';
import { UPDATE_USER_PROFILE_REQUEST, UPLOAD_PROFILE_IMAGE_REQUEST, REMOVE_PROFILE_IMAGE } from '../reducers/user';
import { nicknameRule } from '../util/regexp';

/** css */
const ProfileImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 5px;
  &:hover {
    filter: brightness(0.7);
  }
`;

const Title = styled.p`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  color: black;
`;

const Contents = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 23px;
  & input {
    border-radius: 3px;
    width: 250px;
    height: 45px;
    font-size: 20px;
    text-align: center;
  }
`;

const Buttons = styled.div`
  flex: 1;
  display: flex;
  align-items: start;
  justify-content: space-evenly;
  & button {
    width: 55px;
    height: 38px;
  }
`;

const InputError = styled.div`
  color: red;
  margin-top: 32px;
`;

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { me,
    profileImgPath,
    uploadProfileImgError,
    uploadProfileImgDone,
    updateUserProfileDone,
  } = useSelector((state) => state.user);
  const imageInput = useRef();
  const [nickname, setNickname] = useState(me.nickname);
  const [nicknameValidationError, setNicknameValidationError] = useState(false);
  const [
    duplicatedNicknameCheckRequiredError,
    setDuplicatedNicknameCheckRequiredError,
  ] = useState(false);
  const [nicknamePassMsg, setNicknamePassMsg] = useState(false);
  const [nicknameFailMsg, setNicknameFailMsg] = useState('');
  const [previewImg, setPreviewImg] = useState(me.profileImgUrl);

  const NicknameInput = nicknameValidationError || duplicatedNicknameCheckRequiredError || nicknameFailMsg !== '' ? 'error' : null;

  useEffect(() => {
    if (!me) {
      router.replace('/');
    }
  }, [me]);

  useEffect(() => {
    if (updateUserProfileDone) {
      alert('????????? ?????? ??????.');
      router.replace('/');
    }
  }, [updateUserProfileDone]);

  useEffect(() => {
    if (uploadProfileImgError) {
      alert(uploadProfileImgError.message);
    }
  }, [uploadProfileImgError]);

  useEffect(() => {
    if (uploadProfileImgDone) {
      alert('????????? ????????? ??????.');
      setPreviewImg(profileImgPath);
    }
  }, [uploadProfileImgDone, profileImgPath]);

  useEffect(() => {
    if (nicknameFailMsg !== '') { // ????????? ?????? ?????? ?????? ?????? ??? alert ?????????
      alert(nicknameFailMsg);
    }
  }, [nicknameFailMsg]);

  const checkDuplicatedNickname = useCallback(
    async () => {
      setDuplicatedNicknameCheckRequiredError(false);

      if (!nickname) {
        setNicknameValidationError(false);
        setNicknamePassMsg('');
        return 0;
      }

      if (nicknameValidationError) {
        setNicknamePassMsg('');
        return 0;
      }

      axios.post('/auth/nickname', {
        nickname: nickname.trim(),
      }).then((result) => {
        setNicknamePassMsg(result.data);
      }).catch((error) => {
        setNicknameFailMsg(error.response.data.message);
      });
    }, [nickname, nicknameValidationError],
  );

  const onChangeNickname = useCallback((e) => {
    setNicknamePassMsg('');
    setNicknameFailMsg('');
    setNickname(e.target.value);

    if (e.target.value !== '') {
      setDuplicatedNicknameCheckRequiredError(true);
    } else {
      setNicknameValidationError(false);
      setDuplicatedNicknameCheckRequiredError(false);
    }

    if (e.target.value !== '' && !nicknameRule.test(e.target.value)) {
      setNicknameValidationError(true);
      setDuplicatedNicknameCheckRequiredError(false);
    } else {
      setNicknameValidationError(false);
    }
  }, [nickname, duplicatedNicknameCheckRequiredError]);

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
    const formData = new FormData();

    if ((!profileImgPath && !nickname) || (!profileImgPath && nickname === me.nickname)) {
      return alert('????????? ????????? ?????? ???????????? ??????????????????.');
    }

    if (nickname !== '') {
      if (duplicatedNicknameCheckRequiredError || nicknamePassMsg === '') {
        setNicknameValidationError(false);
        return setDuplicatedNicknameCheckRequiredError(true);
      }

      if (!nicknameRule.test(nickname)) {
        setDuplicatedNicknameCheckRequiredError(false);
        return setNicknameValidationError(true);
      }

      formData.append('nickname', nickname.trim());
    }

    if (profileImgPath) {
      formData.append('profileImgUrl', profileImgPath);
    }

    return dispatch({
      type: UPDATE_USER_PROFILE_REQUEST,
      data: formData,
    });
  }, [nickname, nicknamePassMsg, duplicatedNicknameCheckRequiredError,
    profileImgPath,
  ]);

  const goBack = useCallback(() => {
    router.back();
  }, []);

  const onRemoveImage = useCallback(() => {
    dispatch({
      type: REMOVE_PROFILE_IMAGE,
    });
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
      <Title>????????? ??????</Title>
      <Contents style={{ textAlign: 'center' }}>
        <div>
          <div key={profileImgPath} style={{ display: 'inline-block' }}>
            <ProfileImg src={previewImg || gravatar.url(me.email, { s: '38px', d: 'retro' })} alt={me.nickname} onClick={onClickImageUpload} />
            <div>
              <Button onClick={onRemoveImage}>??????</Button>
            </div>
          </div>
        </div>
        <br /><br />
        <form id="nicknameForm" encType="multipart/form-data" onSubmit="return false">
          <input type="file" name="profileImg" hidden ref={imageInput} onChange={onChangeImages} />
          <div>
            <input type="text" name="nickname" className={`${NicknameInput} ${nicknamePassMsg ? 'pass' : ''}`} value={nickname} placeholder="????????? ??????" onChange={onChangeNickname} />
            <button
              type="button"
              onClick={checkDuplicatedNickname}
            >
              ?????????????????????
            </button>
            {nicknameValidationError && <InputError>???????????? 2???~10??? ???????????? ?????????.</InputError>}
            {nicknamePassMsg !== '' && <div style={{ color: '#52c41a', marginTop: '32px' }}>{nicknamePassMsg}</div>}
            {nicknameFailMsg !== '' && <InputError>{nicknameFailMsg}</InputError>}
            {duplicatedNicknameCheckRequiredError && <InputError>????????? ?????? ????????? ???????????? ?????????.</InputError>}
          </div>
        </form>
      </Contents>
      <Buttons>
        <button type="button" onClick={goBack}>??????</button>
        <button type="submit" onClick={onSubmit}>??????</button>
      </Buttons>
    </div>
  );
};

export default UpdateProfile;
