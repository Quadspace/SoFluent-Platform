import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ProductCard from '../../components/products/ProductCard';
import { Filter, Search } from 'lucide-react';
import axios from 'axios';
import Footer from '../../components/student/Footer';
import Navbar from '../../components/student/Navbar';

/**
 * Product Catalog Page
 * 
 * Displays all So Fluent products with filtering and search
 * Supports: Academy, VIP, Challenges, Courses, Workshops, Kids' Corner
 */
const ProductCatalog = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, selectedType, selectedCategory]);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/products/all`, {
                params: {
                    isPublished: true,
                    limit: 100
                }
            });

            if (data.success) {
                setProducts(data.products || []);
                setFilteredProducts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by product type
        if (selectedType !== 'all') {
            filtered = filtered.filter(product => product.productType === selectedType);
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    };

    const productTypes = [
        { value: 'all', label: t('products.filters.allTypes', 'All Types') },
        { value: 'academy', label: t('products.types.academy', 'Academy') },
        { value: 'vip', label: t('products.types.vip', 'VIP') },
        { value: 'challenge', label: t('products.types.challenge', 'Challenges') },
        { value: 'course', label: t('products.types.course', 'Courses') },
        { value: 'workshop', label: t('products.types.workshop', 'Workshops') },
        { value: 'kids-corner', label: t('products.types.kidsCorner', "Kids' Corner") }
    ];

    const categories = [
        { value: 'all', label: t('products.filters.allCategories', 'All Categories') },
        { value: 'fitness', label: t('products.categories.fitness', 'Fitness') },
        { value: 'language', label: t('products.categories.language', 'Language') },
        { value: 'kids', label: t('products.categories.kids', 'Kids') },
        { value: 'business', label: t('products.categories.business', 'Business') }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-sofluent-pink/10 via-white to-sofluent-accent/10 py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            {t('products.catalog.fullTitle', 'So Fluent Products')}
                        </h1>
                        <p className="text-xl text-gray-600">
                            {t('products.catalog.subtitle', 'Discover our complete range of English learning solutions')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-8 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={t('products.search.placeholder', 'Search products...')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sofluent-pink focus:border-transparent"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sofluent-pink focus:border-transparent"
                        >
                            {productTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sofluent-pink focus:border-transparent"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        {t('products.results', '{{count}} products found', { count: filteredProducts.length })}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4 md:px-8">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sofluent-pink"></div>
                            <p className="mt-4 text-gray-600">{t('common.loading', 'Loading...')}</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-600 mb-4">
                                {t('products.noResults', 'No products found')}
                            </p>
                            <p className="text-gray-500">
                                {t('products.tryDifferentFilters', 'Try adjusting your filters or search terms')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ProductCatalog;
