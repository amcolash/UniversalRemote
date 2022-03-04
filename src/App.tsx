import React, { useEffect, useState } from 'react';
import { FiDroplet, FiMic, FiMonitor, FiMusic, FiPower, FiRefreshCw, FiSun, FiTriangle, FiVolume1, FiVolume2 } from 'react-icons/fi';
import { style } from 'typestyle';

import { Button, ButtonStatus } from './Button';
import { Section } from './Section';
import { fishUrl, iconSize, pianoUrl, remoteUrl, rotatingStyle, spectrumUrl, sunsetUrl } from './util';

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

interface AppStatus {
  computer: boolean;
  spectrum: number;
  sunset: number;
  piano: number;
  loading: boolean;
}

export function App() {
  const [status, setStatus] = useState<AppStatus>({
    computer: false,
    spectrum: -1,
    sunset: -1,
    piano: -1,
    loading: true,
  });

  useEffect(() => {
    updateData(status, setStatus);

    setInterval(updateData, 30 * 1000);
  }, []);

  return (
    <div className={rootStyle}>
      {status.loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Loading</h1>
          <FiRefreshCw size={48} className={rotatingStyle} />
        </div>
      ) : (
        <>
          <div className={rowStyle}>
            <Section label="Projector">
              <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.On} />
              <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.Off} />
              <Button icon={<FiMonitor size={iconSize} />} status={ButtonStatus.Neutral} />
            </Section>

            <Section label="Computer">
              <Button icon={<FiPower size={iconSize} />} status={status.computer ? ButtonStatus.On : ButtonStatus.Off} />
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
            <Section label="HDMI Switch">
              <Button icon={<FiTriangle size={iconSize} style={{ transform: 'rotate(180deg)' }} />} status={ButtonStatus.Neutral} />
              <Button icon={<FiTriangle size={iconSize} />} status={ButtonStatus.Neutral} />
            </Section>
            <Section label="Piano">
              <Button icon={<FiSun size={iconSize} />} status={status.piano > 0 ? ButtonStatus.On : ButtonStatus.Off} />
              <Button icon={<FiMusic size={iconSize} />} status={ButtonStatus.Neutral} />
            </Section>
          </div>

          <div className={rowStyle}>
            <Section label="Fish Hat">
              <Button icon={<FiPower size={iconSize} />} status={ButtonStatus.Neutral} />
              <Button icon={<FiDroplet size={iconSize} />} status={ButtonStatus.Neutral} />
            </Section>
            <Section label="Sunset">
              <Button
                icon={<FiPower size={iconSize} />}
                status={status.sunset === -1 ? ButtonStatus.Loading : status.sunset === 0 ? ButtonStatus.Off : ButtonStatus.On}
              />
              <Button icon={<FiSun size={iconSize} />} status={ButtonStatus.Neutral} />
            </Section>
          </div>

          <div className={rowStyle}>
            <Section label="LED Spectrum">
              <Button icon={<FiPower size={iconSize} />} status={status.spectrum} />
              <Button icon={<FiSun size={iconSize} />} status={ButtonStatus.Neutral} />
              <Button icon={<FiMic size={iconSize} />} status={ButtonStatus.On} />
            </Section>
          </div>
        </>
      )}
    </div>
  );
}

async function updateData(status: AppStatus, setStatus: (state: AppStatus) => void) {
  const remote = await updateRemote();
  const sunset = await updateSunset();
  const piano = await updatePiano();
  const spectrum = await updateSpectrum();

  const modifiedStatus: AppStatus = {
    ...status,

    ...remote,
    ...sunset,
    ...piano,
    ...spectrum,

    loading: false,
  };

  setStatus(modifiedStatus);
}

function updateRemote(): Promise<{ computer: boolean } | void> {
  return fetch(remoteUrl)
    .then((res) => res.text())
    .then((data) => ({ computer: data.indexOf('0') ? false : true }))
    .catch((err) => console.error(err));
}

function updateSunset(): Promise<{ sunset: number } | void> {
  return fetch(`${sunsetUrl}/brightness`)
    .then((res) => res.json())
    .then((data) => ({ sunset: data.targetBrightness }))
    .catch((err) => console.error(err));
}

function updatePiano(): Promise<{ piano: number } | void> {
  return fetch(`${pianoUrl}/status`)
    .then((res) => res.json())
    .then((data) => ({ piano: data.brightness }))
    .catch((err) => console.error(err));
}

function updateSpectrum(): Promise<{ spectrum: number } | void> {
  return fetch(`${spectrumUrl}/brightness`)
    .then((res) => res.text())
    .then((data) => ({ spectrum: Number.parseInt(data) }))
    .catch((err) => console.error(err));
}
