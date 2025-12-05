"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
// Find this line at the top and update it:
import { ArrowRight, Camera, Mic, Bell, Heart, Check, ShoppingBag, Square, Search, ChevronLeft, Share2, X, Mail, Lock, Eye, EyeOff, Upload, Sparkles, Layers, ArrowUpRight, Plus,Shirt, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform  } from "framer-motion";



// --- COLOR PALETTE DEFINITIONS ---
// Primary Accent: #5a00e0 (Deep Purple)
// Secondary Accent: #714cfe (Bright Purple)
// Background: #f9fafc (Light White/Gray)
// Dark Text/UI: #4f4f4f

// --- Mock Data & Assets ---
const IMAGES = {
  onboarding1: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
  onboarding2: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
  onboarding3: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
  stylistBg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop", 
  // For the new Home Feed:
  feed: [
    { id: 1, src: "/nydp8w9r6dofmfqpykso.avif", outfit: 'Casual Chic Ensemble', price: 249, topPrice: 120, bottomPrice: 129, link: "https://example.com/outfit1" },
    { id: 2, src: "/stm7ebkejuqgrk88jwyp.avif", outfit: 'Elegant Evening Wear', price: 499, topPrice: 250, bottomPrice: 249, link: "https://example.com/outfit2" },
    { id: 3, src: "/to6adxfkrspltytgo4rf.avif", outfit: 'Power Suit Look', price: 380, topPrice: 190, bottomPrice: 190, link: "https://example.com/outfit3" },
    { id: 4, src: "to6adxfkrspltytgo4rf.avif", outfit: 'Urban Street Style', price: 180, topPrice: 90, bottomPrice: 90, link: "https://example.com/outfit4" },
    { id: 5, src: "/v1fttakwgpjz1ttefruq.webp", outfit: 'Boho Summer Vibes', price: 210, topPrice: 100, bottomPrice: 110, link: "https://example.com/outfit5" },
    { id: 6, src: "/stm7ebkejuqgrk88jwyp.avif", outfit: 'Classic Denim Day', price: 150, topPrice: 70, bottomPrice: 80, link: "https://example.com/outfit6" },
    { id: 7, src: "/v1fttakwgpjz1ttefruq.webp", outfit: 'Layered Autumn Look', price: 320, topPrice: 150, bottomPrice: 170, link: "https://example.com/outfit7" },
    { id: 8, src: "/v1fttakwgpjz1ttefruq.webp", outfit: 'Sporty Casual', price: 130, topPrice: 60, bottomPrice: 70, link: "https://example.com/outfit8" },
  ],
  tryOnModel: "/download.jpg", 
  tryOnClothes: "/download.jpg", 
};

const OUTFITS = [
  {
    id: 101,
    title: "Urban Minimalist",
    description: "Effortless styling for the modern creative.",
    mainImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop", // Full body shot
    totalPrice: 245,
    pieces: [
      { id: 'p1', name: "Oversized Linen Blazer", price: 120, type: 'top', image: "/nydp8w9r6dofmfqpykso.avif" },
      { id: 'p2', name: "Pleated Wide Leg Trousers", price: 85, type: 'bottom', image: "/stm7ebkejuqgrk88jwyp.avif" },
      
    ]
  },
  {
    id: 102,
    title: "Dark Academia",
    description: "Classic textures meeting modern silhouettes.",
    mainImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    totalPrice: 180,
    pieces: [
      { id: 'p4', name: "Wool Knit Turtleneck", price: 60, type: 'top', image: "/to6adxfkrspltytgo4rf.avif" },
      { id: 'p5', name: "Plaid Midi Skirt", price: 55, type: 'bottom', image: "/try.webp" }
    ]
  },
  {
    id: 101,
    title: "Urban Minimalist",
    description: "Effortless styling for the modern creative.",
    mainImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop", // Full body shot
    totalPrice: 245,
    pieces: [
      { id: 'p1', name: "Oversized Linen Blazer", price: 120, type: 'top', image: "/v1fttakwgpjz1ttefruq.webp" },
      { id: 'p2', name: "Pleated Wide Leg Trousers", price: 85, type: 'bottom', image: "/try.webp" },
      
    ]
  }
];


// SVG Path definitions for Body Shapes
const BodyShapeIcons = ({ type, color }) => {
  const stroke = color;
  const fill = color === "#ffffff" ? "none" : `${color}20`; 

  const shapes = {
    hourglass: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
        <path d="M30,20 Q30,50 45,50 Q60,50 70,50 Q70,20 70,20 L30,20 M30,80 Q30,50 45,50 Q60,50 70,50 Q70,80 70,80 L30,80" 
              stroke={stroke} strokeWidth="3" fill={fill} strokeLinecap="round" />
        <line x1="45" y1="50" x2="55" y2="50" stroke={stroke} strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    ),
    triangle: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M40,20 L60,20 Q65,40 75,80 L25,80 Q35,40 40,20" 
              stroke={stroke} strokeWidth="3" fill={fill} strokeLinecap="round" />
      </svg>
    ),
    rectangle: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
         <rect x="35" y="20" width="30" height="60" rx="5" 
               stroke={stroke} strokeWidth="3" fill={fill} />
      </svg>
    ),
    oval: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="50" rx="20" ry="30" 
                 stroke={stroke} strokeWidth="3" fill={fill} />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M25,20 L75,20 Q70,45 60,80 L40,80 Q30,45 25,20" 
              stroke={stroke} strokeWidth="3" fill={fill} strokeLinecap="round" />
      </svg>
    )
  };
  return shapes[type] || null;
};

