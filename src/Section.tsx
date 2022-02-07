import React from 'react';
import { style } from 'typestyle';

interface SectionInternalProps {
  label: string;
}

type SectionProps = React.PropsWithChildren<SectionInternalProps>;

const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  margin: '1.25em 0.75em',
});

const headingStyle = style({ fontSize: '1.35em', margin: '0.5em 0' });
const sectionChildrenStyle = style({ display: 'flex', justifyContent: 'center' });

export function Section(props: SectionProps) {
  return (
    <div className={sectionStyle}>
      <h1 className={headingStyle}>{props.label}</h1>
      <div className={sectionChildrenStyle}>{props.children}</div>
    </div>
  );
}
