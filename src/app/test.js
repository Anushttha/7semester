import React, { useState } from 'react';
import { X, Menu, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FemimiApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: { duration: 0.3 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const Header = () => (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 bg-white z-50 px-5 py-4 flex justify-between items-center shadow-sm"
    >
      <button onClick={() => setMenuOpen(true)} className="p-2">
        <Menu className="w-6 h-6 text-gray-800" />
      </button>
      <motion.h1 
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-bold text-purple-600"
        style={{ color: '#6e4bff' }}
      >
        Femimi
      </motion.h1>
      <button className="text-sm font-medium" style={{ color: '#6e4bff' }}>
        Sign In
      </button>
    </motion.header>
  );

  const SideMenu = () => (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setMenuOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold" style={{ color: '#6e4bff' }}>Femimi</h2>
                <button onClick={() => setMenuOpen(false)} className="p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-6">
                {['Women', 'Men', 'Kids', 'Help', 'Gift cards'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  >
                    <a href="#" className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors">
                      {item}
                    </a>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <a href="#" className="flex items-center text-lg font-medium hover:text-purple-600 transition-colors" style={{ color: '#6e4bff' }}>
                    Take your style quiz <ChevronRight className="w-5 h-5 ml-2" />
                  </a>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const HomeScreen = () => (
    <motion.div
      key="home"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen pt-20"
    >
      <motion.div 
        variants={scaleIn}
        className="bg-purple-600 text-white px-5 py-3 flex items-center justify-between"
        style={{ backgroundColor: '#6e4bff' }}
      >
        <div className="flex items-center">
          <span className="text-xl mr-3">🎁</span>
          <span className="text-sm font-medium">First Fix offer! $20 off + waived styling fee</span>
        </div>
        <button className="p-1">
          <X className="w-5 h-5" />
        </button>
      </motion.div>

      <div className="px-5 py-12">
        <motion.div 
          variants={fadeInUp}
          custom={0}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <motion.h2 
            variants={fadeInUp}
            custom={1}
            className="text-3xl font-bold text-center mb-4 text-gray-900"
          >
            "I never have<br />time to shop"
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            custom={2}
            className="text-center text-gray-600 mb-6"
          >
            Your Stylist sends pieces in your<br />size, style and budget. Easy.
          </motion.p>
          <motion.button
            variants={fadeInUp}
            custom={3}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('how-it-works')}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-full transition-colors shadow-lg"
          >
            Take the quiz, get $20 off
          </motion.button>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          custom={4}
          className="relative rounded-2xl overflow-hidden shadow-xl mb-8"
        >
          <div className="h-96 bg-gradient-to-br from-purple-100 to-purple-200 flex items-end justify-center p-6">
            <div className="text-center">
              <div className="flex justify-center gap-4 mb-4">
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="w-24 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-lg shadow-lg"
                />
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="w-24 h-32 bg-gradient-to-br from-blue-900 to-blue-950 rounded-lg shadow-lg"
                />
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="w-24 h-32 bg-gradient-to-br from-rose-200 to-rose-300 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          custom={5}
          className="text-center"
        >
          <h3 className="text-4xl font-bold mb-2" style={{ color: '#6e4bff' }}>
            TRY US OUT
          </h3>
          <p className="text-2xl font-semibold text-gray-800">(ON THE HOUSE)</p>
          <p className="text-lg text-gray-600 mt-4">No risk, all style—try it free</p>
        </motion.div>
      </div>
    </motion.div>
  );

  const HowItWorksScreen = () => (
    <motion.div
      key="how-it-works"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen pt-20 px-5 py-8"
      style={{ backgroundColor: '#f3f4f6' }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setCurrentScreen('home')}
        className="mb-6 text-gray-800 font-medium"
      >
        ← Back
      </motion.button>

      <motion.div 
        variants={fadeInUp}
        custom={0}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-2" style={{ color: '#6e4bff' }}>TRY US OUT</h2>
        <p className="text-2xl font-semibold text-gray-800">(ON THE HOUSE)</p>
        <p className="text-lg text-gray-600 mt-4">No risk, all style—try it free</p>
      </motion.div>

      <div className="space-y-12 mb-12">
        <motion.div 
          variants={fadeInUp}
          custom={1}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <motion.div 
            whileHover={{ rotate: 5 }}
            className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: '#6e4bff' }}
          >
            <div className="text-white text-4xl">📋</div>
          </motion.div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#6e4bff' }}>
            1. Take your style quiz
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Tell us about your style, size + budget—the more we know, the more your Stylist can find the perfect pieces to fit your needs.
          </p>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          custom={2}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <motion.div 
            whileHover={{ rotate: -5 }}
            className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: '#6e4bff' }}
          >
            <div className="text-white text-4xl">👔</div>
          </motion.div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#6e4bff' }}>
            2. Match with your (human!) Stylist
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Let your Stylist know what you want via notes and we'll send your Fix box straight to your door (always free shipping + returns).
          </p>
        </motion.div>
      </div>

      <motion.button
        variants={fadeInUp}
        custom={3}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentScreen('category-select')}
        className="w-full text-gray-900 font-semibold py-4 px-6 rounded-full shadow-lg transition-colors"
        style={{ backgroundColor: '#c4f566' }}
      >
        Let's get started
      </motion.button>
    </motion.div>
  );

  const CategorySelectScreen = () => (
    <motion.div
      key="category"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen pt-20 px-5 py-8"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setCurrentScreen('how-it-works')}
        className="mb-8 text-gray-800 font-medium"
      >
        ← Back
      </motion.button>

      <motion.div 
        variants={fadeInUp}
        className="mb-8"
      >
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="h-40 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl shadow-md"
            />
          ))}
        </div>
      </motion.div>

      <motion.h2 
        variants={fadeInUp}
        custom={1}
        className="text-2xl font-bold mb-6 text-gray-900"
      >
        What can we style you for?
      </motion.h2>

      <motion.div 
        variants={fadeInUp}
        custom={2}
        className="space-y-4 mb-8"
      >
        {['Womens', 'Mens', 'Kids'].map((category, i) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentScreen('email');
            }}
            className="w-full bg-white border-2 text-gray-900 font-semibold py-4 px-6 rounded-full transition-all shadow-sm hover:shadow-md"
            style={{ borderColor: '#6e4bff' }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      <motion.p 
        variants={fadeInUp}
        custom={3}
        className="text-center text-sm"
      >
        Already have an account?{' '}
        <a href="#" className="font-semibold hover:underline" style={{ color: '#6e4bff' }}>
          Sign in
        </a>
      </motion.p>
    </motion.div>
  );

  const EmailScreen = () => (
    <motion.div
      key="email"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen pt-20 px-5 py-8"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setCurrentScreen('category-select')}
        className="mb-12 text-gray-800 font-medium"
      >
        ← Back
      </motion.button>

      <motion.div variants={fadeInUp} custom={0}>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          Before we begin, what's your email?
        </h2>

        <motion.input
          variants={fadeInUp}
          custom={1}
          whileFocus={{ scale: 1.02 }}
          type="email"
          placeholder="email@example.com"
          className="w-full px-4 py-4 border-b-2 text-lg focus:outline-none focus:border-purple-600 transition-colors mb-6"
          style={{ borderColor: '#e5e7eb' }}
        />

        <motion.p 
          variants={fadeInUp}
          custom={2}
          className="text-sm text-gray-600 mb-8"
        >
          By continuing, you accept Femimi's{' '}
          <a href="#" className="underline" style={{ color: '#6e4bff' }}>Terms of Use</a>
          {' '}and{' '}
          <a href="#" className="underline" style={{ color: '#6e4bff' }}>Privacy Policy</a>.
        </motion.p>

        <motion.button
          variants={fadeInUp}
          custom={3}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full text-white font-semibold py-4 px-6 rounded-full shadow-lg transition-colors mb-8"
          style={{ backgroundColor: '#80d4c9' }}
        >
          Continue
        </motion.button>

        <motion.div 
          variants={fadeInUp}
          custom={4}
          className="text-center"
        >
          <p className="text-gray-600 mb-6">Or continue with</p>
          <div className="space-y-3">
            {[
              { name: 'Apple', icon: '🍎' },
              { name: 'Google', icon: 'G' },
              { name: 'Facebook', icon: 'f' }
            ].map((provider, i) => (
              <motion.button
                key={provider.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white border border-gray-300 font-medium py-3 px-6 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
              >
                <span className="text-xl">{provider.icon}</span>
                {provider.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.p 
          variants={fadeInUp}
          custom={5}
          className="text-center text-sm mt-8"
        >
          Already have an account?{' '}
          <a href="#" className="font-semibold hover:underline" style={{ color: '#6e4bff' }}>
            Sign in
          </a>
        </motion.p>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
      <Header />
      <SideMenu />
      
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'how-it-works' && <HowItWorksScreen />}
        {currentScreen === 'category-select' && <CategorySelectScreen />}
        {currentScreen === 'email' && <EmailScreen />}
      </AnimatePresence>
    </div>
  );
};

export default FemimiApp;