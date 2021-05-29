/**
 * 모든 페이지에서 공통인 것은 _app.js에 넣는다. pages들의 공통 부분.
 */

import PropTypes from 'prop-types';
import Head from 'next/head'; // head를 수정할 수 있게 Head 컴포넌트 제공
import 'antd/dist/antd.css'; // 웹팩이 알아서 style 태그로 변경해서 처리해줌.
import withReduxSaga from 'next-redux-saga';
import wrapper from '../store/configureStore';
import '../styles.css';

const PickyPlay = ({ Component }) => (
  <>
    <Head>
      <link rel="icon" type="image/svg+xml" sizes="any" href="/popcorn.svg" />
      <meta charSet="utf-8" />
      <title>PickyPlay</title>
    </Head>
    <Component />
  </>
);

PickyPlay.propTypes = {
  Component: PropTypes.elementType.isRequired, // <Component />처럼 JSX로 쓸 수 있는 것들을 elementType이라고 한다.
};

export default wrapper.withRedux(withReduxSaga(PickyPlay));

/**
 * pages 폴더는 무조건 이름이 pages 여야 한다.
 * 그래야 nextjs가 pages 폴더를 인식하고, 그 안에 있는 파일들을 개별적인 페이지 컴포넌트로 만들어 준다.
 * pages 안에 들어 있어야 코드 스플리팅이 된다.
 */