// --- 2. UPDATED COMPONENT: 3D FLOAT WHEEL PICKER ---
const WheelPicker = ({ min, max, value, onChange, unit = "" }) => {
  const containerRef = useRef(null);
  const itemHeight = 80; // Increased height for better spacing
  const [activeIndex, setActiveIndex] = useState(0);

  // Generate range array
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // Sync scroll on mount
  useEffect(() => {
    if (containerRef.current) {
      const index = range.indexOf(value);
      if (index !== -1) {
        containerRef.current.scrollTop = index * itemHeight;
        setActiveIndex(index);
      }
    }
  }, []); 

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    // Calculate which index is centered
    const index = Math.round(scrollTop / itemHeight);
    setActiveIndex(index);

    const newValue = range[index];
    if (newValue && newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative w-full h-[320px] flex justify-center items-center overflow-hidden">
      
      {/* The Magic Mask: 
         This creates the "fade into nothing" effect at top and bottom 
         without using solid color divs. The center is fully visible.
      */}
      <div 
        style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%)'
        }}
        className="w-full h-full"
      >
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="w-full h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-[120px]" // Padding centers the first/last item
            style={{ scrollBehavior: 'smooth' }}
          >
            {range.map((num, idx) => {
              // Calculate distance from center to determine 3D effect
              const distance = Math.abs(activeIndex - idx);
              const isCenter = distance === 0;
              const isNear = distance === 1;

              return (
                <div 
                  key={num} 
                  onClick={() => {
                      if(containerRef.current) {
                          containerRef.current.scrollTo({
                              top: idx * itemHeight,
                              behavior: 'smooth'
                          });
                      }
                  }}
                  className={`h-[80px] flex items-center justify-center snap-center transition-all duration-500 ease-out cursor-pointer origin-center`}
                  style={{
                      // 3D Transforms based on distance from center
                      transform: isCenter ? 'scale(1.2)' : isNear ? 'scale(0.9)' : 'scale(0.7)',
                      opacity: isCenter ? 1 : isNear ? 0.4 : 0.1,
                      filter: isCenter ? 'blur(0px)' : 'blur(2px)',
                  }}
                >
                  <div className="flex items-baseline gap-1">
                      <span className={`font-bold tracking-tighter transition-colors duration-300 ${isCenter ? 'text-6xl text-[#00ff9d] drop-shadow-[0_0_15px_rgba(0,255,157,0.6)]' : 'text-5xl text-white'}`}>
                        {num}
                      </span>
                      {isCenter && (
                          <span className="text-sm font-bold text-[#00ff9d] uppercase tracking-widest mb-2 animate-pulse">
                              {unit}
                          </span>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};
// Helper to format Height (Inches -> Ft' In")
const formatHeight = (inches) => {
    const ft = Math.floor(inches / 12);
    const remain = inches % 12;
    return `${ft}' ${remain}"`;
};

// Helper to format Weight (Lbs)
const formatWeight = (lbs) => {
    return `${lbs} lbs`;
};

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const containerStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};


// --- Main App Component ---
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('onboarding'); 
 
  const [selectedOutfit, setSelectedOutfit] = useState(null); 
  const [cart, setCart] = useState([]);
  const [isHomeBlurred, setIsHomeBlurred] = useState(false); 
  
  // 2. Add 'image' to your userProfile state
  const [userProfile, setUserProfile] = useState({ name: '', image: null, style: [], budget: '', size: '' });
  // Add this near your other useState hooks
 

  // Navigation Helper
  const navigateTo = useCallback((screen) => {
    setCurrentScreen(screen);
    setIsHomeBlurred(screen === 'tryon');
  }, []);

  const addToCart = (item) => {
    const itemToAdd = {
        id: Date.now(),
        outfit: item.outfit,
        price: item.price,
        src: item.src,
        topPrice: item.topPrice,
        bottomPrice: item.bottomPrice
    };
    setCart(prev => [...prev, itemToAdd]);
    setCurrentScreen('checkout'); 
    setIsHomeBlurred(false);
  };

  const closeTryOn = () => {
    setSelectedOutfit(null);
    setCurrentScreen('home');
    setIsHomeBlurred(false);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
   <div className="w-full h-screen bg-black text-gray-900 font-sans overflow-hidden relative flex justify-center items-center">
      {/* Mobile Container */}
      <div className="w-full h-full md:max-w-[400px] md:h-[850px] bg-[#f9fafc] relative shadow-2xl md:rounded-[40px] overflow-hidden flex flex-col">
        
        {/* Routing Logic */}
       {currentScreen === 'onboarding' && <Onboarding onNext={() => setCurrentScreen('auth')} />}
        
        {/* CHANGE 1: Auth now goes to 'upload' instead of 'quiz' */}
        {currentScreen === 'auth' && <Auth onComplete={(name) => { setUserProfile({...userProfile, name}); setCurrentScreen('upload'); }} />}
        
        {/* CHANGE 2: Add the PhotoUpload Screen here */}
        {currentScreen === 'upload' && <PhotoUpload userName={userProfile.name} onNext={(image) => { setUserProfile({...userProfile, image}); setCurrentScreen('quiz'); }} />}
        
        {currentScreen === 'quiz' && <AIStylistQuiz userName={userProfile.name} onComplete={(data) => { setUserProfile({...userProfile, ...data}); setCurrentScreen('analyzing'); }} />}
        {currentScreen === 'analyzing' && <Analyzing onComplete={() => setCurrentScreen('home')} />}
        
        {/* Home Feed is always rendered when in 'home' or 'tryon' mode to show background */}
        {(currentScreen === 'home' || currentScreen === 'tryon') && (
          <HomeFeed 
            onTryOn={(outfit) => { setSelectedOutfit(outfit); setCurrentScreen('tryon'); }} 
            addToCart={addToCart} 
            cartCount={cart.length}
            onCheckout={() => setCurrentScreen('checkout')}
          />
        )}

        {/* Try On Modal - Renders ON TOP of Home Feed */}
        {currentScreen === 'tryon' && selectedOutfit && (
          <TryOnScreen 
            outfit={selectedOutfit} 
            onClose={() => setCurrentScreen('home')} 
            addToCart={addToCart} 
          />
        )}

        {currentScreen === 'checkout' && (
          <Checkout 
            cart={cart} 
            onBack={() => setCurrentScreen('home')} 
            calculateTotal={calculateTotal} 
          />
        )}

      </div>
    </div>
  );
};

// --- 1. ONBOARDING SCREEN ---
const Onboarding = ({ onNext }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);

  // Carousel Interval
  useEffect(() => {
    if (!introComplete) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, [introComplete]);

  // Intro Splash Timer
  useEffect(() => {
    const timer = setTimeout(() => setIntroComplete(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div className="w-full h-full bg-[#f9fafc] relative font-inter overflow-hidden">
      
      {/* --- DYNAMIC BACKGROUND ATMOSPHERE --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 50, 0], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[-10%] right-[-20%] w-[400px] h-[400px] bg-[#5a00e0]/10 rounded-full blur-[80px]" />
        <motion.div animate={{ x: [0, -30, 0], y: [0, 40, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-[20%] left-[-20%] w-[300px] h-[300px] bg-[#714cfe]/10 rounded-full blur-[60px]" />
      </div>

      {/* --- SPLASH INTRO OVERLAY --- */}
      <AnimatePresence>
        {!introComplete && (
          <motion.div 
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center"
          >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "backOut" }}
                className="relative"
            >
                <h1 className="font-playfair text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#5a00e0] to-[#714cfe]">
                    Aazmaao
                </h1>
                <motion.div 
                    initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 bg-[#5a00e0] mt-2 rounded-full"
                />
            </motion.div>
            <motion.p 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }}
                className="mt-4 text-[#4f4f4f] text-xs tracking-[0.3em] uppercase"
            >
                Fashion meets AI
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <motion.div 
        variants={pageVariants} initial="initial" animate={introComplete ? "animate" : "initial"}
        className="w-full h-full flex flex-col relative z-10"
      >
        <div className="pt-14 pb-4 text-center">
          <motion.h1 className="font-playfair text-3xl font-bold tracking-tight text-[#5a00e0]">Aazmaao</motion.h1>
        </div>

        {/* 3D CAROUSEL */}
        <div className="flex-1 relative flex items-center justify-center perspective-1000">
          <AnimatePresence mode="popLayout">
              {[0, 1, 2].map((i) => {
                  const diff = (i - activeIndex + 3) % 3;
                  let zIndex = 10, scale = 0.9, rotate = 0, x = 0, opacity = 0.5, rotateY = 0;

                  if (diff === 0) { zIndex = 20; scale = 1.1; opacity = 1; rotateY = 0; }
                  else if (diff === 1) { zIndex = 10; scale = 0.85; rotate = 4; x = 70; opacity = 0.6; rotateY = -15; }
                  else { zIndex = 9; scale = 0.85; rotate = -4; x = -70; opacity = 0.6; rotateY = 15; }

                  return (
                      <motion.div 
                          key={i} layout
                          initial={false}
                          animate={{ zIndex, scale, rotate, x, opacity, rotateY }}
                          transition={{ type: "spring", stiffness: 150, damping: 20 }}
                          className="absolute w-60 h-76 rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden origin-center border-4 border-white"
                          style={{ transformStyle: "preserve-3d" }}
                      >
                          <img src={Object.values(IMAGES)[i]} alt="Fashion" className="w-full h-full object-cover" />
                          {/* Glass Reflection Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/40 mix-blend-overlay pointer-events-none"></div>
                      </motion.div>
                  )
              })}
          </AnimatePresence>
        </div>

        {/* BOTTOM TEXT AREA */}
        <div className="px-8 pb-12 pt-2 z-10">
          {/* 1. PUT THIS STYLE TAG RIGHT ABOVE YOUR RETURN OR INSIDE THE DIV */}
<style jsx>{`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Inter:wght@400;500&display=swap');
`}</style>

<motion.div 
  initial={{opacity:0, y:20}} 
  animate={{opacity:1, y:0}} 
  transition={{delay: 0.3}}
  className="flex flex-col items-center"
>
      {/* HEADLINE */}
   <h2 className="text-[28px] leading-[1.1] font-black text-center tracking-tight text-[#1a1a1a] mb-4 font-['Plus_Jakarta_Sans']">
  Welcome to 
  <span className='text-[#4c00c7]'> Aazmaao </span> 
  <br/>
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a00e0] to-[#8b2ce8]">
    Where Fashion Meets AI
  </span>
</h2>


      {/* SUBTITLE */}
      <p className="text-slate-500 text-center text-[15px] mb-8 px-4 leading-relaxed font-medium max-w-[380px] font-['Inter']">
          Upload your photo, get recommendations based on your moods 🎭, and our AI gives you the best clothes to try on instantly.
      </p>
</motion.div>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-2 mb-8">
             {[0,1,2].map(dot => (
               <motion.div key={dot} animate={{ width: activeIndex === dot ? 24 : 8, backgroundColor: activeIndex === dot ? '#5a00e0' : '#d1d5db' }} className="h-2 rounded-full" />
             ))}
          </div>

          {/* Call to Action */}
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="w-full bg-[#5a00e0] text-white py-5 rounded-[30px] font-bold text-sm tracking-widest uppercase shadow-[0_10px_30px_-10px_rgba(90,0,224,0.5)] relative overflow-hidden group"
          >
            <span className="relative z-10">Start Styling</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#5a00e0] via-[#714cfe] to-[#5a00e0] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
// --- 2. AUTH SCREEN ---
// --- 2. UPDATED AUTH SCREEN (Extraordinary Physics) ---
// --- 2. UPDATED AUTH SCREEN (Luxe & Extraordinary) ---
// --- 2. UPDATED AUTH SCREEN (Fixed) ---
// --- 2. UPDATED AUTH SCREEN (White Luxe + Purple/Green Gradient) ---
// --- ULTRA-SMOOTH INPUT COMPONENT (Moved outside to fix focus bug) ---
// --- ULTRA-SMOOTH INPUT COMPONENT (Preserved & Polished) ---
const LuxeInput = ({ label, type, value, onChange, icon: Icon, isPassword = false, delay, showPassword, setShowPassword }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  
  if (!Icon) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, type: "spring", stiffness: 300, damping: 24 }}
      className="relative mb-6 group"
    >
      {/* Icon - Static positioning for performance */}
      <div className={`absolute left-0 top-4 transition-colors duration-300 ${focused ? 'text-[#5a00e0]' : 'text-[#1a1a1a]/40'}`}>
        <Icon size={22} strokeWidth={1.5} />
      </div>

      {/* Input Field - Standard CSS transitions only */}
      <input 
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer w-full border-b border-gray-200 bg-transparent py-4 pl-10 pr-10 text-[#1a1a1a] text-lg outline-none transition-colors duration-300 placeholder-transparent font-medium tracking-tight"
        placeholder={label} 
        autoComplete="off"
        style={{ WebkitTapHighlightColor: 'transparent' }} // Mobile specific optimization
      />
      
      {/* Floating Label - Uses translate instead of layout reflows */}
      <label 
        className={`absolute left-10 pointer-events-none transition-all duration-300 ease-out origin-left font-inter
        ${(focused || hasValue) 
          ? "-top-2 text-[10px] font-bold text-[#5a00e0] tracking-[0.2em] uppercase" 
          : "top-4 text-base text-gray-400 font-normal tracking-wide"}`}
      >
        {label}
      </label>

      {/* Password Toggle */}
      {isPassword && (
          <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-4 text-gray-300 hover:text-[#5a00e0] transition-colors p-1"
          >
              {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
          </button>
      )}

      {/* Animated Bottom Border - GPU Accelerated Scale */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#5a00e0] to-[#8b5cf6] transition-transform duration-500 origin-left ${focused ? 'scale-x-100' : 'scale-x-0'}`}></div>
    </motion.div>
  );
};

const Auth = ({ onComplete }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!isLogin && !formData.name) return;
      setTimeout(() => onComplete(formData.name || 'Style Icon'), 500);
    };

    return (
      <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-inter bg-white">
        
        {/* --- 1. ULTRA-PERFORMANCE BACKGROUND (No Blur Filters) --- */}
        {/* We use direct CSS gradients which are hardware accelerated by default */}
        <div className="absolute inset-0 z-0">
           {/* Primary Gradient Mesh - Static & Fast */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(90,0,224,0.15)_0%,_transparent_50%),_radial-gradient(circle_at_100%_100%,_rgba(0,255,157,0.15)_0%,_transparent_50%)]"></div>
           
           {/* Subtle Grain Texture for "Editorial" Feel - Static Image */}
           <div className="absolute inset-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light"></div>
        </div>

        {/* --- 2. CONTENT CONTAINER --- */}
        <motion.div layout className="relative z-10 w-full max-w-[360px] px-6">
          
          {/* Typography Header */}
          <div className="mb-10 relative">
              <motion.h1 
                  layout
                  className="font-playfair text-[3.5rem] leading-[0.95] text-[#1a1a1a] mb-3 relative z-10"
              >
                  <AnimatePresence mode="wait">
                      {isLogin ? (
                          <motion.span
                              key="login"
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              className="block font-black tracking-tighter"
                          >
                              Welcome <br/> <span className="italic font-medium text-[#5a00e0]">Back.</span>
                          </motion.span>
                      ) : (
                          <motion.span
                              key="signup"
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              className="block font-black tracking-tighter"
                          >
                              {formData.name ? (
                                  <>
                                      Hello, <br/> 
                                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a00e0] via-[#7c3aed] to-[#5a00e0] italic font-bold tracking-normal">
                                          {formData.name.split(' ')[0]}
                                      </span>
                                  </>
                              ) : (
                                  <>
                                      Join <br/> 
                                      <span className="text-[#5a00e0]">Aazmaao.</span>
                                  </>
                              )}
                          </motion.span>
                      )}
                  </AnimatePresence>
              </motion.h1>
              
              <motion.p layout className="text-gray-500 text-sm font-medium tracking-wide">
                  {isLogin ? 'Sign in to access your wardrobe.' : 'Create your unique style profile.'}
              </motion.p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="relative z-20">
              <AnimatePresence mode="popLayout">
                  {!isLogin && (
                      <LuxeInput 
                          key="name" 
                          label="Full Name" 
                          type="text" 
                          icon={UserIcon}
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          delay={0.1} 
                      />
                  )}
              </AnimatePresence>
              
              <LuxeInput 
                  key="email" 
                  label="Email Address" 
                  type="email" 
                  icon={Mail}
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  delay={0.2} 
              />
              
              <LuxeInput 
                  key="password" 
                  label="Password" 
                  type="password" 
                  icon={Lock}
                  isPassword={true}
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  delay={0.3} 
              />

              {isLogin && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end mb-8 -mt-4">
                      <button type="button" className="text-[11px] font-bold text-[#1a1a1a] tracking-widest uppercase hover:text-[#5a00e0] transition-colors border-b border-transparent hover:border-[#5a00e0]">Forgot Password?</button>
                  </motion.div>
              )}

              {/* MAIN CTA BUTTON */}
              <motion.div layout className="relative group mt-10" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {/* Static shadow instead of animated glow for performance */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5a00e0] to-[#7c3aed] rounded-full opacity-30 blur-sm group-hover:opacity-60 transition duration-500"></div>
                  
                  <button className="relative w-full bg-[#0a0a0a] text-white h-16 rounded-full font-bold text-sm shadow-2xl flex items-center justify-center gap-4 overflow-hidden">
                      <span className="relative z-10 tracking-[0.2em] uppercase flex items-center gap-2 text-[13px] font-bold">
                          {isLogin ? 'Log In' : 'Start Styling'} <ArrowRight size={18} />
                      </span>
                      {/* Lightweight CSS Hover Effect */}
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                  </button>
              </motion.div>
          </form>

          {/* Footer & Socials */}
          <div className="mt-10 flex flex-col items-center gap-6 relative z-20">
              <div className="w-full flex items-center gap-4 opacity-60">
                  <div className="h-[1px] flex-1 bg-gray-200"></div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">Or continue with</span>
                  <div className="h-[1px] flex-1 bg-gray-200"></div>
              </div>

              <button className="w-full py-4 rounded-full border border-gray-200 bg-white flex items-center justify-center gap-3 text-sm font-bold text-[#1a1a1a] hover:bg-gray-50 hover:border-[#5a00e0] transition-all duration-300 group shadow-sm">
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
              </button>
              
              <p className="text-xs text-gray-400 font-medium">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-[#1a1a1a] font-bold tracking-wide hover:text-[#5a00e0] transition-colors underline decoration-2 decoration-[#5a00e0]/20 underline-offset-4">
                      {isLogin ? 'Sign Up' : 'Log In'}
                  </button>
              </p>
          </div>
        </motion.div>
      </div>
    );
  };
// --- 3. AI STYLIST / PREFERENCE QUIZ ---
// --- 3. UPDATED AI STYLIST QUIZ (Cinematic Editorial) ---

// --- NEW COMPONENT: PHOTO UPLOAD SCREEN ---
const PhotoUpload = ({ onNext, userName }) => {
  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      startScanning();
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    // Simulate AI Analysis
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => onNext(image), 800); // Auto-advance after scan
      }
    }, 30);
  };

  return (
    <div className="w-full h-full relative bg-[#121212] overflow-hidden font-inter text-white flex flex-col items-center justify-center p-6">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5a00e0]/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm text-center">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-[10px] font-bold text-[#00ff9d] tracking-[0.25em] uppercase border border-[#00ff9d]/30 px-3 py-1 rounded-full backdrop-blur-md">
            Step 1 of 2
          </span>
          <h1 className="font-playfair text-3xl font-bold mt-6 mb-2">
            Let's see you, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a00e0] to-[#714cfe]">{userName || 'Style Icon'}</span>.
          </h1>
          <p className="text-gray-400 text-sm">Upload a photo so our AI can analyze your skin tone and features.</p>
        </motion.div>

        {/* Upload Area / Scanner */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="relative w-full aspect-[3/4] rounded-[32px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl group"
        >
          {image ? (
            <>
              {/* The Uploaded Image */}
              <img src={image} alt="User" className="w-full h-full object-cover" />
              
              {/* Scanning Overlay Animation */}
              {isScanning && (
                <div className="absolute inset-0 z-20">
                  <motion.div 
                    initial={{ top: 0 }} 
                    animate={{ top: "100%" }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-[#00ff9d] shadow-[0_0_20px_#00ff9d]"
                  />
                  <div className="absolute inset-0 bg-[#00ff9d]/10" />
                  
                  {/* Analysis Text */}
                  <div className="absolute bottom-6 left-0 w-full text-center">
                    <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#00ff9d]/30">
                        <Sparkles size={14} className="text-[#00ff9d] animate-spin-slow" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00ff9d]">
                            Analyzing Skin Tone {scanProgress}%
                        </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              
              <div className="w-20 h-20 rounded-full border border-dashed border-white/30 flex items-center justify-center mb-4 group-hover:border-[#5a00e0] group-hover:scale-110 transition-all duration-300">
                <Upload size={24} className="text-white/50 group-hover:text-[#5a00e0]" />
              </div>
              <span className="text-sm font-bold text-white tracking-wide">Tap to Upload</span>
              <span className="text-xs text-gray-500 mt-2">or drag and drop</span>
            </label>
          )}

          {/* Corner Accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/20 rounded-tl-lg pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/20 rounded-tr-lg pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/20 rounded-bl-lg pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/20 rounded-br-lg pointer-events-none"></div>
        </motion.div>

        {/* Skip Button */}
        {!image && (
          <button onClick={() => onNext(null)} className="mt-8 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
};


const AIStylistQuiz = ({ userName = "Rohan", onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState(""); 
  const [direction, setDirection] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [pickerValue, setPickerValue] = useState(0);
  const [currentSelections, setCurrentSelections] = useState([]);

  // --- STEPS CONFIGURATION ---
  const steps = [
    {
      question: `Hi ${userName}, I'm Siena.`,
      subtext: "Let's curate your look. Select as many as you like.",
      options: ["Casual", "Workwear", "Social Occasions", "Active / Sport"], 
      key: 'category',
      type: 'selection'
    },
    {
      question: "Where do you like to shop?",
      subtext: "Select your favorite brands.",
      options: [
           "Zara", "H&M", "Nordstrom", "Banana Republic", "Madewell", 
           "Anthropologie", "Lululemon", "J.Crew", "Gap", "Old Navy", 
           "Target", "Amazon", "Macy's", "Shopbop", "Saks Fifth Avenue"
       ],
      key: 'brands',
      type: 'scrollable_selection'
    },
    {
      question: "What is your body shape?",
      subtext: "Select the shape that best matches you.",
      options: [
        { id: 'hourglass', label: "Hourglass", desc: "Shoulders & hips balanced, defined waist" },
        { id: 'triangle', label: "Triangle", desc: "Hips broader than shoulders" },
        { id: 'rectangle', label: "Rectangle", desc: "Shoulders, waist & hips aligned" },
        { id: 'oval', label: "Oval", desc: "Fuller midsection, undefined waist" },
        { id: 'heart', label: "Heart", desc: "Shoulders broader than hips" }
      ],
      key: 'body_shape',
      type: 'body_shape_special'
    },
    {
      question: "What denim styles do you like?",
      subtext: "Select your go-to fits.",
      options: ["Skinny", "Straight", "Bootcut", "Wide-leg", "High-rise", "Mid-rise", "Low-rise"],
      key: 'denim_style',
      type: 'selection'
    },
    {
       question: "Which colors do you want to avoid?",
       subtext: "I will exclude these from your selection.",
       options: [
           { label: "Reds", color: "#ef4444" },
           { label: "Pinks", color: "#ec4899" },
           { label: "Oranges", color: "#f97316" },
           { label: "Yellows", color: "#eab308" },
           { label: "Greens", color: "#22c55e" },
           { label: "Blues", color: "#3b82f6" },
           { label: "Purples", color: "#a855f7" },
           { label: "Browns", color: "#78350f" },
           { label: "Beiges", color: "#d6d3d1" },
           { label: "Grays", color: "#6b7280" },
           { label: "Whites", color: "#ffffff" },
           { label: "Blacks", color: "#000000" }
       ],
       key: 'avoid_colors',
       type: 'color_selection'
    },
    {
       question: "Do you want to avoid any of these?",
       subtext: "Select items you never wear.",
       options: ["Dresses", "Jackets", "Skirts", "Pants", "Shorts", "Jeans", "Shoes", "Bags", "Blazers", "Jewelry"],
       key: 'avoid_items',
       type: 'selection'
    },
    {
       question: "How tall are you?",
       subtext: "Scroll to select.",
       key: 'height',
       type: 'picker',
       min: 140, // cm
       max: 220, // cm
       defaultValue: 165,
       unit: "cm" 
    },
    {
       question: "What is your weight?",
       subtext: "Scroll to select.",
       key: 'weight',
       type: 'picker',
       min: 40, // kgs
       max: 150, // kgs
       defaultValue: 65,
       unit: "kg" 
    },
    {
      question: "What is your budget?",
      subtext: "Select all ranges that apply.",
      options: ["Under $100", "$100 - $300", "$300 - $800", "Luxury / No Limit"],
      key: 'budget',
      type: 'selection'
    }
  ];

  // Reset selections when step changes
  useEffect(() => {
    setCurrentSelections([]);
    setInputValue("");
    if (steps[step].type === 'picker') {
        setPickerValue(steps[step].defaultValue);
    }
  }, [step]);

  const handleOptionToggle = (option) => {
    const value = typeof option === 'object' ? option.label : option;
    setCurrentSelections(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value); 
      } else {
        return [...prev, value]; 
      }
    });
  };

  const handleNextStep = () => {
    const currentStepData = steps[step];
    const currentKey = currentStepData.key;
    
    let finalValue;
    if (currentStepData.type === 'input') {
        finalValue = inputValue;
    } else if (currentStepData.type === 'picker') {
        finalValue = pickerValue; 
    } else {
        finalValue = currentSelections;
    }

    setAnswers(prev => ({...prev, [currentKey]: finalValue}));
    setDirection(1);
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
      if(onComplete) onComplete({...answers, [currentKey]: finalValue});
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const currentStepData = steps[step];
  const progress = ((step + 1) / steps.length) * 100;
  
  const canProceed = currentStepData.type === 'input' 
    ? inputValue.trim().length > 0 
    : currentStepData.type === 'picker' 
        ? true 
        : currentSelections.length > 0;

  return (
    <div className="w-full h-full relative bg-[#121212] overflow-hidden font-inter text-white">
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#121212] z-10"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-10"></div>
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop" alt="Bg" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[30%] scale-105" />
      </div>

      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-6 z-20">
        <div className="flex justify-between items-center text-white/80 mb-6">
            <button 
                onClick={() => step > 0 && setStep(step - 1)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Siena AI</span>
            <div className="w-9"></div>
        </div>
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div 
                layout
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-[#5a00e0] to-[#00ff9d] shadow-[0_0_10px_#5a00e0]"
            />
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="absolute inset-0 flex flex-col pt-28 pb-32 px-6 z-20 overflow-y-auto no-scrollbar">
        
        <AnimatePresence mode="wait" custom={direction}>
            <motion.div 
                key={step}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex flex-col items-center text-center w-full max-w-md mx-auto h-full"
            >
                {/* Step Indicator */}
                <motion.span variants={itemVariants} className="text-[10px] font-bold text-[#00ff9d] tracking-widest uppercase mb-4 border border-[#00ff9d]/30 px-3 py-1 rounded-full backdrop-blur-md">
                    Step {step + 1}
                </motion.span>

                {/* Question */}
                <motion.h2 variants={itemVariants} className="font-playfair text-3xl md:text-4xl font-bold text-white mb-3 leading-[1.1] tracking-tight drop-shadow-xl">
                    {currentStepData.question}
                </motion.h2>
                <motion.p variants={itemVariants} className="text-gray-300 text-sm font-medium tracking-wide mb-8 max-w-xs leading-relaxed">
                    {currentStepData.subtext}
                </motion.p>

                {/* --- RENDERERS --- */}
                
                {/* 1. PICKER RENDERER (Updated 3D) */}
                {currentStepData.type === 'picker' && (
                    <motion.div variants={itemVariants} className="w-full">
                        <WheelPicker 
                            min={currentStepData.min}
                            max={currentStepData.max}
                            value={pickerValue}
                            onChange={setPickerValue}
                            unit={currentStepData.unit}
                        />
                    </motion.div>
                )}

                {/* 2. BODY SHAPE SPECIAL RENDERER */}
                {currentStepData.type === 'body_shape_special' && (
                    <motion.div variants={itemVariants} className="w-full grid grid-cols-2 gap-4 pb-10">
                         {currentStepData.options.map((opt, idx) => {
                             const isSelected = currentSelections.includes(opt.label);
                             
                             return (
                                 <motion.button 
                                     key={idx}
                                     whileTap={{ scale: 0.95 }}
                                     onClick={() => handleOptionToggle(opt)}
                                     className={`relative group overflow-hidden rounded-[24px] p-4 flex flex-col items-center gap-3 transition-all duration-300 border ${
                                         isSelected 
                                         ? "bg-[#00ff9d]/10 border-[#00ff9d] shadow-[0_0_30px_rgba(0,255,157,0.2)]" 
                                         : "bg-white/5 border-white/10 hover:bg-white/10"
                                     } ${currentStepData.options.length % 2 !== 0 && idx === currentStepData.options.length - 1 ? 'col-span-2' : ''}`}
                                 >
                                     {isSelected && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,157,0.15),transparent)]" />}
                                     <div className="w-16 h-16 md:w-20 md:h-20 relative z-10 transition-transform duration-300 group-hover:scale-110">
                                         <BodyShapeIcons type={opt.id} color={isSelected ? "#00ff9d" : "#ffffff"} />
                                     </div>
                                     <div className="flex flex-col gap-1 z-10">
                                         <span className={`text-sm font-bold uppercase tracking-wider ${isSelected ? "text-[#00ff9d]" : "text-white"}`}>
                                             {opt.label}
                                         </span>
                                         <span className="text-[10px] text-white/50 font-medium leading-tight px-2">
                                             {opt.desc}
                                         </span>
                                     </div>
                                     {isSelected && (
                                         <div className="absolute top-3 right-3 w-5 h-5 bg-[#00ff9d] rounded-full flex items-center justify-center shadow-lg">
                                             <Check size={12} className="text-black stroke-[3]" />
                                         </div>
                                     )}
                                 </motion.button>
                             )
                         })}
                    </motion.div>
                )}

                {/* 3. COLOR GRID RENDERER */}
                {currentStepData.type === 'color_selection' && (
                    <motion.div variants={itemVariants} className="w-full grid grid-cols-3 gap-3">
                        {currentStepData.options.map((opt, idx) => {
                            const isSelected = currentSelections.includes(opt.label);
                            return (
                                <motion.button 
                                    key={idx}
                                    onClick={() => handleOptionToggle(opt)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                                        isSelected 
                                        ? "bg-[#00ff9d]/10 border-[#00ff9d] shadow-[0_0_15px_rgba(0,255,157,0.2)]" 
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    <div className="relative w-10 h-10 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: opt.color }}>
                                         {opt.label === "Whites" && <div className="w-full h-full border border-gray-300 rounded-full" />}
                                         {isSelected && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                                                <Check size={16} className="text-white" />
                                            </div>
                                         )}
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-wider font-medium ${isSelected ? "text-[#00ff9d]" : "text-white"}`}>
                                        {opt.label}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}

                {/* 4. SCROLLABLE LIST RENDERER */}
                {currentStepData.type === 'scrollable_selection' && (
                    <motion.div variants={itemVariants} className="w-full h-[300px] overflow-y-auto pr-2 grid grid-cols-1 gap-3 custom-scrollbar">
                        {currentStepData.options.map((opt, idx) => {
                            const isSelected = currentSelections.includes(opt);
                            return (
                                <motion.button 
                                    key={idx}
                                    onClick={() => handleOptionToggle(opt)}
                                    className={`w-full py-4 px-6 rounded-xl border text-left transition-all flex justify-between items-center group ${
                                        isSelected
                                        ? "bg-[#00ff9d]/10 border-[#00ff9d]"
                                        : "bg-white/5 border-white/10 hover:bg-[#5a00e0]/20 hover:border-[#5a00e0]/50"
                                    }`}
                                >
                                    <span className={`text-sm font-medium tracking-wide ${isSelected ? "text-[#00ff9d]" : "text-white"}`}>{opt}</span>
                                    {isSelected ? (
                                        <Check size={16} className="text-[#00ff9d]" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-[#00ff9d]" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}

                {/* 5. STANDARD SELECTION */}
                {currentStepData.type === 'selection' && (
                     <motion.div variants={itemVariants} className="w-full grid grid-cols-2 gap-3">
                        {currentStepData.options.map((opt, idx) => {
                            const isSelected = currentSelections.includes(opt);
                            return (
                                <motion.button 
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleOptionToggle(opt)}
                                    className={`relative group backdrop-blur-xl border py-4 px-5 rounded-[20px] text-left transition-all duration-300 overflow-hidden flex items-center gap-5 ${
                                        isSelected 
                                        ? "bg-[#00ff9d]/10 border-[#00ff9d] shadow-[0_0_15px_rgba(0,255,157,0.15)]" 
                                        : "bg-white/5 border-white/10 text-white"
                                    }`}
                                >
                                    <span className={`font-medium tracking-wider text-xs md:text-sm uppercase ${isSelected ? "text-[#00ff9d]" : "text-white"}`}>
                                        {opt}
                                    </span>
                                    {isSelected && <div className="absolute inset-0 bg-[#00ff9d]/5" />}
                                </motion.button>
                            );
                        })}
                     </motion.div>
                )}

            </motion.div>
        </AnimatePresence>
      </div>

      {/* --- FLOATING CONTINUE BUTTON --- */}
      <AnimatePresence>
        {canProceed && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-28 left-0 w-full flex justify-center z-40 px-6"
            >
                <button 
                    onClick={handleNextStep}
                    className="w-full max-w-md bg-[#00ff9d] text-black font-bold uppercase tracking-widest text-sm py-4 rounded-full shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:bg-white hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    Continue <ArrowRight size={18} />
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTTOM SOUL UI --- */}
     
    </div>
  );
};

// --- NEW RESULT COMPONENT (Based on "Rustic Casual" screenshot) ---
const ResultScreen = ({ userName }) => {
    return (
        <div className="w-full h-full relative bg-[#121212] overflow-hidden font-inter text-white flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-[#121212]"></div>
            <div className="relative z-10 w-full max-w-md text-center">
                
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                    <h1 className="font-playfair text-4xl mb-2">You're a <span className="text-[#00ff9d] italic">Rustic Casual</span></h1>
                    <p className="text-white/60 text-xs tracking-widest uppercase mb-12">Analysis Complete</p>
                </motion.div>

                {/* Abstract Venn Diagram Representation using CSS Circles */}
                <div className="relative w-64 h-64 mx-auto mb-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                        className="absolute top-0 left-4 w-32 h-32 rounded-full bg-blue-600/80 mix-blend-screen flex items-center justify-center backdrop-blur-sm"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">Edgy</span>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                        className="absolute top-4 right-4 w-36 h-36 rounded-full bg-emerald-700/80 mix-blend-screen flex items-center justify-center backdrop-blur-sm"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">Heritage</span>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                        className="absolute bottom-2 left-12 w-28 h-28 rounded-full bg-amber-100/90 mix-blend-screen text-black flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left backdrop-blur-md">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Your style is multi-layered. You prioritize <span className="text-white font-bold">comfort and functionality</span> without compromising on style. Think pretty plaids, go-to denim, and soft fleece.
                    </p>
                </motion.div>
                
                <motion.button 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    className="mt-8 bg-[#00ff9d] text-black w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                >
                    View Your Wardrobe
                </motion.button>
            </div>
        </div>
    )
}



// --- 4. ANALYZING / LOADING STATE ---
// --- 4. UPDATED ANALYZING SCREEN (ELEGANT LIGHT MODE) ---
const Analyzing = ({ onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const fullText = "Analyzing Style Profile...";

    useEffect(() => {
        // Typing effect
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setDisplayText(prev => prev + fullText.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 80);

        const timer = setTimeout(onComplete, 3500);
        return () => {
            clearTimeout(timer);
            clearInterval(typingInterval);
        };
    }, [onComplete, fullText]);

    return (
        <div className="w-full h-full bg-white text-[#1a1a1a] flex flex-col items-center justify-center relative overflow-hidden font-inter">
            
            {/* --- 1. SUBTLE ATMOSPHERE --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[30%] left-[20%] w-64 h-64 bg-[#5a00e0]/5 rounded-full blur-[60px]"
                />
                 <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[30%] right-[20%] w-64 h-64 bg-[#00ff9d]/10 rounded-full blur-[60px]"
                />
            </div>

            {/* --- 2. THE PRISMATIC LENS (Compact & Impactful) --- */}
            <div className="relative z-10 mb-12">
                {/* Breathing Color Shadow */}
                <motion.div 
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#5a00e0] to-[#00ff9d] blur-xl opacity-60"
                />

                {/* The Lens Container */}
                <div className="relative w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden z-20">
                    
                    {/* Spinning Gradient Ring (Thin & Elegant) */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-1 rounded-full border-[3px] border-transparent border-t-[#5a00e0] border-r-[#00ff9d]"
                    />
                    
                    {/* Counter-Spinning Inner Ring */}
                    <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-3 rounded-full border-[1px] border-gray-100 border-b-gray-300"
                    />

                    {/* Central Icon */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 text-[#1a1a1a]"
                    >
                         <Camera size={32} strokeWidth={1.5} />
                    </motion.div>

                    {/* Glass Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                </div>
            </div>

            {/* --- 3. ELEGANT TYPOGRAPHY --- */}
            <div className="relative z-10 text-center">
                <h2 className="font-playfair text-2xl font-bold text-[#1a1a1a] tracking-tight mb-3 h-8">
                    {displayText}
                </h2>
                
                {/* Progress Bar */}
                <div className="w-48 h-[2px] bg-gray-100 rounded-full mx-auto overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3.5, ease: "easeInOut" }}
                        className="h-full bg-gradient-to-r from-[#5a00e0] to-[#00ff9d]"
                    />
                </div>
                
                <p className="mt-4 text-[10px] font-bold text-gray-400 tracking-[0.25em] uppercase">
                    Curating your wardrobe
                </p>
            </div>
        </div>
    );
};


const OutfitCard = ({ outfit, mixSelection, onToggleMix, onTryOn, addToCart }) => {
  const [activePiece, setActivePiece] = useState(outfit.pieces[0]);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);

  // Check if current active piece is in the global mix
  const isSelected = mixSelection[activePiece.type]?.id === activePiece.id;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="relative w-full mb-10 h-[520px] rounded-[36px] shadow-2xl overflow-hidden group cursor-pointer bg-white"
    >
      {/* 1. Main Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePiece.image}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img src={activePiece.image} alt={activePiece.name} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

      {/* 2. Floating Dock */}
      <div className="absolute bottom-0 left-0 w-full p-5 z-30 flex justify-center">
        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-white/30 p-3 shadow-2xl rounded-[28px] max-w-[95%] w-full flex flex-col gap-3 relative overflow-hidden"
        >
          {/* Piece Selectors */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar z-10">
            {outfit.pieces.map((piece) => {
               const isPieceInMix = mixSelection[piece.type]?.id === piece.id;
               
               return (
                <button
                    key={piece.id}
                    onClick={(e) => { e.stopPropagation(); setActivePiece(piece); }}
                    className={`relative flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-300
                    ${activePiece.id === piece.id ? 'border-white scale-110 shadow-lg' : 'border-white/30 opacity-70'}
                    `}
                >
                    <img src={piece.image} alt={piece.name} className="w-full h-full object-cover" />
                    
                    {/* The "Magic" Layout ID for flying animation */}
                    {isPieceInMix && (
                        <motion.div 
                            layoutId={`img-${piece.id}`} 
                            className="absolute inset-0 bg-green-500/20 z-20"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                        />
                    )}
                </button>
            )})}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20 z-10">
            <div className="flex flex-col text-white">
              <span className="text-[10px] uppercase font-bold opacity-70">{activePiece.type}</span>
              <span className="text-sm font-bold truncate w-24">{activePiece.name}</span>
            </div>

            {/* ACTION BUTTONS GROUP */}
            <div className="flex gap-2">
                
                {/* 1. INDIVIDUAL TRY ON (Restored) */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onTryOn(activePiece); }}
                  className="flex items-center gap-1.5 bg-white text-black px-3 py-2 rounded-full shadow-lg"
                >
                  <Layers size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Try On</span>
                </motion.button>

                {/* 2. BUY/LINK (Restored) */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/product/${activePiece.id}`, '_blank');
                    addToCart(activePiece);
                  }}
                  className="w-8 h-8 flex items-center justify-center bg-black/40 text-white border border-white/20 rounded-full hover:bg-black/60 transition-colors"
                >
                  <ArrowUpRight size={14} />
                </motion.button>

                {/* 3. ADD TO MIX (New Feature) */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onToggleMix(activePiece); }}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors border
                    ${isSelected 
                        ? 'bg-green-500 text-white border-green-400' 
                        : 'bg-[#5a00e0] text-white border-[#5a00e0]'}
                  `}
                >
                  {isSelected ? <Check size={14} /> : <Plus size={14} />}
                </motion.button>

            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- NEW COMPONENT: ULTRA MODERN NAVBAR ---
// --- 5. NAVBAR (Your Previous Code - Restored) ---
const UltraModernNavbar = ({ mixSelection, clearMix, onTryOnMix, cartCount, onCheckout }) => {
  const [activeTab, setActiveTab] = useState("home");
  const isMixMode = mixSelection.top || mixSelection.bottom;

  const navItems = [
    { id: "home", icon: Square, label: "Feed" },
    { id: "search", icon: Search, label: "Explore" },
    { id: "wishlist", icon: Heart, label: "Likes" },
    { id: "cart", icon: ShoppingBag, label: "Bag", isCart: true },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center px-4">
      {/* Floating Dock Container */}
      <motion.div
        layout
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
            y: 0, 
            opacity: 1,
            width: isMixMode ? "360px" : "350px", // Slight expansion for mix mode
            height: "70px",
            borderRadius: "32px"
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
        className="relative overflow-hidden"
      >
        {/* Glass Background with Gradient Border */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
           {/* Ambient Blue Glow inside the glass */}
           <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#5a00e0]/40 blur-[40px] rounded-full" />
        </div>

        {/* Content Area */}
        <div className="relative z-10 w-full h-full">
            <AnimatePresence mode="popLayout" initial={false}>
                {!isMixMode ? (
                    /* --- VIEW 1: STANDARD NAV --- */
                    <motion.div 
                        key="nav"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full h-full flex items-center justify-between px-4"
                    >
                        {/* LOGO (Animated) */}
                        <motion.div 
                            className="pl-2 pr-4 flex flex-col justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <h1 className="font-serif text-xl font-black text-white tracking-widest drop-shadow-md">
                            TryOn
                            </h1>
                        </motion.div>

                        {/* Icons Row */}
                        <div className="flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            if (item.id === "cart" && onCheckout) onCheckout();
                                        }}
                                        className="relative w-11 h-11 flex items-center justify-center rounded-full group outline-none"
                                    >
                                        {/* THE LIQUID PILL (Layout Animation) */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute inset-0 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        {/* Icon Layer */}
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.8 }}
                                            className="relative z-10"
                                        >
                                            <item.icon
                                                size={20}
                                                strokeWidth={2.5}
                                                className={`transition-colors duration-300 ${isActive ? "text-black" : "text-white/60 group-hover:text-white"}`}
                                            />
                                            {item.isCart && cartCount > 0 && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full border ${isActive ? "bg-black text-white border-transparent" : "bg-[#5a00e0] text-white border-[#2a2a2a]"}`}
                                                >
                                                    {cartCount}
                                                </motion.span>
                                            )}
                                        </motion.div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    /* --- VIEW 2: MIX MODE DOCK --- */
                    <motion.div 
                        key="mix"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full h-full flex items-center justify-between px-6"
                    >
                         {/* Selected Pieces Preview (Destination for flying animations) */}
                        <div className="flex items-center">
                            {['top', 'bottom'].map((type) => (
                                <div key={type} className="relative w-11 h-11 rounded-full border-2 border-white/10 bg-white/5 overflow-hidden -ml-3 first:ml-0 shadow-lg ring-1 ring-black/40">
                                    {mixSelection[type] ? (
                                        <motion.img 
                                            layoutId={`img-${mixSelection[type].id}`} 
                                            src={mixSelection[type].image} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                            <Shirt size={16} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                         {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={clearMix}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                             >
                                <X size={20} />
                             </button>
                             <motion.button
                                layout
                                onClick={onTryOnMix}
                                whileTap={{ scale: 0.95 }}
                                disabled={!mixSelection.top && !mixSelection.bottom}
                                className={`h-10 px-5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all
                                    ${(mixSelection.top || mixSelection.bottom) 
                                        ? 'bg-[#5a00e0] text-white shadow-[#5a00e0]/40' 
                                        : 'bg-white/10 text-white/30 cursor-not-allowed'}
                                `}
                             >
                                <span>Try On</span>
                                <Sparkles size={14} />
                             </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// --- 6. UPDATED HOME FEED (Aazmaao Zen) ---
const HomeFeed = ({ onTryOn, addToCart, cartCount = 2, onCheckout }) => {
  // Global State for the "Mix"
  // This allows selecting a Top from Card A and a Bottom from Card B
  const [mixSelection, setMixSelection] = useState({ top: null, bottom: null });

  const togglePiece = (piece) => {
     setMixSelection(prev => {
         // If clicking same piece, remove it
         if (prev[piece.type]?.id === piece.id) {
             return { ...prev, [piece.type]: null };
         }
         // Otherwise, replace/add for that category (top/bottom)
         return { ...prev, [piece.type]: piece };
     });
  };

  const clearMix = () => setMixSelection({ top: null, bottom: null });

  return (
    <div className="w-full h-full relative flex flex-col bg-[#f2f4f8] overflow-hidden font-sans">
      
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
         {Array.from({ length: 15 }).map((_, i) => (
             <motion.div
                key={i}
                initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
                animate={{ y: [null, Math.random() * -100], opacity: [0, 0.5, 0] }}
                transition={{ duration: Math.random() * 10 + 10, repeat: Infinity }}
                className="absolute w-1 h-1 bg-[#5a00e0] rounded-full blur-[1px]"
             />
         ))}
      </div>

      {/* Header */}
    
      {/* --- 2. COMPACT HEADER (Aazmaao Branding) --- */}
      <div className="absolute top-0 left-0 w-full z-30 bg-white/60 backdrop-blur-xl border-b border-white/40 pt-10 pb-3 flex justify-between items-center px-6 shadow-sm">
        <div>
           <p className="text-[9px] font-bold text-gray-400 tracking-[0.25em] uppercase mb-0.5">Welcome</p>
           <h1 className="font-playfair text-xl font-black text-[#1a1a1a] tracking-tight">
              Aazmaao <span className="text-[#5a00e0] font-light italic">AI</span>
           </h1>
        </div>
        
        <div className="flex gap-3 items-center">
          <button className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-sm hover:scale-105 transition-transform">
            <Bell size={18} className="text-gray-700" />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/80 shadow-sm">
             <img src={IMAGES.stylistBg} className="w-full h-full object-cover" alt="Profile"/>
          </div>
        </div>
      </div>

      {/* Feed Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-[120px] pb-40 scroll-smooth z-10 no-scrollbar">
         <div className="max-w-md mx-auto">
            {OUTFITS.map((outfit) => (
                <OutfitCard 
                    key={outfit.id} 
                    outfit={outfit} 
                    mixSelection={mixSelection}
                    onToggleMix={togglePiece}
                    onTryOn={onTryOn}
                    addToCart={addToCart}
                />
            ))}
         </div>
      </div>

      {/* The Liquid Morphing Navbar */}
      <UltraModernNavbar 
         mixSelection={mixSelection} 
         clearMix={clearMix}
         onTryOnMix={() => {
             // Pass the mixed selection to the main Try On handler
             if (onTryOn) onTryOn(mixSelection);
             alert(`Trying on Mixed Outfit: ${mixSelection.top?.name || ''} + ${mixSelection.bottom?.name || ''}`);
         }}
         cartCount={cartCount}
         onCheckout={onCheckout}
      />

    </div>
  );
};

// --- 6. TRY ON SCREEN (CRITICALLY UPDATED FOR MODAL HEIGHT & PINS) ---
// --- 6. UPDATED TRY ON SCREEN (Ethereal Glass & Liquid Physics) ---
// --- 6. THE ULTIMATE TRY-ON SCREEN (Liquid Physics & Editorial UI) ---
// --- 6. THE ULTIMATE TRY-ON SCREEN (Prismatic Load + White Glass Dock) ---
// --- 6. THE ULTIMATE TRY-ON SCREEN (Prismatic Load + Slide-to-Bag) ---
const TryOnScreen = ({ outfit, onClose, addToCart }) => {
  const [loading, setLoading] = useState(true);
  const [slideComplete, setSlideComplete] = useState(false);

  // Slider Physics
  const x = useMotionValue(0);
  const xInput = [0, 200]; // Drag range
  const opacity = useTransform(x, xInput, [1, 0]); // Text fades out
  const arrowOpacity = useTransform(x, [0, 50], [1, 0]); // Arrows fade out quickly
  
  // Handle Drag End
  const handleDragEnd = () => {
    if (x.get() > 150) { // Threshold to trigger
        setSlideComplete(true);
        setTimeout(() => addToCart(outfit), 800);
    } else {
        // It snaps back automatically via dragConstraints
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end h-[100dvh]">
      
      {/* 1. BACKDROP */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="absolute inset-0 bg-[#0a0a0a]/30 backdrop-blur-md transition-all duration-500"
      />

      {/* 2. DRAGGABLE SHEET */}
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
        drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => { if (offset.y > 100 || velocity.y > 500) onClose(); }}
        className="relative w-full h-[92%] bg-white rounded-t-[32px] shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
      >
        
        {/* HEADER & HANDLE */}
        <div className="absolute top-0 left-0 w-full z-50 pt-4 pb-6 flex justify-center bg-gradient-to-b from-white via-white/90 to-transparent pointer-events-none">
           <div className="w-16 h-1.5 bg-[#e5e5e5] rounded-full" />
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-xl rounded-full shadow-sm border border-gray-100 text-[#1a1a1a] active:scale-90 transition-transform hover:bg-gray-50">
            <X size={20} strokeWidth={2} />
        </button>

        {/* 3. MAIN CONTENT AREA */}
        <div className="flex-1 relative w-full h-full overflow-hidden bg-white">
            <AnimatePresence mode="wait">
                {/* LOADING STATE */}
                {loading ? (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white">
                        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-[#5a00e0]/10 rounded-full blur-2xl" />
                            <div className="relative w-32 h-32">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#5a00e0] border-l-[#00ff9d]" />
                                <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border-[2px] border-gray-100 border-b-gray-300" />
                                <div className="absolute inset-0 flex items-center justify-center"><Camera className="text-[#1a1a1a] w-8 h-8 animate-pulse" /></div>
                            </div>
                        </div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
                            <h2 className="font-playfair text-2xl font-black text-[#1a1a1a] tracking-tight">Generating Fit</h2>
                            <div className="h-1 w-24 bg-gray-100 rounded-full mx-auto mt-3 overflow-hidden">
                                <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="h-full w-full bg-gradient-to-r from-[#5a00e0] to-[#00ff9d]" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 mt-2 tracking-[0.3em] uppercase">AI Stitching in progress...</p>
                        </motion.div>
                    </motion.div>
                ) : (
                    /* CONTENT STATE */
                    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full overflow-y-auto pb-32 pt-16 px-0 no-scrollbar">
                        <div className="px-4">
                            <div className="relative w-full aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg border border-gray-100">
                                <img src={IMAGES.tryOnModel} className="w-full h-full object-cover" alt="Model" />
                                <motion.img initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 1 }} src={IMAGES.tryOnClothes} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply" alt="Clothes" />
                                {/* Pins */}
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} className="absolute top-[30%] left-[55%]">
                                    <div className="absolute -inset-2 bg-white/40 rounded-full animate-ping" />
                                    <div className="w-4 h-4 bg-white border-[3px] border-[#5a00e0] rounded-full shadow-lg" />
                                    <div className="absolute left-6 -top-2 bg-white/90 backdrop-blur-xl border border-white/50 px-3 py-1.5 rounded-[12px] shadow-xl"><p className="text-[8px] font-bold text-gray-400 uppercase">Top</p><p className="text-xs font-black text-[#1a1a1a]">$120</p></div>
                                </motion.div>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: "spring" }} className="absolute top-[65%] left-[35%]">
                                     <div className="w-4 h-4 bg-white border-[3px] border-[#5a00e0] rounded-full shadow-lg" />
                                     <div className="absolute left-6 -top-2 bg-white/90 backdrop-blur-xl border border-white/50 px-3 py-1.5 rounded-[12px] shadow-xl"><p className="text-[8px] font-bold text-gray-400 uppercase">Pants</p><p className="text-xs font-black text-[#1a1a1a]">$129</p></div>
                                </motion.div>
                            </div>
                        </div>
                        <div className="px-8 mt-8 text-center">
                            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="font-playfair text-[2.5rem] leading-[1] font-black text-[#1a1a1a] tracking-tight mb-4">{outfit.outfit}</motion.h2>
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-2 mb-6">
                                <span className="px-4 py-1.5 rounded-full bg-[#f9fafc] border border-gray-200 text-[10px] font-bold text-[#1a1a1a] uppercase tracking-wider">98% Match</span>
                                <span className="px-4 py-1.5 rounded-full bg-[#5a00e0]/5 border border-[#5a00e0]/20 text-[10px] font-bold text-[#5a00e0] uppercase tracking-wider">Trending</span>
                            </motion.div>
                            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">Based on your profile, this fit perfectly balances comfort with the "Urban Casual" aesthetic you prefer.</motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* --- 4. FLOATING DOCK with SLIDER BUTTON --- */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-50">
             <motion.div 
                initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 0.5, type: "spring" }}
                className="w-full bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[28px] p-2 flex items-center justify-between shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
             >
                 {/* Secondary Actions */}
                 <div className="flex gap-2 px-2">
                    <button className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 transition-colors active:scale-90 hover:bg-[#5a00e0]/10 hover:text-[#5a00e0]">
                        <Heart size={20} strokeWidth={2} />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 transition-colors active:scale-90 hover:bg-[#5a00e0]/10 hover:text-[#5a00e0]">
                        <Share2 size={20} strokeWidth={2} />
                    </button>
                 </div>

                 {/* SLIDE TO ADD BUTTON (Restored Dimensions, New Functionality) */}
                 <div className="flex-1 ml-2 h-12 relative bg-[#5a00e0] rounded-[20px] overflow-hidden shadow-lg shadow-[#5a00e0]/30">
                    
                    {/* Success Overlay */}
                    {slideComplete && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#00ff9d] z-30 flex items-center justify-center gap-2">
                             <span className="text-black font-bold text-xs uppercase tracking-widest">Added!</span>
                             <Check size={16} className="text-black" strokeWidth={3}/>
                         </motion.div>
                    )}

                    {/* Background Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />

                    {/* Track Text & Arrows */}
                    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none pl-8">
                         <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Add to Bag</span>
                            <motion.div style={{ opacity: arrowOpacity }} animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-white/50"><ArrowRight size={10}/></motion.div>
                            <motion.div style={{ opacity: arrowOpacity }} animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }} className="text-white/30"><ArrowRight size={10}/></motion.div>
                         </div>
                    </motion.div>

                    {/* Draggable Handle (White Puck) */}
                    <motion.div
                        style={{ x }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 170 }} // Constrained to container width
                        dragElastic={0.1}
                        dragMomentum={false}
                        onDragEnd={handleDragEnd}
                        className="absolute left-1 top-1 bottom-1 w-10 bg-white rounded-[16px] flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing z-20"
                    >
                        <ShoppingBag size={16} className="text-[#5a00e0]" />
                    </motion.div>
                 </div>
             </motion.div>
        </div>

      </motion.div>
    </div>
  );
};

// --- 7. CHECKOUT SCREEN ---
const Checkout = ({ cart, onBack, calculateTotal }) => {
    const shipping = 10;
    const taxRate = 0.08;
    const subtotal = calculateTotal();
    const taxes = subtotal * taxRate;
    const total = subtotal + shipping + taxes;

    return (
        <div className="w-full h-full bg-[#f9fafc] text-[#4f4f4f] flex flex-col relative font-inter animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="px-6 pt-12 pb-4 flex items-center sticky top-0 bg-[#f9fafc] z-10 border-b border-gray-100">
                <button onClick={onBack} className="p-2 mr-4 hover:bg-gray-100 rounded-full active:scale-95 transition-transform">
                    <ChevronLeft size={24} className="text-[#4f4f4f]" />
                </button>
                <h1 className="font-playfair text-2xl font-bold">Checkout</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Cart Items */}
                <section className="space-y-4">
                    <h2 className="text-xl font-playfair font-bold">Your Items ({cart.length})</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-500">Your cart is empty.</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                                <img src={item.src} alt={item.outfit} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{item.outfit}</p>
                                    <p className="text-xs text-gray-500">${item.price}</p>
                                </div>
                                <button className="text-gray-400 hover:text-[#5a00e0]">
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </section>

                {/* Shipping Details */}
                <section className="space-y-4 p-4 border border-gray-100 rounded-xl">
                    <h2 className="text-xl font-playfair font-bold flex items-center space-x-2"><span>Shipping</span></h2>
                    <p className="text-sm text-[#4f4f4f]">123 Fashion Ave, New York, NY 10001</p>
                    <button className="text-sm font-semibold text-[#5a00e0] underline hover:text-[#714cfe]">Change Address</button>
                </section>

                {/* Payment Method */}
                <section className="space-y-4 p-4 border border-gray-100 rounded-xl">
                    <h2 className="text-xl font-playfair font-bold flex items-center space-x-2"><span>Payment</span></h2>
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="font-semibold">Visa ending in 4242</span>
                        <Check size={16} className="text-green-500" />
                    </div>
                    <button className="text-sm font-semibold text-[#5a00e0] underline hover:text-[#714cfe]">Change Card</button>
                </section>
                
                {/* Order Summary */}
                <section className="space-y-2 pt-4 border-t border-gray-200">
                    <h2 className="text-xl font-playfair font-bold">Order Summary</h2>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping:</span>
                        <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Taxes (8%):</span>
                        <span>${taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2">
                        <span>Order Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </section>
            </div>

            {/* Sticky Footer CTA */}
            <div className="p-4 border-t border-gray-100 bg-[#f9fafc]">
                <button 
                    className="w-full bg-[#5a00e0] text-white py-4 rounded-full font-bold shadow-lg shadow-[#5a00e0]/20 active:scale-[0.98] transition-all hover:bg-[#714cfe]"
                    disabled={cart.length === 0}
                >
                    Pay Now - ${total.toFixed(2)}
                </button>
            </div>
        </div>
    );
};


// --- STYLES (Tailwind is handling most, but these animations are specific) ---
const styles = `
  @keyframes scan {
    0% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  .animate-scan {
    animation: scan 2s linear infinite;
  }
  .animate-spin-slow {
    animation: spin 8s linear infinite;
  }
  .animate-spin-reverse {
    animation: spin 6s linear infinite reverse;
  }
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Custom Font Classes (Simulated) */
  .font-playfair {
    font-family: 'Playfair Display', serif; /* Elegant serif for headlines */
  }
  .font-inter {
    font-family: 'Inter', sans-serif; /* Modern sans-serif for body/UI */
  }
  
  /* Hide scrollbar for cleaner UI */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default App;
