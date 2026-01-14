import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";
import Loading from "./Loading";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

const CoursesSection = () => {
    const { allCourses } = useContext(AppContext);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        if (allCourses && allCourses.length > 0) {
            setLoading(false);
        }
        return () => clearTimeout(timer);
    }, [allCourses]);

    const placeholderCourses = [
        {
            _id: '1',
            courseTitle: 'Business English Mastery',
            courseDescription: 'Master professional communication for global careers',
            coursePrice: 497,
            courseThumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
            educator: { name: 'Heloisa' },
            courseRatings: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
            courseContent: [{ chapterContent: [{}, {}, {}] }, { chapterContent: [{}, {}] }]
        },
        {
            _id: '2',
            courseTitle: 'Interview Success Formula',
            courseDescription: 'Ace your interviews at international companies',
            coursePrice: 297,
            courseThumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
            educator: { name: 'Heloisa' },
            courseRatings: [{ rating: 5 }, { rating: 5 }],
            courseContent: [{ chapterContent: [{}, {}, {}, {}] }]
        },
        {
            _id: '3',
            courseTitle: 'Presentation Power',
            courseDescription: 'Deliver compelling presentations in English',
            coursePrice: 197,
            courseThumbnail: 'https://images.unsplash.com/photo-1558403194-611308249627?w=400',
            educator: { name: 'Heloisa' },
            courseRatings: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
            courseContent: [{ chapterContent: [{}, {}] }, { chapterContent: [{}, {}, {}] }]
        },
        {
            _id: '4',
            courseTitle: 'Fluency Foundations',
            courseDescription: 'Build your English confidence from the ground up',
            coursePrice: 0,
            courseThumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
            educator: { name: 'Heloisa' },
            courseRatings: [{ rating: 5 }],
            courseContent: [{ chapterContent: [{}, {}, {}, {}, {}] }]
        }
    ];

    const displayCourses = allCourses && allCourses.length > 0 ? allCourses : placeholderCourses;

    return (
        <section className="relative py-32 bg-gradient-to-b from-white to-[#FFF5F9]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Beautiful Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#E91E63]/10 to-[#E91E63]/5 border border-[#E91E63]/20 rounded-full mb-8 shadow-sm"
                    >
                        <BookOpen className="w-5 h-5 text-[#E91E63]" />
                        <span className="text-sm font-bold text-[#E91E63] uppercase tracking-wider">Nossos Cursos</span>
                    </motion.div>
                    <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1A1A1A] mb-8 leading-tight tracking-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
                        Transforme Sua
                        <span className="block bg-gradient-to-r from-[#E91E63] via-[#D4AF37] to-[#E91E63] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient mt-4">
                            Carreira
                        </span>
                    </h2>
                    <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
                        Cursos desenvolvidos por especialistas, baseados em ciência e projetados para resultados reais.
                    </p>
                </motion.div>

                {/* Course Grid */}
                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="w-20 h-20 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
                    >
                        {displayCourses.slice(0, 4).map((course, index) => (
                            <motion.div
                                key={course._id || index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Beautiful CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link
                        to="/course-list"
                        onClick={() => scrollTo(0, 0)}
                        className="group relative inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-black text-xl rounded-2xl hover:shadow-2xl hover:shadow-[#E91E63]/40 transition-all transform hover:scale-105 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-4">
                            Ver Todos os Cursos
                            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#E91E63] opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={false}
                        />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CoursesSection;
