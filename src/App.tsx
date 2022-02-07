import React from 'react';
import { FiDroplet, FiHeadphones, FiPower, FiSun, FiTriangle, FiVolume1, FiVolume2 } from 'react-icons/fi';
import { style } from 'typestyle';

import { Button } from './Button';
import { Section } from './Section';
import { iconSize } from './util';

const rootStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
});

const rowStyle = style({
  display: 'flex',
  justifyContent: 'space-around',
});

export function App() {
  return (
    <div className={rootStyle}>
      <div className={rowStyle}>
        <Section label="Projector">
          <Button icon={<FiPower size={iconSize} />} state="on" />
          <Button icon={<FiPower size={iconSize} />} state="off" />
        </Section>

        <Section label="Computer">
          <Button icon={<FiPower size={iconSize} />} state="on" />
        </Section>
      </div>

      <div className={rowStyle}>
        <Section label="Stereo">
          <Button icon={<FiPower size={iconSize} />} state="on" />
          <Button icon={<FiPower size={iconSize} />} state="off" />
          <Button icon={<FiVolume1 size={iconSize} />} state="neutral" />
          <Button icon={<FiVolume2 size={iconSize} />} state="neutral" />
        </Section>
      </div>

      <div className={rowStyle}>
        <Section label="HDMI">
          <Button icon={<FiTriangle size={iconSize} style={{ transform: 'rotate(180deg)' }} />} state="neutral" />
          <Button icon={<FiTriangle size={iconSize} />} state="neutral" />
        </Section>
        <Section label="Piano">
          <Button icon={<FiPower size={iconSize} />} state="on" />
          <Button icon={<FiSun size={iconSize} />} state="neutral" />
        </Section>
      </div>

      <div className={rowStyle}>
        <Section label="Fish Hat">
          <Button icon={<FiPower size={iconSize} />} state="on" />
          <Button icon={<FiDroplet size={iconSize} />} state="neutral" />
        </Section>
        <Section label="Sunset">
          <Button icon={<FiPower size={iconSize} />} state="on" />
          <Button icon={<FiSun size={iconSize} />} state="neutral" />
        </Section>
      </div>

      <div className={rowStyle}>
        <Section label="LED Spectrum">
          <Button icon={<FiPower size={iconSize} />} state="on" />
          <Button icon={<FiSun size={iconSize} />} state="neutral" />
          <Button icon={<FiHeadphones size={iconSize} />} state="on" />
        </Section>
      </div>
    </div>
  );
}
