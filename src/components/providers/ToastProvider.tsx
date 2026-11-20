'use client';

import React from 'react';
import { Toaster } from 'sileo';
import 'sileo/styles.css';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      offset={{ top: 24 }}
      theme="light"
      options={{
        fill: '#18120E',
        roundness: 18,
        duration: 4500,
        autopilot: { expand: 120, collapse: 3600 },
        styles: {
          title: '!text-[14px] !font-semibold !tracking-tight !text-[#FAF7F2]',
          description: '!text-[13px] !text-stone-300',
        },
      }}
    />
  );
}
