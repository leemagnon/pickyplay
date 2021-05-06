import React, { useCallback, useState } from 'react';
import { Input, Background } from '@pages/LoggingIn/styles';

const LoggingIn = () => {
  return (
    <Background>
      <Input placeholder={'react'} />
    </Background>
  );
};

export default LoggingIn;
