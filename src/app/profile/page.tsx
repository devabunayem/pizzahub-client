'use client';

import React from 'react';
import { ProfileSettingsPanel } from '@/components/profile/ProfileSettingsPanel';

export default function ProfileSettingsPage() {
  return (
    <section className="min-h-[82vh] bg-[#FAF7F2] py-10 md:py-14">
      <div className="site-container">
        <ProfileSettingsPanel />
      </div>
    </section>
  );
}
