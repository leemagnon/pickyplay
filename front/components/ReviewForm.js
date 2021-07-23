/* eslint-disable no-restricted-syntax */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ADD_REVIEW_REQUEST, UPLOAD_REVIEW_IMAGES_REQUEST, REMOVE_REVIEW_IMAGE } from '../reducers/movie';

const ReviewForm = ({ DOCID }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { reviewImgPaths, addReviewDone, addReviewError } = useSelector((state) => state.movie);
  const [text, setText] = useState('');
  const imageInput = useRef();

  useEffect(() => {
    if (addReviewError) {
      alert(addReviewError.message);
    }
  }, [addReviewError]);

  useEffect(() => {
    if (addReviewDone) {
      setText('');
    }
  }, [addReviewDone]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, [text]);

  const onSubmit = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    reviewImgPaths.forEach((p) => {
      formData.append('reviewImgs', p);
    });
    formData.append('content', text);
    formData.append('DOCID', DOCID);
    return dispatch({
      type: ADD_REVIEW_REQUEST,
      data: formData,
    });
  }, [text, reviewImgPaths]);

  const onClickImageUpload = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    if (e.target.files.length > 3) {
      return alert('사진은 최대 3장까지 업로드 할 수 있습니다.');
    }
    const maxSize = 5000000; // 5000KB = 5MB
    let sum = 0;
    for (const f of e.target.files) {
      sum += f.size;
      if (sum > maxSize) return alert('사진은 최대 5MB까지 업로드 할 수 있습니다.');
    }
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('reviewImgs', f);
    });
    return dispatch({
      type: UPLOAD_REVIEW_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_REVIEW_IMAGE,
      data: index,
    });
  }, []);

  return (
    <Form encType="multipart/form-data" onFinish={onSubmit} style={{ marginBottom: '30px' }}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="감상평을 적어주세요."
      />
      <div>
        <input type="file" name="reviewImgs" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">등록</Button>
      </div>
      <div>
        {reviewImgPaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={v} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

ReviewForm.propTypes = {
  DOCID: PropTypes.string.isRequired,
};

export default ReviewForm;
