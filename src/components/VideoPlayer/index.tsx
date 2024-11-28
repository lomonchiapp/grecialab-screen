import React, { useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { useScreenState } from "@/global/useScreenState";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { NotificationOverlay } from "@/components/NotificationOverlay";
import { Notification } from "@/types/types";
import { markNotificationAsSeen } from "@/hooks/notifications/markNotificationAsSeen";
import { Button } from "@/components/ui/button";
import { SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ className }) => {
  const { videos, subscribeToVideos, notifications } = useScreenState();
  const [videoIndex, setVideoIndex] = useState<number>(0);
  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9); // Default aspect ratio

  useEffect(() => {
    const unsubscribe = subscribeToVideos();
    return () => unsubscribe();
  }, [subscribeToVideos]);

  useEffect(() => {
    if (videos.length > 0) {
      setVideoIndex(0);
    }
  }, [videos]);

  useEffect(() => {
    const unprocessedNotifications = notifications.filter(
      (notification) => !notification.seen
    );
    setNotificationQueue(prevQueue => [...prevQueue, ...unprocessedNotifications]);
  }, [notifications]);

  const showNextNotification = useCallback(() => {
    if (notificationQueue.length > 0) {
      const nextNotification = notificationQueue[0];
      setCurrentNotification(nextNotification);
      setIsNotificationVisible(true);
      setNotificationQueue(prevQueue => prevQueue.slice(1));
    } else {
      setCurrentNotification(null);
      setIsNotificationVisible(false);
    }
  }, [notificationQueue]);

  useEffect(() => {
    if (!isNotificationVisible && notificationQueue.length > 0) {
      showNextNotification();
    }
  }, [isNotificationVisible, notificationQueue, showNextNotification]);

  const handleNotificationComplete = useCallback(() => {
    if (currentNotification) {
      markNotificationAsSeen(currentNotification.id);
    }
    setIsNotificationVisible(false);
  }, [currentNotification]);

  const handleSkipNotification = useCallback(() => {
    if (currentNotification) {
      markNotificationAsSeen(currentNotification.id);
    }
    setIsNotificationVisible(false);
  }, [currentNotification]);

  const handleVideoEnd = () => {
    setVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handleVideoReady = (player: ReactPlayer) => {
    const videoWidth = player.getInternalPlayer().videoWidth;
    const videoHeight = player.getInternalPlayer().videoHeight;
    if (videoWidth && videoHeight) {
      setAspectRatio(videoWidth / videoHeight);
    }
  };

  return (
    <Card
      className={cn(
        "w-full h-full overflow-hidden bg-black relative flex items-center justify-center",
        className
      )}
    >
      {videos.length > 0 && (
        <div className="absolute inset-0">
          <ReactPlayer
            url={videos[videoIndex]?.url}
            playing={!isNotificationVisible}
            controls={false}
            muted={true}
            onEnded={handleVideoEnd}
            onReady={handleVideoReady}
            width="100%"
            height="100%"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      <NotificationOverlay
        notification={currentNotification}
        isVisible={isNotificationVisible}
        onNotificationComplete={handleNotificationComplete}
        onExited={showNextNotification}
      />
      {isNotificationVisible && (
        <Button
          onClick={handleSkipNotification}
          className="absolute bottom-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30"
          variant="ghost"
        >
          <SkipForward className="mr-2 h-4 w-4" />
          Saltar
        </Button>
      )}
    </Card>
  );
};

