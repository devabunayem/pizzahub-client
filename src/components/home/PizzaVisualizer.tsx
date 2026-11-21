'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Clock, Thermometer, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    name: 'Neapolitan Wood-Fired',
    subtitle: 'Vera Pizza Napoletana',
    temp: '480°C / 900°F',
    bakeTime: '90 Seconds',
    ferment: '72h Cold Fermented',
    description: 'Blistered leopard spots, light airy cornicione, San Marzano tomato sauce foundation.',
    recommendedCategory: 'Classic Pizzas',
  },
  {
    id: 'ny-crisp',
    name: 'New York Artisan Crisp',
    subtitle: 'Thin, Charred & Foldable',
    temp: '320°C / 600°F',
    bakeTime: '6 Minutes',
    ferment: '48h Slow Proof',
    description: 'Crisp undercarriage with a golden crunch, melted low-moisture whole milk mozzarella.',
    recommendedCategory: 'Meat Lovers',
  },
  {
    id: 'sicilian',
    name: 'Sicilian Deep Stone Pan',
    subtitle: 'Golden Focaccia Crust',
    temp: '260°C / 500°F',
    bakeTime: '12 Minutes',
    ferment: '36h Focaccia Proof',
    description: 'Thick, pillow-soft interior with caramelized olive oil edges baked in seasoned steel pans.',
    recommendedCategory: 'Specialty / Gourmet Pizzas',
  },
];

const sizeOptions = [
  { id: '10', label: '10" Solo', slices: '4 Slices', feeds: '1 Person', basePrice: 14.5 },
  { id: '12', label: '12" Classic', slices: '6 Slices', feeds: '2 People', basePrice: 18.5 },
  { id: '16', label: '16" Feast', slices: '8 Slices', feeds: '3-4 People', basePrice: 24.0 },
];

export const PizzaVisualizer = () => {
  const [selectedCrust, setSelectedCrust] = useState<string>('neapolitan');
  const [selectedSize, setSelectedSize] = useState<string>('12');
  const [spiceLevel, setSpiceLevel] = useState<string>('hot');

  const currentCrust = crustOptions.find((c) => c.id === selectedCrust) || crustOptions[0];
  const currentSize = sizeOptions.find((s) => s.id === selectedSize) || sizeOptions[1];

  const calculatePrice = () => {
    let price = currentSize.basePrice;
    if (spiceLevel === 'calabrian') price += 2.0;
    return price.toFixed(2);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0a0a0b] text-white border-2 border-stone-800 p-6 sm:p-10 lg:p-12 shadow-2xl">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Controls & Specification */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-black tracking-widest uppercase bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Crust Lab</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-[1.05]">
              Calibrate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Perfect Slice</span>
            </h2>
            <p className="text-sm text-stone-400 mt-2 max-w-xl">
              Choose your artisan crust foundation, slice size, and heat profile. Every pizzeria on PizzaHub bakes to authentic artisanal standards.
            </p>
          </div>

          {/* 1. Crust Selection */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              1. Select Wood-Fired Crust Type
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {crustOptions.map((crust) => (
                <button
                  key={crust.id}
                  onClick={() => setSelectedCrust(crust.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                    selectedCrust === crust.id
                      ? 'bg-stone-900 border-red-500 text-white shadow-lg shadow-red-500/10'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                  }`}
                >
                  {selectedCrust === crust.id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                  <div className="font-black text-sm text-white pr-4">{crust.name}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{crust.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Size Selection */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              2. Choose Diameter & Feast Size
            </span>
            <div className="grid grid-cols-3 gap-3">
              {sizeOptions.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`py-3 px-2 rounded-xl border text-center transition-all ${
                    selectedSize === size.id
                      ? 'bg-red-600 border-red-500 text-white font-black shadow-lg shadow-red-600/20'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-white'
                  }`}
                >
                  <div className="text-sm font-black">{size.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{size.slices} • {size.feeds}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Heat Profile */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              3. Heat & Spicing Intensity
            </span>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'mild', label: '🌿 Herb & Garlic (Mild)' },
                { id: 'hot', label: '🔥 Artisan Pepperoni (Medium)' },
                { id: 'calabrian', label: '🌶️ Calabrian Chili Fire (Fiery +$2.00)' },
              ].map((spice) => (
                <button
                  key={spice.id}
                  onClick={() => setSpiceLevel(spice.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all ${
                    spiceLevel === spice.id
                      ? 'bg-stone-800 border-orange-500 text-orange-400'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {spice.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Recipe & Spec Stamped Card */}
        <div className="lg:col-span-5 bg-stone-950 rounded-2xl border-2 border-stone-800 p-6 sm:p-8 space-y-6 relative">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-red-500">
                SPECIFICATION SHEET
              </div>
              <h3 className="text-xl font-black tracking-tight text-white mt-0.5">
                {currentCrust.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Est. Price</span>
              <span className="text-2xl font-black tabular-nums text-white">${calculatePrice()}</span>
            </div>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed italic">
            "{currentCrust.description}"
          </p>

          {/* Live Metric Badges */}
          <div className="grid grid-cols-3 gap-3 text-center py-2">
            <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
              <Thermometer className="w-4 h-4 mx-auto text-red-500 mb-1" />
              <div className="text-[10px] font-bold text-stone-400 uppercase">Oven Heat</div>
              <div className="text-xs font-black text-white mt-0.5">{currentCrust.temp}</div>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
              <Clock className="w-4 h-4 mx-auto text-orange-400 mb-1" />
              <div className="text-[10px] font-bold text-stone-400 uppercase">Bake Time</div>
              <div className="text-xs font-black text-white mt-0.5">{currentCrust.bakeTime}</div>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
              <Flame className="w-4 h-4 mx-auto text-yellow-400 mb-1" />
              <div className="text-[10px] font-bold text-stone-400 uppercase">Proofing</div>
              <div className="text-xs font-black text-white mt-0.5">{currentCrust.ferment}</div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={`/menu?category=${encodeURIComponent(currentCrust.recommendedCategory)}`}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center space-x-2 shadow-xl shadow-red-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore {currentCrust.recommendedCategory}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
