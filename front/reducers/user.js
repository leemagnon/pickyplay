import produce from 'immer';

export const initialState = {
  secondAuthLoading: false, // 2FA 시도중
  secondAuthDone: false,
  secondAuthError: null,
  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  activate2FA: false, // 2FA 활성화
  loadMyInfoLoading: false, // 유저 정보 가져오기 시도중
  loadMyInfoDone: false,
  loadMyInfoError: null,
  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  uploadProfileImgLoading: false, // 프로필 이미지 업로드 시도중
  uploadProfileImgDone: false,
  uploadProfileImgError: null,
  updateUserProfileLoading: false, // 사용자 프로필 변경 시도중
  updateUserProfileDone: false,
  updateUserProfileError: null,
  updateUserEmailLoading: false, // 사용자 이메일 변경 시도중
  updateUserEmailDone: false,
  updateUserEmailError: null,
  updateUserPasswordLoading: false, // 사용자 비밀번호 변경 시도중
  updateUserPasswordDone: false,
  updateUserPasswordError: null,
  profileImgPath: '',
  me: null,
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const SECOND_AUTH_REQUEST = 'SECOND_AUTH_REQUEST';
export const SECOND_AUTH_SUCCESS = 'SECOND_AUTH_SUCCESS';
export const SECOND_AUTH_FAILURE = 'SECOND_AUTH_FAILURE';

export const CLOSE_OTP_FORM_REQUEST = 'CLOSE_OTP_FORM_REQUEST';

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const UPLOAD_PROFILE_IMAGE_REQUEST = 'UPLOAD_PROFILE_IMAGE_REQUEST';
export const UPLOAD_PROFILE_IMAGE_SUCCESS = 'UPLOAD_PROFILE_IMAGE_SUCCESS';
export const UPLOAD_PROFILE_IMAGE_FAILURE = 'UPLOAD_PROFILE_IMAGE_FAILURE';

export const UPDATE_USER_PROFILE_REQUEST = 'UPDATE_USER_PROFILE_REQUEST';
export const UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS';
export const UPDATE_USER_PROFILE_FAILURE = 'UPDATE_USER_PROFILE_FAILURE';

export const REMOVE_PROFILE_IMAGE = 'REMOVE_PROFILE_IMAGE';

export const UPDATE_USER_EMAIL_REQUEST = 'UPDATE_USER_EMAIL_REQUEST';
export const UPDATE_USER_EMAIL_SUCCESS = 'UPDATE_USER_EMAIL_SUCCESS';
export const UPDATE_USER_EMAIL_FAILURE = 'UPDATE_USER_EMAIL_FAILURE';

export const UPDATE_USER_PASSWORD_REQUEST = 'UPDATE_USER_PASSWORD_REQUEST';
export const UPDATE_USER_PASSWORD_SUCCESS = 'UPDATE_USER_PASSWORD_SUCCESS';
export const UPDATE_USER_PASSWORD_FAILURE = 'UPDATE_USER_PASSWORD_FAILURE';

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
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
    case LOAD_MY_INFO_REQUEST:
      draft.loadMyInfoLoading = true;
      draft.loadMyInfoError = null;
      draft.loadMyInfoDone = false;
      break;
    case LOAD_MY_INFO_SUCCESS:
      draft.loadMyInfoLoading = false;
      draft.loadMyInfoDone = true;
      draft.me = action.data;
      break;
    case LOAD_MY_INFO_FAILURE:
      draft.loadMyInfoLoading = false;
      draft.loadMyInfoError = action.error;
      break;
    case LOG_IN_REQUEST:
      draft.logInLoading = true;
      draft.logInDone = false;
      draft.logInError = null;
      break;
    case LOG_IN_SUCCESS:
      draft.logInLoading = false;
      draft.logInDone = true;
      if (action.data === 'Activate 2FA') {
        draft.activate2FA = true;
      } else {
        draft.me = action.data;
      }
      break;
    case LOG_IN_FAILURE:
      draft.logInLoading = false;
      draft.logInDone = false;
      draft.logInError = action.error;
      break;
    case CLOSE_OTP_FORM_REQUEST:
      draft.activate2FA = false;
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
    case UPLOAD_PROFILE_IMAGE_REQUEST:
      draft.uploadProfileImgLoading = true;
      draft.uploadProfileImgDone = false;
      draft.uploadProfileImgError = null;
      break;
    case UPLOAD_PROFILE_IMAGE_SUCCESS:
      draft.uploadProfileImgLoading = false;
      draft.uploadProfileImgDone = true;
      draft.profileImgPath = action.data;
      break;
    case UPLOAD_PROFILE_IMAGE_FAILURE:
      draft.uploadProfileImgLoading = false;
      draft.uploadProfileImgError = action.error;
      break;
    case REMOVE_PROFILE_IMAGE:
      draft.profileImgPath = '';
      break;
    case UPDATE_USER_PROFILE_REQUEST:
      draft.updateUserProfileLoading = true;
      draft.updateUserProfileDone = false;
      draft.updateUserProfileError = null;
      break;
    case UPDATE_USER_PROFILE_SUCCESS:
      draft.updateUserProfileLoading = false;
      draft.updateUserProfileDone = true;
      break;
    case UPDATE_USER_PROFILE_FAILURE:
      draft.updateUserProfileLoading = false;
      draft.updateUserProfileError = action.error;
      break;
    case UPDATE_USER_EMAIL_REQUEST:
      draft.updateUserEmailLoading = true;
      draft.updateUserEmailDone = false;
      draft.updateUserEmailError = null;
      break;
    case UPDATE_USER_EMAIL_SUCCESS:
      draft.updateUserEmailLoading = false;
      draft.updateUserEmailDone = true;
      break;
    case UPDATE_USER_EMAIL_FAILURE:
      draft.updateUserEmailLoading = false;
      draft.updateUserEmailError = action.error;
      break;
    case UPDATE_USER_PASSWORD_REQUEST:
      draft.updateUserPasswordLoading = true;
      draft.updateUserPasswordDone = false;
      draft.updateUserPasswordError = null;
      break;
    case UPDATE_USER_PASSWORD_SUCCESS:
      draft.updateUserPasswordLoading = false;
      draft.updateUserPasswordDone = true;
      break;
    case UPDATE_USER_PASSWORD_FAILURE:
      draft.updateUserPasswordLoading = false;
      draft.updateUserPasswordError = action.error;
      break;
    default:
      break;
  }
});

export default reducer;
