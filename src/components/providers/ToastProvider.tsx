'use client';

import React from 'react';
import { Toaster } from 'sileo';
import 'sileo/styles.css';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      theme="system"
      options={{
        roundness: 12,
        duration: 4500,
      }}
    />
  );
}
