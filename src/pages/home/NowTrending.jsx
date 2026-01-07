import React, { useState, useEffect, useRef } from "react";
import { useGetFeaturedMatchesQuery } from "@/services/Api";
import Carousel from 'react-multi-carousel';
import Loader from "../../components/ui/Loader";

export default function NowTrending() {
  const { data, isLoading, isFetching } = useGetFeaturedMatchesQuery()
  const [currentSlide, setCurrentSlide] = useState(0);
  const trending = data?.data?.items?.matches || []
  const getDoubleChanceTag = (prediction, homeTeam, awayTeam) => {
    const outcomes = prediction?.outcomes;
    if (!outcomes) return '';
    return outcomes?.homeWinBoolean ? `${homeTeam.split('.').pop().split(' ').map(word => word[0]).join('')} to win` : outcomes?.drawBoolean ? `${awayTeam.split('.').pop().split(' ').map(word => word[0]).join('')} to win` : outcomes?.awayWinBoolean ? `BTTS` : 'Draw';
  };

  return (
    <section className="w-full py-4 px-2 md:px-4 overflow-x-hidden min-h-52">
      <div className="w-full max-w-[1300px] mx-auto text-white text-sm font-body mb-3 pl-4">
        Now Trending
      </div>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className="max-w-[1300px] mx-auto">
          <Carousel
            additionalTransfrom={0}
            arrows={false}
            autoPlay
            autoPlaySpeed={2000}
            centerMode={false}
            className=""
            containerClass="container-with-dots"
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
              desktop: {
                breakpoint: {
                  max: 3000,
                  min: 1024
                },
                items: 3,
                partialVisibilityGutter: 0
              },
              mobile: {
                breakpoint: {
                  max: 700,
                  min: 0
                },
                items: 1,
                partialVisibilityGutter: 0
              },
              tablet: {
                breakpoint: {
                  max: 1024,
                  min: 700
                },
                items: 2,
                partialVisibilityGutter: 0
              }
            }}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
            beforeChange={(next) => setCurrentSlide(next)}
          >
            {trending?.map((item, idx) => (
              <div className="px-1" key={idx}>
                <div
                  className="flex items-center bg-[#373266] rounded-2xl shadow-m px-5 py-3 w-full transition-all hover:shadow-lg"
                >
                  {/* Teams */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.homeTeam.logo}
                        alt={item.homeTeam.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white text-base font-body truncate">
                        {item.homeTeam.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <img
                        src={item.awayTeam.logo}
                        alt={item.awayTeam.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white text-base font-body truncate">
                        {item.awayTeam.name}
                      </span>
                    </div>
                  </div>
                  {/* BTTS pill */}
                  {/* {!!item?.prediction?.showFlags?.bttsShow && ( */}
                  <div className="flex items-center ml-5">
                    <span className="relative flex items-center select-none">
                      <span className="h-8 w-6 bg-[#BAFF1A] border-2 border-black rounded-l-full"></span>
                      <span className="w-auto h-12 md:w-auto md:h-14 px-1 flex items-center justify-center rounded-full bg-[#4F3DFF] border-2 border-black text-white text-[15px] font-medium font-body -mx-3 z-10">
                        {/* {item.tag} */}
                        {getDoubleChanceTag(item?.prediction, item.homeTeam.name, item.awayTeam.name)}
                      </span>
                      <span className="h-8 w-6 bg-[#BAFF1A] rounded-r-full border-2 border-black"></span>
                    </span>
                  </div>
                  {/* )} */}

                </div>
              </div>
            ))}
          </Carousel>
          {trending?.length === 0 && (
            <div className="w-full max-w-[1300px] mx-auto flex flex-col items-center px-2">
              No data available
            </div>
          )}
          <div className="flex justify-center mt-4 gap-2">
            {trending.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide % trending.length
                  ? 'w-6 bg-[#4F3DFF]'
                  : 'w-2 bg-[#373266] hover:bg-[#4F3DFF]'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      )}

    </section>
  );
}
