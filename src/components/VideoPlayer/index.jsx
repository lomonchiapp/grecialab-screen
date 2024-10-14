import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Grid from '@mui/material/Grid2';
import { Modal, Box, Typography } from '@mui/material';
import { useScreenState } from '../../global/useScreenState';

export const VideoPlayer = () => {
    const { videos, subscribeToVideos } = useScreenState();
    const [videoIndex, setVideoIndex] = useState(0);

    useEffect(() => {
        const unsubscribe = subscribeToVideos();
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (videos.length > 0) {
            setVideoIndex(0); // Start from the first video when videos are updated
        }
    }, [videos]);

    const handleVideoEnd = () => {
        setVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    useEffect(() => {
        console.log('Current video URL:', videos[videoIndex]?.url);
        console.log('Videos array:', videos);
        console.log('Current video index:', videoIndex);
    }, [videoIndex, videos]);

    return (
        <Grid container>
        {videos.length > 0 && (
            <ReactPlayer
                url={videos[videoIndex]?.url}
                playing={true}
                controls={false}
                onEnded={handleVideoEnd}
                width="100%"
                loop={false}
                height="68vh"
                config={{
                    youtube: {
                        playerVars: {
                            autoplay: 1,
                            controls: 0,
                            modestbranding: 1, // Minimal YouTube branding
                            rel: 0, // Disable related videos
                            iv_load_policy: 3, // Disable video annotations
                            disablekb: 1, // Disable keyboard controls
                            fs: 0, // Disable fullscreen button
                            cc_load_policy: 0, // Disable closed captions
                            playsinline: 1, // Play inline on mobile
                            mute: 1, // Ensure the video is muted to autoplay on some browsers
                            showinfo: 0, // Hide video title and uploader info
                            branding: 0, // Hide YouTube logo
                        },
                    },
                }}
            />
        )}
    </Grid>
    );
};