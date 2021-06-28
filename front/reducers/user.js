import produce from 'immer';

export const initialState = {
  emailAuthCode: '',
  QRCode: '',
  msg: '', // 닉네임 중복 검사 메시지
  getEmailAuthCodeLoading: false, // 이메일 인증 번호 받아오기 시도중
  getEmailAuthCodeDone: false,
  getEmailAuthCodeError: null,
  checkDuplicatedNicknameLoading: false, // 닉네임 중복 검사중
  checkDuplicatedNicknameDone: false,
  checkDuplicatedNicknameError: null,
  secondAuthLoading: false, // 2FA 시도중
  secondAuthDone: false,
  secondAuthError: null,
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
  updateUserInfoLoading: false, // 회원정보 수정 시도중
  updateUserInfoDone: false,
  updateUserInfoError: null,
  me: null,
};

export const GET_EMAIL_AUTH_CODE_REQUEST = 'GET_EMAIL_AUTH_CODE_REQUEST';
export const GET_EMAIL_AUTH_CODE_SUCCESS = 'GET_EMAIL_AUTH_CODE_SUCCESS';
export const GET_EMAIL_AUTH_CODE_FAILURE = 'GET_EMAIL_AUTH_CODE_FAILURE';

export const CHECK_DUPLICATED_NICKNAME_REQUEST = 'CHECK_DUPLICATED_NICKNAME_REQUEST';
export const CHECK_DUPLICATED_NICKNAME_SUCCESS = 'CHECK_DUPLICATED_NICKNAME_SUCCESS';
export const CHECK_DUPLICATED_NICKNAME_FAILURE = 'CHECK_DUPLICATED_NICKNAME_FAILURE';

export const SECOND_AUTH_REQUEST = 'SECOND_AUTH_REQUEST';
export const SECOND_AUTH_SUCCESS = 'SECOND_AUTH_SUCCESS';
export const SECOND_AUTH_FAILURE = 'SECOND_AUTH_FAILURE';

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

export const UPDATE_USER_INFO_REQUEST = 'UPDATE_USER_INFO_REQUEST';
export const UPDATE_USER_INFO_SUCCESS = 'UPDATE_USER_INFO_SUCCESS';
export const UPDATE_USER_INFO_FAILURE = 'UPDATE_USER_INFO_FAILURE';

export const UPLOAD_PROFILE_IMG_REQUEST = 'UPLOAD_PROFILE_IMG_REQUEST';
export const UPLOAD_PROFILE_IMG_SUCCESS = 'UPLOAD_PROFILE_IMG_SUCCESS';
export const UPLOAD_PROFILE_IMG_FAILURE = 'UPLOAD_PROFILE_IMG_FAILURE';

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
    case CHECK_DUPLICATED_NICKNAME_REQUEST:
      draft.checkDuplicatedNicknameLoading = true;
      draft.checkDuplicatedNicknameDone = false;
      draft.checkDuplicatedNicknameError = null;
      draft.msg = null;
      break;
    case CHECK_DUPLICATED_NICKNAME_SUCCESS:
      draft.checkDuplicatedNicknameLoading = false;
      draft.checkDuplicatedNicknameDone = true;
      draft.msg = action.data;
      break;
    case CHECK_DUPLICATED_NICKNAME_FAILURE:
      draft.checkDuplicatedNicknameLoading = false;
      draft.checkDuplicatedNicknameDone = false;
      draft.checkDuplicatedNicknameError = action.error;
      break;
    case SECOND_AUTH_REQUEST:
      draft.secondAuthLoading = true;
      draft.secondAuthDone = false;
      draft.secondAuthError = null;
      break;
    case SECOND_AUTH_SUCCESS:
      draft.secondAuthLoading = false;
      draft.secondAuthDone = true;
      draft.me = action.data;
      break;
    case SECOND_AUTH_FAILURE:
      draft.secondAuthLoading = false;
      draft.secondAuthDone = false;
      draft.secondAuthError = action.error;
      break;
    case LOAD_QR_CODE_REQUEST:
      draft.loadQRCodeLoading = true;
      draft.loadQRCodeDone = false;
      draft.loadQRCodeError = null;
      break;
    case LOAD_QR_CODE_SUCCESS:
      draft.loadQRCodeLoading = false;
      draft.loadQRCodeDone = true;
      draft.QRCode = action.data;
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
    case UPDATE_USER_INFO_REQUEST:
      draft.updateUserInfoLoading = true;
      draft.updateUserInfoDone = false;
      draft.updateUserInfoError = null;
      break;
    case UPDATE_USER_INFO_SUCCESS:
      draft.updateUserInfoLoading = false;
      draft.updateUserInfoDone = true;
      draft.me = action.data;
      break;
    case UPDATE_USER_INFO_FAILURE:
      draft.updateProfileImgLoading = false;
      draft.updateProfileImgError = action.error;
      break;
    case UPLOAD_PROFILE_IMG_REQUEST:
      draft.updateProfileImgLoading = true;
      draft.updateProfileImgDone = false;
      draft.updateProfileImgError = null;
      break;
    case UPLOAD_PROFILE_IMG_SUCCESS:
      draft.updateProfileImgLoading = false;
      draft.updateProfileImgDone = true;
      draft.me = action.data;
      break;
    case UPLOAD_PROFILE_IMG_FAILURE:
      draft.updateProfileImgLoading = false;
      draft.updateProfileImgError = action.error;
      break;
    default:
      break;
  }
});

export default reducer;
