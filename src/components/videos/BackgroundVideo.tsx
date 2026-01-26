import { useEffect, useRef, useState } from "react";

// Define types for window.jQuery and mb_YTPlayer plugin
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    jQuery?: any;
  }
}

interface VideoProps {
  starts?: number;
  videoId?: string;
}

const BackgroundVideo: React.FC<VideoProps> = ({ starts, videoId }) => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      // Check if scripts are already loaded
      const jQueryLoaded = !!window.jQuery;
      const ytPlayerLoaded = !!document.querySelector(
        'script[src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mb.YTPlayer/3.3.9/jquery.mb.YTPlayer.min.js"]',
      );

      // Load CSS for YTPlayer only if not already loaded
      const loadCSS = (href: string) => {
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          document.head.appendChild(link);
        }
      };

      // Load external script function with TypeScript annotations
      const loadScript = (src: string, onLoad: () => void) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          // Script exists, wait a bit and call onLoad
          setTimeout(onLoad, 100);
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = onLoad;
        document.body.appendChild(script);
      };

      const initializePlayer = () => {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (window.jQuery && playerRef.current) {
            const $player = window.jQuery(playerRef.current);

            // Completely remove any existing player instance
            const container = window.jQuery(".video-bg-live");
            container.find("iframe").remove();
            container.find(".mb_YTPlayer").remove();

            // Remove data attributes
            $player.removeData("mb_YTPlayer");
            $player.removeAttr("id");

            // Reinitialize the player
            $player.mb_YTPlayer();

            $player.on("YTPReady", () => {
              console.log("YouTube Background Player is ready!");
              setIsReady(true);
            });
          }
        }, 200);
      };

      // Load CSS first
      loadCSS(
        "https://cdnjs.cloudflare.com/ajax/libs/jquery.mb.YTPlayer/3.3.9/css/jquery.mb.YTPlayer.min.css",
      );

      // Load jQuery and YTPlayer if needed
      if (jQueryLoaded && ytPlayerLoaded) {
        // Scripts already loaded, just initialize
        initializePlayer();
      } else {
        // Load jQuery, then YTPlayer plugin
        loadScript("https://code.jquery.com/jquery-3.6.0.min.js", () => {
          loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/jquery.mb.YTPlayer/3.3.9/jquery.mb.YTPlayer.min.js",
            () => {
              initializePlayer();
            },
          );
        });
      }
    }

    // Cleanup: destroy player but keep scripts loaded for reuse
    return () => {
      setIsReady(false);
      if (window.jQuery && playerRef.current) {
        try {
          const $player = window.jQuery(playerRef.current);
          if ($player.length && $player.data("mb_YTPlayer")) {
            $player.YTPPause();
            $player.YTPDestroy();
          }
        } catch (e) {
          console.log("Cleanup error:", e);
        }
      }
    };
  }, [videoId, starts]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div
        className="player"
        ref={playerRef}
        data-property={`{
                    videoURL:"${videoId}",
                    containment:'.video-bg-live',
                    showControls:false,
                    autoPlay:true,
                    zoom:0,
                    loop:true,
                    mute:true,
                    startAt:${starts},
                    opacity:1,
                    quality:'default'
                    }`}
      />
    </>
  );
};

export default BackgroundVideo;
