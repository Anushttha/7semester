"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Menu,
  ChevronRight,
  Clock,
  DollarSign,
  Shirt,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FemimiApp = () => {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    heightFt: "",
    heightIn: "",
    shirtSize: "",
    shirtFit: "",
    waistSize: "",
    inseamSize: "",
    blazerSize: "",
    shoeSize: "",
  });

  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (index) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const Header = () => (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 bg-white z-50 px-5 py-4 flex justify-between items-center shadow-sm"
    >
      <button onClick={() => setMenuOpen(true)} className="p-2">
        <Menu className="w-6 h-6" style={{ color: "#000000" }} />
      </button>
      <motion.h1
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-black tracking-tight"
        style={{ color: "#000000" }}
      >
       Femini
      </motion.h1>
      <button
        className="text-sm font-bold px-4 py-2 rounded-full transition-colors hover:bg-gray-100"
        style={{ color: "#000000" }}
      >
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-10">
                <button onClick={() => setMenuOpen(false)} className="p-2">
                  <X className="w-6 h-6" style={{ color: "#000000" }} />
                </button>
              </div>
              <nav className="space-y-8">
                {["Women", "Men", "Kids", "Help", "Gift cards"].map(
                  (item, i) => (
                    <motion.div
                      key={item}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                    >
                      <a
                        href="#"
                        className="block text-xl font-bold transition-colors"
                        style={{ color: "#000000" }}
                      >
                        {item}
                      </a>
                    </motion.div>
                  )
                )}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="pt-4"
                >
                  <a
                    href="#"
                    className="flex items-center text-lg font-bold transition-colors"
                    style={{ color: "#000000" }}
                  >
                    Take your style quiz{" "}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </a>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const Footer = () => (
    <footer className="bg-white text-black py-12 px-4 mt-16 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-12">
          {/* The Service */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-black">The Service</h3>
            <ul className="space-y-3">
              {[
                "Gift cards",
                "iPhone App",
                "Plus Sizes",
                "Maternity",
                "Petite",
                "Big & Tall",
                "Women's Jeans",
                "Business Casual"
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Questions? */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-black">Questions?</h3>
            <ul className="space-y-3">
              {[
                "Help",
                "Returns"
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The Company */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-black">The Company</h3>
            <ul className="space-y-3">
              {[
                "About Us",
                "Returns",
                "Social Impact",
                "Press",
                "Investor Relations",
                "Careers",
                "Tech Blog",
                "Affiliates"
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-4">
          {[
            {
              title: "The Service",
              links: [
                "Gift cards",
                "iPhone App",
                "Plus Sizes",
                "Maternity",
                "Petite",
                "Big & Tall",
                "Women's Jeans",
                "Business Casual"
              ]
            },
            {
              title: "Questions?",
              links: ["Help", "Returns"]
            },
            {
              title: "The Company",
              links: [
                "About Us",
                "Returns",
                "Social Impact",
                "Press",
                "Investor Relations",
                "Careers",
                "Tech Blog",
                "Affiliates"
              ]
            }
          ].map((section, index) => (
            <div key={section.title} className="border-b border-gray-300 pb-4">
              <button
                className="w-full flex justify-between items-center py-2 text-left font-bold text-lg text-black"
                onClick={() => toggleSection(index)}
              >
                {section.title}
                <ChevronDown 
                  className={`w-5 h-5 transition-transform ${
                    openSections.includes(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openSections.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-2">
                      {section.links.map((link) => (
                        <a
                          key={link}
                          href="#"
                          className="block text-gray-600 hover:text-black transition-colors py-1 text-sm"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                © 2025FFemini, Inc. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors">
                Terms of Use
              </a>
              <span>•</span>
              <a href="#" className="hover:text-black transition-colors">
                Accessibility
              </a>
              <span>•</span>
              <a href="#" className="hover:text-black transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-black transition-colors">
                Supply Chain Information
              </a>
              <span>•</span>
              <a href="#" className="hover:text-black transition-colors">
                Ad Choices
              </a>
              <span>•</span>
              <a href="#" className="hover:text-black transition-colors">
                Stiernap
              </a>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
             FFemini and Fix are trademarks ofFFemini, Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );

  const HomeScreen = () => (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white px-5 py-3 flex items-center justify-between"
        style={{ backgroundColor: "#704aff" }}
      >
        <div className="flex items-center flex-1">
          <span className="text-xl mr-3">🎁</span>
          <span className="text-sm font-bold">
            First Fix offer! $20 off + waived styling fee
          </span>
        </div>
        <button className="p-1 ml-2">
          <X className="w-5 h-5" />
        </button>
      </motion.div>

      <div className="relative">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="/hello.png"
          alt="Fashion models"
          className="w-full h-[500px] object-cover"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
            <h2
              className="text-3xl font-black mb-3"
              style={{ color: "#000000" }}
            >
              "Upload your photo,
              <br />
              get AI-styled"
            </h2>
            <p className="text-base mb-6" style={{ color: "#000000" }}>
              AI analyzes your skin tone and style.
              <br />
              Get personalized outfit recommendations.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#614cff" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen("how-it-works")}
              className="w-full text-white font-bold py-4 px-6 rounded-full shadow-lg transition-colors text-base"
              style={{ backgroundColor: "#704aff" }}
            >
              Take the quiz, get $20 off
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-5 py-16"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="text-center">
          <motion.h3
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-5xl font-black mb-3"
            style={{ color: "#000000" }}
          >
            TRY US OUT
          </motion.h3>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="text-3xl font-bold text-black mb-4"
          >
            (ON THE HOUSE)
          </motion.p>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="text-xl text-black mb-16"
          >
            No risk, all style—try it free
          </motion.p>

          <div className="grid gap-12 max-w-4xl mx-auto">
            {/* Shop Less, Live More */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#704aff" }}
                >
                  <Clock className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <h4 className="text-2xl font-bold text-black mb-3">
                Shop less, live more
              </h4>
              <p className="text-black text-lg">
                Save 40+ shopping hours a year— that's more time for what you
                love
              </p>
            </motion.div>

            {/* Fits Your Budget */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={4}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#704aff" }}
                >
                  <DollarSign className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <h4 className="text-2xl font-bold text-black mb-3">
                Fits your budget
              </h4>
              <p className="text-black text-lg">
                Your Stylist sends pieces within your price range— plus, keep 5+
                items and save 20%
              </p>
            </motion.div>

            {/* No Risk, All Style */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={5}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#704aff" }}
                >
                  <Shirt className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <h4 className="text-2xl font-bold text-black mb-3">
                No risk, all style
              </h4>
              <p className="text-black text-lg">
                Try us free for your First Fix! Plus, flexible buy now, pay
                later options
              </p>
            </motion.div>
          </div>

          <motion.button
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={6}
            whileHover={{ scale: 1.05, backgroundColor: "#614cff" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen("how-it-works")}
            className="mt-12 px-8 py-4 rounded-full font-bold text-lg shadow-lg text-white"
            style={{ backgroundColor: "#704aff" }}
          >
            Let's get started
          </motion.button>
        </div>
      </motion.div>
      <Footer />
    </motion.div>
  );

  const HowItWorksScreen = () => (
    <motion.div
      key="how-it-works"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20"
    >
      <div className="px-5 py-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setCurrentScreen("home")}
          className="mb-8 font-bold flex items-center"
          style={{ color: "#000000" }}
        >
          ← Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 rounded-2xl mb-8"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="text-center px-5">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="text-5xl font-black mb-3"
              style={{ color: "#000000" }}
            >
              TRY US OUT
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="text-3xl font-bold text-black mb-4"
            >
              (ON THE HOUSE)
            </motion.p>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              className="text-xl text-black"
            >
              No risk, all style—try it free
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
              className="mt-12"
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="mx-auto mb-6"
              >
                <motion.rect
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  x="20"
                  y="30"
                  width="80"
                  height="60"
                  fill="none"
                  stroke="#704aff"
                  strokeWidth="3"
                  rx="5"
                />
                <motion.line
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  x1="30"
                  y1="45"
                  x2="70"
                  y2="45"
                  stroke="#704aff"
                  strokeWidth="2"
                />
              </svg>
              <h3
                className="text-2xl font-black mb-4"
                style={{ color: "#000000" }}
              >
                1. Take your style quiz
              </h3>
              <p className="text-black text-base leading-relaxed max-w-md mx-auto">
                Upload your photo and tell us about your preferences—the more we
                know, the better our AI can recommend outfits that match your
                skin tone and style.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={4}
              className="mt-16"
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="mx-auto mb-6"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d="M 40 30 Q 40 20, 50 20 L 70 20 Q 80 20, 80 30 L 80 50 Q 60 70, 40 50 Z"
                  fill="none"
                  stroke="#704aff"
                  strokeWidth="3"
                />
              </svg>
              <h3
                className="text-2xl font-black mb-4"
                style={{ color: "#000000" }}
              >
                2. Get AI-powered recommendations
              </h3>
              <p className="text-black text-base leading-relaxed max-w-md mx-auto">
                Our AI analyzes your photo and preferences to suggest clothes
                that complement your skin tone and personal style perfectly.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={5}
              className="mt-16"
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="mx-auto mb-6"
              >
                <motion.rect
                  initial={{ pathLength: 0, scale: 0.8 }}
                  whileInView={{ pathLength: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  x="30"
                  y="20"
                  width="60"
                  height="80"
                  fill="none"
                  stroke="#704aff"
                  strokeWidth="3"
                  rx="5"
                />
                <motion.line
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  x1="45"
                  y1="35"
                  x2="75"
                  y2="35"
                  stroke="#704aff"
                  strokeWidth="2"
                />
              </svg>
              <h3
                className="text-2xl font-black mb-4"
                style={{ color: "#000000" }}
              >
                3. Virtual try-on & buy
              </h3>
              <p className="text-black text-base leading-relaxed max-w-md mx-auto">
                See how clothes look on you with our virtual try-on powered by
                Aazmao. Love it? Buy it directly through our integrated shopping
                platform.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={6}
          whileHover={{ scale: 1.05, backgroundColor: "#614cff" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen("category-select")}
          className="w-full font-black py-4 px-6 rounded-full shadow-lg transition-colors text-lg text-white"
          style={{ backgroundColor: "#704aff" }}
        >
          Let's get started
        </motion.button>
      </div>
    </motion.div>
  );

  const CategorySelectScreen = () => (
    <motion.div
      key="category"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 px-5 py-8"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setCurrentScreen("how-it-works")}
        className="mb-8 font-bold"
        style={{ color: "#000000" }}
      >
        ← Back
      </motion.button>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <img
                src="/api/placeholder/150/200"
                alt={`Style ${i}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="text-2xl font-black mb-6"
        style={{ color: "#000000" }}
      >
        What can we style you for?
      </motion.h2>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="space-y-4 mb-8"
      >
        {["Womens", "Mens", "Kids"].map((category, i) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "#f8f9fa" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentScreen("email");
            }}
            className="w-full bg-white border-2 font-bold py-4 px-6 rounded-full transition-all shadow-sm hover:shadow-md text-lg"
            style={{ borderColor: "#000000", color: "#000000" }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className="text-center text-sm"
        style={{ color: "#000000" }}
      >
        Already have an account?{" "}
        <a href="#" className="font-bold hover:underline">
          Sign in
        </a>
      </motion.p>
    </motion.div>
  );

  const EmailScreen = () => (
    <motion.div
      key="email"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 px-5 py-8"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setCurrentScreen("category-select")}
        className="mb-12 font-bold"
        style={{ color: "#000000" }}
      >
        ← Back
      </motion.button>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <h2 className="text-3xl font-black mb-8" style={{ color: "#000000" }}>
          Before we begin, what's your email?
        </h2>

        <input
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="w-full px-0 py-4 border-b-2 text-lg focus:outline-none transition-colors mb-6 bg-transparent"
          style={{ borderColor: "#000000", color: "#000000" }}
        />

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-sm mb-8"
          style={{ color: "#000000" }}
        >
          By continuing, you acceptFFemini's{" "}
          <a href="#" className="underline font-bold">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className="underline font-bold">
            Privacy Policy
          </a>
          .
        </motion.p>

        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
          whileHover={{ scale: 1.05, backgroundColor: "#614cff" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen("name")}
          disabled={!formData.email.trim()}
          className={`w-full text-white font-black py-4 px-6 rounded-full shadow-lg transition-colors mb-8 text-lg ${
            !formData.email.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{ backgroundColor: "#704aff" }}
        >
          Continue
        </motion.button>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="text-center"
        >
          <p className="mb-6 font-bold" style={{ color: "#000000" }}>
            Or continue with
          </p>
          <div className="flex gap-3 justify-center">
            {[
              { name: "Apple", icon: "🌤" },
              { name: "Google", icon: "🍹" },
              { name: "Facebook", icon: "🏺" },
            ].map((provider, i) => (
              <motion.button
                key={provider.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: "#f8f9fa" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border-2 font-bold py-3 px-6 rounded-full shadow-sm hover:shadow-md transition-all"
                style={{ borderColor: "#000000", color: "#000000" }}
              >
                <span className="text-lg">{provider.icon}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="text-center text-sm mt-8"
          style={{ color: "#000000" }}
        >
          Already have an account?{" "}
          <a href="#" className="font-bold hover:underline">
            Sign in
          </a>
        </motion.p>
      </motion.div>
    </motion.div>
  );

  const NameScreen = () => (
    <motion.div
      key="name"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 px-5 py-8"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setCurrentScreen("email")}
        className="mb-12 font-bold"
        style={{ color: "#000000" }}
      >
        ← Back
      </motion.button>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <h2 className="text-3xl font-black mb-8" style={{ color: "#000000" }}>
          What's your first name?
        </h2>

        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          className="w-full px-0 py-4 border-b-2 text-lg focus:outline-none transition-colors mb-8 bg-transparent"
          style={{ borderColor: "#000000", color: "#000000" }}
        />

        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          whileHover={{ scale: 1.05, backgroundColor: "#614cff" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen("complete")}
          disabled={!formData.firstName.trim()}
          className={`w-full text-white font-black py-4 px-6 rounded-full shadow-lg transition-colors text-lg ${
            !formData.firstName.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{ backgroundColor: "#704aff" }}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const CompleteScreen = () => (
    <motion.div
      key="complete"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 px-5 py-8 flex flex-col"
    >
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex-1 flex flex-col justify-center items-center text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "#704aff" }}
        >
          <span className="text-4xl text-white font-black">✓</span>
        </motion.div>

        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl font-black mb-4"
          style={{ color: "#000000" }}
        >
          Nice to meet you,
          <br />
          {formData.firstName || "there"}!
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-xl mb-8"
          style={{ color: "#000000" }}
        >
          Let's get started with your AI styling journey.
        </motion.p>
      </motion.div>

      <motion.button
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={3}
        whileHover={{ scale: 1.05, backgroundColor: "#614cff" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentScreen("home")}
        className="w-full font-black py-4 px-6 rounded-full shadow-lg transition-colors text-lg text-white"
        style={{ backgroundColor: "#704aff" }}
      >
        Start Your Style Journey
      </motion.button>
    </motion.div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
      <Header />
      <SideMenu />

      <AnimatePresence mode="wait">
        {currentScreen === "home" && <HomeScreen />}
        {currentScreen === "how-it-works" && <HowItWorksScreen />}
        {currentScreen === "category-select" && <CategorySelectScreen />}
        {currentScreen === "email" && <EmailScreen />}
        {currentScreen === "name" && <NameScreen />}
        {currentScreen === "complete" && <CompleteScreen />}
      </AnimatePresence>
    </div>
  );
};

export default FemimiApp;