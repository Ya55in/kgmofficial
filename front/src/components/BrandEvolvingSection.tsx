'use client';

import React from 'react';
import Image from 'next/image';

const BrandEvolvingSection: React.FC = () => {
  return (
    <>
      <style jsx>{`
        .falling-stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .falling-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: falling linear infinite;
        }

        .falling-star-01 {
          left: 20%;
          animation-duration: 3s;
          animation-delay: 0s;
        }

        .falling-star-02 {
          left: 50%;
          animation-duration: 4s;
          animation-delay: 1s;
        }

        .falling-star-03 {
          left: 80%;
          animation-duration: 5s;
          animation-delay: 2s;
        }

        @keyframes falling {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .falling-star::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          border-radius: 50%;
        }

        .star-field {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, white, transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(1px 1px at 130px 80px, white, transparent),
            radial-gradient(2px 2px at 160px 30px, white, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          opacity: 0.8;
        }

        .milky-way {
          position: absolute;
          top: 20%;
          right: 10%;
          width: 200px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(-15deg);
          opacity: 0.6;
        }

        .shooting-star {
          position: absolute;
          top: 15%;
          left: 10%;
          width: 100px;
          height: 1px;
          background: linear-gradient(90deg, white, transparent);
          animation: shooting 3s linear infinite;
          opacity: 0.8;
        }

        @keyframes shooting {
          0% {
            transform: translateX(-100px) translateY(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100px) translateY(20px);
            opacity: 0;
          }
        }
      `}</style>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-black">
        {/* Star Field Background */}
        <div className="star-field"></div>
        
        {/* Milky Way */}
        <div className="milky-way"></div>
        
        {/* Shooting Star */}
        <div className="shooting-star"></div>
        
        {/* Falling Stars Animation */}
        <div className="falling-stars">
          <div className="falling-star falling-star-01"></div>
          <div className="falling-star falling-star-02"></div>
          <div className="falling-star falling-star-03"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="space-y-4 lg:space-y-6">
            {/* Main heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-wide">
              KGM is evolving
            </h2>

            {/* First paragraph */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed font-light">
                We are transforming into a company that satisfies diverse urban and outdoor lifestyles 
                with practical, creative, and safe mobility solutions, satisfying and bringing joy to our customers.
              </p>
            </div>

            {/* Second paragraph */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed font-light">
                The new value system was developed to communicate KGM's direction both internally and externally, 
                provide guidelines for mid-to long-term strategies, and encourage changes in employee behavior, 
                ultimately aiming to shift consumer brand perception.
              </p>
            </div>

            {/* Enjoy with Confidence Icon */}
            <div className="pt-4 flex justify-center">
              <div className="text-white text-lg font-bold tracking-wider">
                ENJOY WITH CONFIDENCE
              </div>
            </div>
          </div>
        </div>

        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
      </section>
    </>
  );
};

export default BrandEvolvingSection;