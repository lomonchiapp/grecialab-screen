import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useEffect, useState } from 'react';
import { QueueBox } from './QueueBox';
import { useScreenState } from '../../global/useScreenState';

export const QueueSlider = () => {
    const { queues } = useScreenState();
    return (
        <Swiper
            spaceBetween={25}
            slidesPerView={1}
           breakpoints={{
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
                1480: {
                    slidesPerView: 4,
                },
            }}
           
        >
            {queues.map((queue) => (
                <SwiperSlide key={queue.id}>
                    <QueueBox queue={queue} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}