import React from 'react';
import { style } from 'typestyle';
import { FiRefreshCw } from 'react-icons/fi';

import { iconSize, rotatingStyle } from './util';

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
  width: `calc(${iconSize} * 2.25)`,
  height: `calc(${iconSize} * 2.25)`,
  margin: '0 0.6em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
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
