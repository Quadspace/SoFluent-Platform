import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Users, Star, ExternalLink } from 'lucide-react';
import { assets } from '../../assets/assets';

/**
 * Product Card Component
 * 
 * Displays product information in a card format
 * Supports all product types: Academy, VIP, Challenge, Course, Workshop
 */
const ProductCard = ({ product, showEnrollments = true }) => {
    const { t } = useTranslation();

    const getProductTypeLabel = () => {
        const types = {
            'academy': t('products.types.academy', 'Academy'),
            'vip': t('products.types.vip', 'VIP'),
            'challenge': t('products.types.challenge', 'Challenge'),
            'course': t('products.types.course', 'Course'),
            'workshop': t('products.types.workshop', 'Workshop'),
            'kids-corner': t('products.types.kidsCorner', "Kids' Corner")
        };
        return types[product.productType] || product.productType;
    };

    const calculateFinalPrice = () => {
        if (product.discount > 0) {
            return product.price - (product.price * product.discount / 100);
        }
        return product.price;
    };

    const formatPrice = (price) => {
        const currency = product.currency === 'BRL' ? 'R$' : '$';
        return `${currency}${price.toFixed(2)}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-200">
            {/* Thumbnail */}
            <div className="relative">
                <img
                    src={product.thumbnail || '/placeholder-course.png'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.src = '/placeholder-course.png';
                    }}
                />
                {product.isFeatured && (
                    <div className="absolute top-2 right-2 bg-sofluent-pink text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {t('products.featured', 'Featured')}
                    </div>
                )}
                {product.productType && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                        {getProductTypeLabel()}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {product.title}
                </h3>
                
                {product.shortDescription && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.shortDescription}
                    </p>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {product.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.averageRating.toFixed(1)}</span>
                        </div>
                    )}
                    {showEnrollments && product.enrollmentCount > 0 && (
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{product.enrollmentCount}</span>
                        </div>
                    )}
                    {product.level && (
                        <span className="capitalize">{product.level}</span>
                    )}
                </div>

                {/* Features Preview */}
                {product.features && product.features.length > 0 && (
                    <ul className="mb-4 space-y-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>{feature.title}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
                    <div>
                        {product.discount > 0 ? (
                            <>
                                <span className="text-2xl font-bold text-sofluent-pink">
                                    {formatPrice(calculateFinalPrice())}
                                </span>
                                <span className="text-sm text-gray-500 line-through ml-2">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-xs text-green-600 ml-2">
                                    {product.discount}% off
                                </span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold text-gray-800">
                                {product.price === 0 
                                    ? t('products.free', 'Free')
                                    : formatPrice(product.price)
                                }
                            </span>
                        )}
                        {product.isSubscription && (
                            <span className="text-sm text-gray-500 block">
                                /{t(`products.period.${product.subscriptionPeriod}`, product.subscriptionPeriod)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Link
                        to={`/products/${product.slug || product._id}`}
                        className="flex-1 bg-sofluent-pink text-white py-2 px-4 rounded-lg font-semibold hover:bg-pink-600 transition-colors text-center"
                    >
                        {t('products.viewDetails', 'View Details')}
                    </Link>
                    {product.googleClassroomLink && (
                        <a
                            href={product.googleClassroomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                            title={t('products.openClassroom', 'Open in Google Classroom')}
                        >
                            <ExternalLink className="w-5 h-5 text-gray-600" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
