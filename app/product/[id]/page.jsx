"use client"
import { useEffect, useState, useMemo } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading, { ProductSkeleton } from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import OrangeButton from '@/components/OrangeButton';

const Product = () => {
    const { id } = useParams();
    const { products, router, addToCart } = useAppContext()
    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);

    // Memoize product data to prevent unnecessary re-renders
    const productDataMemo = useMemo(() => {
        return products.find(product => product._id === id);
    }, [products, id]);

    const fetchProductData = async () => {
        if (productDataMemo) {
            setProductData(productDataMemo);
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [productDataMemo])

    if (!productData) {
        return (
            <>
                <Navbar />
                <div className="px-6 md:px-16 lg:px-32 pt-14">
                    <ProductSkeleton />
                </div>
            </>
        );
    }

    return (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 relative">
                        {imageLoading && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
                        )}
                        <Image
                            src={mainImage || productData.image[0]}
                            alt={productData.name}
                            className={`w-full h-auto object-cover mix-blend-multiply transition ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            width={800}
                            height={600}
                            priority={true}
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 hover:ring-2 hover:ring-orange-500 transition"
                            >
                                <Image
                                    src={image}
                                    alt={`${productData.name} view ${index + 1}`}
                                    className="w-full h-auto object-cover mix-blend-multiply hover:scale-105 transition"
                                    width={200}
                                    height={150}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_dull_icon}
                                alt="star_dull_icon"
                            />
                        </div>
                        <p>(4.5)</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        ${productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            ${productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Brand</td>
                                    <td className="text-gray-800/50 ">Generic</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Color</td>
                                    <td className="text-gray-800/50 ">Multi</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <OrangeButton onClick={() => addToCart(productData._id)} className="w-full !bg-gray-100 !text-gray-800/80 hover:!bg-gray-200">
                            Add to Cart
                        </OrangeButton>
                        <OrangeButton onClick={() => { addToCart(productData._id); router.push('/cart') }} className="w-full">
                            Buy now
                        </OrangeButton>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>
        </div>
        <Footer />
    </>
    )
};

export default Product;