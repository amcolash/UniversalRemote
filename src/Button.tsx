import React from 'react';
import { style } from 'typestyle';

import { iconSize } from './util';

interface ButtonProps {
  icon: JSX.Element;
  state: 'neutral' | 'on' | 'off';
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

export function Button(props: ButtonProps): React.ReactElement {
  const color = props.state === 'neutral' ? 'white' : props.state === 'off' ? 'red' : 'lime';

  return (
    <button className={buttonStyle} onClick={props.onClick} style={{ color }}>
      {props.icon}
    </button>
  );
}
