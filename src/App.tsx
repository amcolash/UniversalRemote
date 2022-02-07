import React from 'react';
import { FiDroplet, FiHeadphones, FiPower, FiSun, FiTriangle, FiVolume1, FiVolume2 } from 'react-icons/fi';
import { style } from 'typestyle';

import { Button, ButtonStatus } from './Button';
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
          <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.On} />
          <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.Off} />
        </Section>

        <Section label="Computer">
          <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.On} />
        </Section>
      </div>

      <div className={rowStyle}>
        <Section label="Stereo">
          <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.On} />
          <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.Off} />
          <Button icon={<FiVolume1 size={iconSize} />} status={ButtonStatus.Neutral} />
          <Button icon={<FiVolume2 size={iconSize} />} status={ButtonStatus.Neutral} />
        </Section>
      </div>

      <div className={rowStyle}>
        <Section label="HDMI">
          <Button icon={<FiTriangle size={iconSize} style={{ transform: 'rotate(180deg)' }} />} status={ButtonStatus.Neutral} />
          <Button icon={<FiTriangle size={iconSize} />} status={ButtonStatus.Neutral} />
        </Section>
        <Section label="Piano">
          <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.On} />
          <Button icon={<FiSun size={iconSize} />} status={ButtonStatus.Neutral} />
        </Section>
      </div>

      <div className={rowStyle}>
        <Section label="Fish Hat">
          <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.On} />
          <Button icon={<FiDroplet size={iconSize} />} status={ButtonStatus.Neutral} />
        </Section>
        <Section label="Sunset">
          <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.On} />
          <Button icon={<FiSun size={iconSize} />} status={ButtonStatus.Neutral} />
        </Section>
      </div>

      <div className={rowStyle}>
        <Section label="LED Spectrum">
          <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.On} />
          <Button icon={<FiSun size={iconSize} />} status={ButtonStatus.Neutral} />
          <Button icon={<FiHeadphones size={iconSize} />} status={ButtonStatus.On} />
        </Section>
      </div>
    </div>
  );
}
