import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Popover, Button, Avatar } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';
import gravatar from 'gravatar';
import ReviewImages from './ReviewImages';
import ReviewCardContent from './ReviewCardContent';
import {
  UPDATE_REVIEW_REQUEST,
  REMOVE_REVIEW_REQUEST,
} from '../reducers/movie';

moment.locale('ko');

const ReviewCard = ({ reviews }) => {
  const dispatch = useDispatch();
  const { removeReviewLoading } = useSelector((state) => state.movie);
  const userIdx = useSelector((state) => state.user.me?.userIdx);
  const [editMode, setEditMode] = useState(false);

  const onClickUpdate = useCallback(() => {
    setEditMode(true);
  }, []);

  const onCancelUpdate = useCallback(() => {
    setEditMode(false);
  }, []);

  const onChangeReview = useCallback((reviewIdx, editText) => () => {
    dispatch({
      type: UPDATE_REVIEW_REQUEST,
      data: {
        reviewIdx,
        content: editText,
      },
    });
  }, []);

  const onRemoveReview = useCallback((reviewIdx) => {
    if (!userIdx) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_REVIEW_REQUEST,
      data: reviewIdx,
    });
  }, [userIdx]);

  return (
    <div>
      {reviews.map((v) => (
        <div key={v.reviewIdx} style={{ marginBottom: 20 }}>
          <Card
            cover={v.images[0] && <ReviewImages images={v.images} />}
            extra={userIdx && userIdx === v.user.userIdx && (
            <Popover
              key="more"
              content={(
                <Button.Group>
                  <Button onClick={onClickUpdate}>수정</Button>
                  <Button type="danger" loading={removeReviewLoading} onClick={() => onRemoveReview(v.reviewIdx)}>삭제</Button>
                </Button.Group>
        )}
            >
              <EllipsisOutlined />
            </Popover>
            )}
          >
            <>
              <div style={{ float: 'right' }}>{moment(v.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta
                avatar={<Avatar src={v.user.profileImgUrl || gravatar.url(v.user.email, { s: '38px', d: 'retro' })} />}
                title={v.user.nickname}
                description={(
                  <ReviewCardContent
                    reviewIdx={v.reviewIdx}
                    reviewData={v.content}
                    editMode={editMode}
                    onChangeReview={onChangeReview}
                    onCancelUpdate={onCancelUpdate}
                  />
          )}
              />
            </>
          </Card>
        </div>
      ))}
    </div>
  );
};

ReviewCard.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    reviewIdx: PropTypes.number,
    userIdx: PropTypes.number,
    DOCID: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    user: PropTypes.object,
    images: PropTypes.arrayOf(PropTypes.object),
  })).isRequired,
};

export default ReviewCard;
