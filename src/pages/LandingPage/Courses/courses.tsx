"use client";
import Slider from "react-slick";
import React, { Component } from "react";
import Link from "next/link";
import Image from 'next/image';
import { getQuestion } from "@/lib/service/questionService";

interface DataType {
    content: string;
    imageSrc: string; // Thay đổi tên thuộc tính để không chứa khoảng trắng
    category: string;
}

export default class MultipleItems extends Component {
    state = {
        postData: [] as DataType[],
        loading: true,
        error: null as string | null,
    };

    async componentDidMount() {
        try {
            const questionResponse = await getQuestion();
            if (questionResponse.status === 200) {
                const questionData = questionResponse.data.data;

                const formattedQuestionData = questionData.map((item: any) => ({
                    content: item.content,
                    heading2: "", // Assuming heading2 is not available
                    imageSrc: item.image ? item.image : "", // Sử dụng tên thuộc tính mới
                    category: item.categoryName,
                }));

                //console.log('Formatted Question Data:', formattedQuestionData);

                this.setState({ postData: formattedQuestionData, loading: false });
            } else {
                this.setState({ error: "Failed to fetch questions", loading: false });
            }
        } catch (error: any) {
            this.setState({ error: error.message, loading: false });
        }
    }

    render() {
        const { postData, loading, error } = this.state;

        const settings = {
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 2,
            arrows: false,
            autoplay: false,
            speed: 500,
            cssEase: "linear",
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                }
            ]
        };

        return (
            <div id="courses">
                <div className='mx-auto max-w-7xl sm:py-8 px-4 lg:px-8 '>
                    <div className="sm:flex justify-between items-center">
                        <h3 className="text-midnightblue text-4xl lg:text-55xl font-semibold mb-5 sm:mb-0">Popular Question</h3>
                        <Link href={'/question'} className="text-Blueviolet text-lg font-medium space-links">Explore&nbsp;&gt;&nbsp;</Link>
                    </div>

                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <Slider {...settings}>
                            {postData.map((items, i) => (
                                <div key={i}>
                                    <div className='bg-white m-3 px-3 pt-3 pb-12 my-20 shadow-courses rounded-2xl'>
                                        <div className="relative rounded-3xl">
                                            <Image src={items.imageSrc} alt="gaby" width={389} height={262} className="m-auto clipPath" 
                                            style={{ objectFit: 'cover', width: '100%', height: '300px' }} />
                                            <div className="absolute right-5 -bottom-2 bg-ultramarine rounded-full p-6">
                                                <h3 className="text-white uppercase text-center text-sm font-medium">best <br /> seller</h3>
                                            </div>
                                        </div>

                                        <div className="px-3">
                                            <h4 className='text-2xl font-bold pt-6 text-black line-clamp-1'>{items.content}</h4>
                                            {/* <h4 className='text-2xl font-bold pt-1 text-black'>{items.heading2}</h4> */}

                                            <div>
                                                <h3 className='text-base font-normal pt-6 opacity-75'>{items.category}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            </div>
        );
    }
}
