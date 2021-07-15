import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const ReviewCardContent = ({ reviewIdx, reviewData, editMode, onChangeReview, onCancelUpdate }) => {
  const { updateReviewLoading, updateReviewDone } = useSelector((state) => state.movie);
  const [editText, setEditText] = useState(reviewData);

  useEffect(() => {
    if (updateReviewDone) {
      onCancelUpdate();
    }
  }, [updateReviewDone]);

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  });

  return (
    <div>
      {editMode
        ? (
          <>
            <TextArea value={editText} onChange={onChangeText} />
            <Button.Group>
              <Button
                loading={updateReviewLoading}
                onClick={onChangeReview(reviewIdx, editText)}
              >
                수정
              </Button>
              <Button type="danger" onClick={onCancelUpdate}>취소</Button>
            </Button.Group>
          </>
        ) : reviewData}
    </div>
  );
};

ReviewCardContent.propTypes = {
  reviewIdx: PropTypes.number.isRequired,
  reviewData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onChangeReview: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
};

ReviewCardContent.defaultProps = {
  editMode: false,
};

export default ReviewCardContent;
