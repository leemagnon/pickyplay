import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Logo = styled.a`
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  font-size: 35px;
  color: white;
  & span {
    color: #9400d3;
  }
`;

const Collection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.userIdx)) {
      router.replace('/');
    }
  }, [me && me.id]);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
      <Logo className="font-carter-one" href="/">
        <span>P</span>
        ICKY
        <span>P</span>
        LAY
      </Logo>
      <div>무비컬렉션</div>
    </div>
  );
};

export default Collection;
