import { FC, HTMLAttributes } from 'react';

interface ScreenProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const Screen: FC<ScreenProps>; 