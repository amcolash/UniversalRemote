import { keyframes, style } from 'typestyle';

export const iconSize = '1.65em';

export const proxyUrl = 'https://home.amcolash.com:9090';

export const remoteUrl = `${proxyUrl}/remote`;
export const spectrumUrl = `${proxyUrl}/spectrum`;
export const fishUrl = `${proxyUrl}/fish-led`;
export const pianoUrl = `${proxyUrl}/piano-led`;
export const sunsetUrl = `${proxyUrl}/sunset`;

const rotationAnimation = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const rotatingStyle = style({
  animationName: rotationAnimation,
  animationDuration: '2s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
});
