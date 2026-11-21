'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Thermometer, Flame, ArrowRight, Check } from 'lucide-react';

interface CrustOption {
  id: string;
  name: string;
  subtitle: string;
  temp: string;
  bakeTime: string;
  ferment: string;
  description: string;
  recommendedCategory: string;
}

const crustOptions: CrustOption[] = [
  {
    id: 'neapolitan',
    name: 'Neapolitan wood-fired',
    subtitle: 'Vera pizza napoletana',
    temp: '480°C / 900°F',
    bakeTime: '90 seconds',
    ferment: '72h cold fermentation',
    description: 'Light, blistered cornicione with charred leopard spots, baked over volcanic stone.',
    recommendedCategory: 'Classic Pizzas',
  },
  {
    id: 'ny-crisp',
    name: 'New York artisan crisp',
    subtitle: 'Thin, charred and foldable',
    temp: '320°C / 600°F',
    bakeTime: '6 minutes',
    ferment: '48h slow proof',
    description: 'Crisp undercarriage with a firm bite, low-moisture whole-milk mozzarella.',
    recommendedCategory: 'Meat Lovers',
  },
  {
    id: 'sicilian',
    name: 'Sicilian stone pan',
    subtitle: 'Focaccia crust with olive oil',
    temp: '260°C / 500°F',
    bakeTime: '12 minutes',
    ferment: '36h focaccia proof',
    description: 'Thick, airy crumb with golden olive-oil fried edges baked in seasoned steel pans.',
    recommendedCategory: 'Specialty / Gourmet Pizzas',
  },
];

const sizeOptions = [
  { id: '10', label: '10" Individual', slices: '4 slices', feeds: '1 person', basePrice: 14.5 },
  { id: '12', label: '12" Classic', slices: '6 slices', feeds: '2 people', basePrice: 18.5 },
  { id: '16', label: '16" Sharing', slices: '8 slices', feeds: '3 to 4 people', basePrice: 24.0 },
];

export const PizzaVisualizer = () => {
  const [selectedCrust, setSelectedCrust] = useState<string>('neapolitan');
  const [selectedSize, setSelectedSize] = useState<string>('12');
  const [spiceLevel, setSpiceLevel] = useState<string>('medium');

  const currentCrust = crustOptions.find((c) => c.id === selectedCrust) || crustOptions[0];
  const currentSize = sizeOptions.find((s) => s.id === selectedSize) || sizeOptions[1];

  const calculatePrice = () => {
    let price = currentSize.basePrice;
    if (spiceLevel === 'spicy') price += 2.0;
    return price.toFixed(2);
  };

  return (
    <section className="rounded-2xl bg-white dark:bg-[#141416] border border-black/[0.08] dark:border-white/[0.08] p-6 sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Controls */}
        <div className="lg:col-span-7 space-y-7">
          <div className="space-y-2">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Baking guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
              Crust profile and baking standards
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-lg leading-relaxed">
              Every kitchen on PizzaHub follows verified proofing and temperature standards. Compare dough styles, portion sizes, and heat profiles.
            </p>
          </div>

          {/* 1. Crust Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
              1. Crust style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {crustOptions.map((crust) => (
                <button
                  key={crust.id}
                  type="button"
                  onClick={() => setSelectedCrust(crust.id)}
                  className={`p-3.5 rounded-xl border text-left transition-colors relative ${
                    selectedCrust === crust.id
                      ? 'bg-stone-50 dark:bg-white/[0.06] border-stone-900 dark:border-white text-stone-900 dark:text-white'
                      : 'border-black/[0.08] dark:border-white/[0.08] text-stone-600 dark:text-stone-400 hover:border-black/[0.2] dark:hover:border-white/[0.2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-stone-900 dark:text-stone-100">{crust.name}</span>
                    {selectedCrust === crust.id && (
                      <Check className="w-3.5 h-3.5 text-stone-900 dark:text-stone-100" />
                    )}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">{crust.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Size Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
              2. Portion size
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {sizeOptions.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size.id)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-colors ${
                    selectedSize === size.id
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium border-transparent'
                      : 'border-black/[0.08] dark:border-white/[0.08] text-stone-600 dark:text-stone-400 hover:border-black/[0.2] dark:hover:border-white/[0.2]'
                  }`}
                >
                  <div className="text-xs font-medium">{size.label}</div>
                  <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">{size.slices}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Heat Profile */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
              3. Seasoning intensity
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'mild', label: 'Herb and sweet basil' },
                { id: 'medium', label: 'Classic pepperoni' },
                { id: 'spicy', label: 'Calabrian chili (+$2.00)' },
              ].map((spice) => (
                <button
                  key={spice.id}
                  type="button"
                  onClick={() => setSpiceLevel(spice.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    spiceLevel === spice.id
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent'
                      : 'border-black/[0.08] dark:border-white/[0.08] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {spice.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technical Spec Card */}
        <div className="lg:col-span-5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#18181b] p-6 space-y-5">
          <div className="flex items-start justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
            <div>
              <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                Specification
              </span>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                {currentCrust.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Base price</span>
              <span className="text-xl font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                ${calculatePrice()}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {currentCrust.description}
          </p>

          {/* Metric Rows */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#141416]">
              <div className="flex items-center space-x-1.5 text-stone-400 text-xs mb-1">
                <Thermometer className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-[11px]">Hearth</span>
              </div>
              <div className="text-xs font-medium text-stone-900 dark:text-stone-100 tabular-nums">
                {currentCrust.temp}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#141416]">
              <div className="flex items-center space-x-1.5 text-stone-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-[11px]">Bake</span>
              </div>
              <div className="text-xs font-medium text-stone-900 dark:text-stone-100 tabular-nums">
                {currentCrust.bakeTime}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#141416]">
              <div className="flex items-center space-x-1.5 text-stone-400 text-xs mb-1">
                <Flame className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-[11px]">Proof</span>
              </div>
              <div className="text-xs font-medium text-stone-900 dark:text-stone-100 tabular-nums">
                {currentCrust.ferment}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={`/menu?category=${encodeURIComponent(currentCrust.recommendedCategory)}`}
              className="w-full py-2.5 px-4 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white font-medium text-xs text-center flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Browse {currentCrust.recommendedCategory}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
