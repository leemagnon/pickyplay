export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';

export const loginAction = (data: any) => ({
  type: 'LOG_IN',
  data,
});

export const logoutAction = () => ({
  type: 'LOG_OUT',
});
