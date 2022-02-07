import React from 'react';
import { keyframes, style } from 'typestyle';
import { FiRefreshCw } from 'react-icons/fi';

import { iconSize } from './util';

export enum ButtonStatus {
  Neutral,
  On,
  Off,
  Loading,
}

interface ButtonProps {
  icon: JSX.Element;
  status: ButtonStatus;
  onClick?: () => void;
  onHold?: () => void;
}

const buttonStyle = style({
  border: '2px solid white',
  background: 'none',
  borderRadius: '100%',
  width: `calc(${iconSize} * 1.75)`,
  height: `calc(${iconSize} * 1.75)`,
  margin: '0 0.6em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const rotationAnimation = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const rotatingStyle = style({
  animationName: rotationAnimation,
  animationDuration: '2s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
});

export function Button(props: ButtonProps): React.ReactElement {
  const color =
    props.status === ButtonStatus.Neutral || props.status === ButtonStatus.Loading
      ? 'white'
      : props.status === ButtonStatus.Off
      ? 'red'
      : 'lime';

  return (
    <button className={buttonStyle} onClick={props.onClick} style={{ color }}>
      {props.status === ButtonStatus.Loading ? <FiRefreshCw size={`calc(${iconSize} * 0.85)`} className={rotatingStyle} /> : props.icon}
    </button>
  );
}
