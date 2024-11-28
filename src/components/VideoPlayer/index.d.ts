import { FC, HTMLAttributes } from 'react';

interface VideoPlayerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const VideoPlayer: FC<VideoPlayerProps>; 