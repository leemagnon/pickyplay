import produce from 'immer';

export const initialState = {
  emailAuthCode: '',
  getEmailAuthCodeLoading: false, // 이메일 인증 번호 받아오기 시도중
  getEmailAuthCodeDone: false,
  getEmailAuthCodeError: null,
  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  loadQRCodeLoading: false, // QR Code 불러오기 시도중
  loadQRCodeDone: false,
  loadQRCodeError: null,
  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  me: null,
};

export const GET_EMAIL_AUTH_CODE_REQUEST = 'GET_EMAIL_AUTH_CODE_REQUEST';
export const GET_EMAIL_AUTH_CODE_SUCCESS = 'GET_EMAIL_AUTH_CODE_SUCCESS';
export const GET_EMAIL_AUTH_CODE_FAILURE = 'GET_EMAIL_AUTH_CODE_FAILURE';

export const LOAD_QR_CODE_REQUEST = 'LOAD_QR_CODE_REQUEST';
export const LOAD_QR_CODE_SUCCESS = 'LOAD_QR_CODE_SUCCESS';
export const LOAD_QR_CODE_FAILURE = 'LOAD_QR_CODE_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case GET_EMAIL_AUTH_CODE_REQUEST:
      draft.getEmailAuthCodeLoading = true;
      draft.getEmailAuthCodeDone = false;
      draft.getEmailAuthCodeError = null;
      break;
    case GET_EMAIL_AUTH_CODE_SUCCESS:
      draft.getEmailAuthCodeLoading = false;
      draft.getEmailAuthCodeDone = true;
      draft.emailAuthCode = action.data;
      break;
    case GET_EMAIL_AUTH_CODE_FAILURE:
      draft.getEmailAuthCodeLoading = false;
      draft.getEmailAuthCodeDone = false;
      draft.getEmailAuthCodeError = action.error;
      break;
    case LOAD_QR_CODE_REQUEST:
      draft.loadQRCodeLoading = true;
      draft.loadQRCodeDone = false;
      draft.loadQRCodeError = null;
      break;
    case LOAD_QR_CODE_SUCCESS:
      draft.loadQRCodeLoading = false;
      draft.loadQRCodeDone = true;
      break;
    case LOAD_QR_CODE_FAILURE:
      draft.loadQRCodeLoading = false;
      draft.loadQRCodeDone = false;
      draft.loadQRCodeError = action.error;
      break;
    case LOG_IN_REQUEST:
      draft.logInLoading = true;
      draft.logInDone = false;
      draft.logInError = null;
      break;
    case LOG_IN_SUCCESS:
      draft.logInLoading = false;
      draft.logInDone = true;
      draft.me = action.data;
      break;
    case LOG_IN_FAILURE:
      draft.logInLoading = false;
      draft.logInDone = false;
      draft.logInError = action.error;
      break;
    case LOG_OUT_REQUEST:
      draft.logOutLoading = true;
      draft.logOutDone = false;
      draft.logOutError = null;
      break;
    case LOG_OUT_SUCCESS:
      draft.logOutLoading = false;
      draft.logOutDone = true;
      draft.me = null;
      break;
    case LOG_OUT_FAILURE:
      draft.logOutLoading = false;
      draft.logOutError = action.error;
      break;
    case SIGN_UP_REQUEST:
      draft.signUpLoading = true;
      draft.signUpDone = false;
      draft.signUpError = null;
      break;
    case SIGN_UP_SUCCESS:
      draft.signUpLoading = false;
      draft.signUpDone = true;
      break;
    case SIGN_UP_FAILURE:
      draft.signUpLoading = false;
      draft.signUpError = action.error;
      break;
    default:
      break;
  }
});

export default reducer;
