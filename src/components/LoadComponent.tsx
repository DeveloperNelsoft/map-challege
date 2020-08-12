import React from 'react';
import Lottie from 'react-lottie';
import loadingLottie from '../assets/loading.json'

const DefaultOptionsLoading = {
  loop: true,
  autoplay: true,
  animationData: loadingLottie,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export const LoadComponent = () => (
  <div className="Lottie">
    <Lottie options={DefaultOptionsLoading} width={150} height={150} />
  </div>
);
