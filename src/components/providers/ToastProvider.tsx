'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      containerStyle={{
        top: 88,
        right: 20,
        zIndex: 100,
      }}
      toastOptions={{
        duration: 4200,
      }}
    />
  );
}
