'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, HeartHandshake, Flame } from 'lucide-react';

const features = [
    {
        icon: <Leaf size={32} className="text-cardamom-600" />,
        title: '100% Organic',
        description: 'Sourced directly from organic farms, ensuring pure, untainted flavor in every pinch.',
        color: 'bg-cardamom-100',
    },
    {
        icon: <ShieldCheck size={32} className="text-saffron-600" />,
        title: 'No Preservatives',
        description: 'We believe in keeping our spices as nature intended. Zero added colors or preservatives.',
        color: 'bg-saffron-100',
    },
    {
        icon: <Flame size={32} className="text-chili-600" />,
        title: 'Authentic Taste',
        description: 'Traditional recipes passed down through generations for that authentic home-cooked aroma.',
        color: 'bg-chili-100',
    },
    {
        icon: <HeartHandshake size={32} className="text-saffron-600" />,
        title: 'Ethically Sourced',
        description: 'We partner directly with farmers to ensure fair trade and superior crop quality.',
        color: 'bg-saffron-100',
    },
];

export default function Features() {
    return (
        <section className="py-20 bg-masala-50">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white p-8 rounded-3xl shadow-card hover:shadow-card-hover transition-shadow border border-masala-200 flex flex-col items-start gap-4"
                        >
                            <div className={`p-4 rounded-2xl ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-masala-900">{feature.title}</h3>
                            <p className="text-masala-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
