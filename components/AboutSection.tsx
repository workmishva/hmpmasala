"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallBack';
import masalaBowlsImage from '../public/images/banner/masala_bowls.webp';


export default function AboutSection() {
    const points = [
        'Hand-pounded using traditional methods',
        'No artificial colors or preservatives',
        'Ethically sourced from local Indian farms',
        'Retains natural essential oils and aroma',
    ];

    return (
        <section id="about" className="py-24 bg-masala-50 overflow-hidden relative">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-4/5 md:aspect-3/4 rounded-3xl overflow-hidden shadow-2xl z-10"
                        >
                            <ImageWithFallback
                                src={masalaBowlsImage.src}
                                alt="Indian spices kitchen"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-masala-900/60 to-transparent" />
                        </motion.div>

                        {/* Decorative blob behind image */}
                        <div className="absolute -top-12 -left-12 w-64 h-64 bg-saffron-300/30 rounded-full blur-3xl z-0" />
                        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-chili-400/20 rounded-full blur-3xl z-0" />

                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="absolute -bottom-8 -right-8 md:-right-12 bg-white p-6 rounded-2xl shadow-xl z-20 border border-masala-200 hidden sm:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-saffron-100 text-saffron-700 rounded-full flex items-center justify-center font-black text-2xl">
                                    10+
                                </div>
                                <div>
                                    <p className="text-sm text-masala-600 font-bold uppercase tracking-wider">Years of</p>
                                    <p className="text-xl font-black text-masala-900">Excellence</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-sm font-bold text-saffron-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-saffron-500 inline-block"></span>
                                Our Story
                            </h2>
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-masala-900 leading-tight mb-8">
                                Preserving the <span className="text-chili-600">Heritage</span> of Indian Taste
                            </h3>

                            <div className="space-y-6 text-lg text-masala-600 mb-10 leading-relaxed">
                                <p>
                                    Founded with a passion for authentic flavors, <strong className="text-masala-900">HMP Masala</strong> began as a small family endeavor to bring the true taste of home-ground spices to every kitchen.
                                </p>
                                <p>
                                    We understand that a great meal starts with great ingredients. That&apos;s why our masalas are crafted using time-honored recipes, ensuring every pinch delivers the robust aroma and taste you remember from childhood.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                                {points.map((point, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle2 className="text-cardamom-600 mt-1 shrink-0" size={20} />
                                        <span className="text-masala-900 font-medium leading-snug">{point}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <button className="px-8 py-4 bg-masala-700 hover:bg-chili-600 text-white rounded-full font-bold text-lg transition-colors shadow-lg shadow-masala-700/20 flex items-center gap-2">
                                Learn More About Us
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
