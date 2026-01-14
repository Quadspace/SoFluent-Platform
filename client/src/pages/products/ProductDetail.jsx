import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ExternalLink, CheckCircle, PlayCircle } from 'lucide-react';
import LoomPlayer from '../../components/video/LoomPlayer';
import axios from 'axios';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';
import SkeletonLoader from '../../components/common/SkeletonLoader';

/**
 * Product Detail Page
 * 
 * Displays full product information including:
 * - Product details
 * - Loom videos
 * - Google Classroom link
 * - Enrollment/purchase options
 */
const ProductDetail = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { user } = useUserSafe();
    const { getToken, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product && user) {
            checkEnrollment();
        }
    }, [product, user]);

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/products/${id}`);
            if (data.success) {
                setProduct(data.product);
                // Set first video as default if available
                if (data.product.loomVideos && data.product.loomVideos.length > 0) {
                    setSelectedVideo(data.product.loomVideos[0]);
                }
            }
        } catch (error) {
            // Silent fail for preview
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollment = async () => {
        try {
            const token = await getToken();
            if (!token) return;
            
            const { data } = await axios.get(`${backendUrl}/api/products/user/enrolled`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (data.success) {
                const enrolled = data.products.some(p => p._id === product._id);
                setIsEnrolled(enrolled);
            }
        } catch (error) {
            // Silent fail - user might not be enrolled
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            toast.warn(t('products.loginRequired', 'Please login to enroll'));
            return;
        }

        try {
            const token = await getToken();
            const { data } = await axios.post(
                `${backendUrl}/api/products/${id}/enroll`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(t('products.enrolled', 'Successfully enrolled!'));
                setIsEnrolled(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const calculateFinalPrice = () => {
        if (!product) return 0;
        if (product.discount > 0) {
            return product.price - (product.price * product.discount / 100);
        }
        return product.price;
    };

    const formatPrice = (price) => {
        const currency = product?.currency === 'BRL' ? 'R$' : '$';
        return `${currency}${price.toFixed(2)}`;
    };

    if (loading) {
        return (
            <StandardPage
                loading={true}
                seoTitle="Loading Product - So Fluent"
                background="bg-white"
            />
        );
    }

    if (!product) {
        return (
            <StandardPage
                error="Product not found"
                seoTitle="Product Not Found - So Fluent"
                background="bg-white"
            >
                <div className="min-h-screen flex items-center justify-center">
                    <BrandText size="xl" color="secondary">
                        {t('products.notFound', 'Product not found')}
                    </BrandText>
                </div>
            </StandardPage>
        );
    }

    return (
        <StandardPage
            seoTitle={`${product.title} - So Fluent`}
            seoDescription={product.description?.slice(0, 160)}
            background="bg-white"
        >
            
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-sofluent-pink/10 via-white to-sofluent-accent/10 py-12">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Left: Product Info */}
                            <div>
                                <div className="inline-block bg-sofluent-pink/10 text-sofluent-pink px-3 py-1 rounded-full text-sm font-semibold mb-4">
                                    {t(`products.types.${product.productType}`, product.productType)}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                    {product.title}
                                </h1>
                                <p className="text-xl text-gray-600 mb-6">
                                    {product.shortDescription || product.description}
                                </p>

                                {/* Metadata */}
                                <div className="flex items-center gap-6 mb-6">
                                    {product.averageRating > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{product.averageRating.toFixed(1)}</span>
                                            <span className="text-gray-500">({product.ratings?.length || 0})</span>
                                        </div>
                                    )}
                                    {product.enrollmentCount > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-gray-500" />
                                            <span className="text-gray-600">{product.enrollmentCount} {t('products.enrolled', 'enrolled')}</span>
                                        </div>
                                    )}
                                    {product.level && (
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize">
                                            {product.level}
                                        </span>
                                    )}
                                </div>

                                {/* Pricing */}
                                <div className="mb-6">
                                    {product.discount > 0 ? (
                                        <>
                                            <span className="text-4xl font-bold text-sofluent-pink">
                                                {formatPrice(calculateFinalPrice())}
                                            </span>
                                            <span className="text-xl text-gray-500 line-through ml-2">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="text-green-600 ml-2 font-semibold">
                                                {product.discount}% off
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-bold text-gray-800">
                                            {product.price === 0 
                                                ? t('products.free', 'Free')
                                                : formatPrice(product.price)
                                            }
                                        </span>
                                    )}
                                    {product.isSubscription && (
                                        <span className="text-gray-600 ml-2">
                                            /{t(`products.period.${product.subscriptionPeriod}`, product.subscriptionPeriod)}
                                        </span>
                                    )}
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex gap-4">
                                    {isEnrolled ? (
                                        <>
                                            {product.googleClassroomLink && (
                                                <a
                                                    href={product.googleClassroomLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-sofluent-pink text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                    {t('products.openClassroom', 'Open in Google Classroom')}
                                                </a>
                                            )}
                                            <button
                                                onClick={() => navigate('/my-enrollments')}
                                                className="px-6 py-3 border-2 border-sofluent-pink text-sofluent-pink rounded-lg font-semibold hover:bg-sofluent-pink/10 transition-colors"
                                            >
                                                {t('products.viewProgress', 'View Progress')}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleEnroll}
                                            className="flex-1 bg-sofluent-pink text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                                        >
                                            {product.price === 0 
                                                ? t('products.enrollFree', 'Enroll Free')
                                                : t('products.enrollNow', 'Enroll Now')
                                            }
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right: Thumbnail */}
                            <div>
                                <img
                                    src={product.thumbnail || '/placeholder-course.png'}
                                    alt={product.title}
                                    className="w-full rounded-xl shadow-xl"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-course.png';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-2">
                            {/* Description */}
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {t('products.description', 'Description')}
                                </h2>
                                <div
                                    className="rich-text text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>

                            {/* Loom Videos */}
                            {product.loomVideos && product.loomVideos.length > 0 && (
                                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                        {t('products.videos', 'Video Content')}
                                    </h2>
                                    
                                    {/* Video List */}
                                    <div className="space-y-4 mb-6">
                                        {product.loomVideos.map((video, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setSelectedVideo(video)}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    selectedVideo?.videoId === video.videoId
                                                        ? 'border-sofluent-pink bg-sofluent-pink/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <PlayCircle className="w-8 h-8 text-sofluent-pink" />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800">{video.title}</h3>
                                                        {video.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                                                        )}
                                                        {video.duration && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {video.duration} {t('products.minutes', 'minutes')}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {video.isPreview && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                                            {t('products.preview', 'Preview')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Video Player */}
                                    {selectedVideo && (
                                        <div className="mt-6">
                                            <LoomPlayer
                                                videoId={selectedVideo.videoId}
                                                title={selectedVideo.title}
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Course Content (if not using Classroom) */}
                            {product.courseContent && product.courseContent.length > 0 && (
                                <div className="bg-white rounded-xl shadow-lg p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                        {t('products.courseContent', 'Course Content')}
                                    </h2>
                                    {/* Render course content similar to CourseDetails component */}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                                        {t('products.features', 'What\'s Included')}
                                    </h3>
                                    <ul className="space-y-3">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <span className="font-semibold text-gray-800">{feature.title}</span>
                                                    {feature.description && (
                                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Google Classroom Link */}
                            {product.googleClassroomLink && (
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {t('products.classroom', 'Google Classroom')}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {t('products.classroomDescription', 'Access course materials and assignments')}
                                    </p>
                                    <a
                                        href={product.googleClassroomLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        {t('products.openClassroom', 'Open Classroom')}
                                    </a>
                                </div>
                            )}

                            {/* Instructor */}
                            {product.instructor && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                                        {t('products.instructor', 'Instructor')}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={product.instructor.imageUrl || '/placeholder-headshot.png'}
                                            alt={product.instructor.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">{product.instructor.name}</p>
                                            <p className="text-sm text-gray-600">{t('products.leadInstructor', 'Lead Instructor')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </StandardPage>
    );
};

export default ProductDetail;
