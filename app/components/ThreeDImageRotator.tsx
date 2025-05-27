import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import Controls from "./Controls"; // Assuming this is your separate component

interface ThreeDImageRotatorProps {
  basePath: string; // e.g., '/images/my-object/'
  frameCount: number; // Total number of images
  imageExtension?: string; // e.g., 'jpg', 'png'
  width?: string; // CSS width, e.g., '500px', '100%'
  height?: string; // CSS height, e.g., '300px', 'auto'
  rotationSensitivity: number;
  display360: boolean;
  displayCockpit: boolean;
  setDisplay360Active: () => void;
  setDisplayCockpitActive: () => void;
}

export default function ThreeDImageRotator({
  basePath,
  frameCount,
  imageExtension = "png",
  rotationSensitivity,
  display360,
  displayCockpit,
  setDisplay360Active,
  setDisplayCockpitActive,
}: ThreeDImageRotatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentInternalFrameIndex, setCurrentInternalFrameIndex] = useState(0); // Changed to 0 for initial frame consistency
  const [isDragging, setIsDragging] = useState(false);
  const [startClientX, setStartClientX] = useState(0);
  const [startInternalFrameIndex, setStartInternalFrameIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState(false); // Added for error handling in UI

  // Preload images by creating img tags and adding a src
  useEffect(() => {
    initialLoad();
  }, [basePath, frameCount, imageExtension]); // Keep dependencies as they are for effect re-run

  const initialLoad = async () => {
    try {
      setLoadingError(false); // Reset error state
      await preloadImages();

      console.log("loaded");
      setImagesLoaded(true); // Only set true when all images are loaded
    } catch (err) {
      console.error("Error during initial image loading:", err);
      setLoadingError(true);
      setImagesLoaded(false); // Ensure loading is false if there's an error
    }
  };

  // Function to get the correct image path (converting internal 0-based to 1-based filename)
  const getImagePath = useCallback(
    (internalIndex: number) => {
      const fileNameIndex = internalIndex + 1; // Convert 0-based to 1-based filename
      return `${basePath}${fileNameIndex}.${imageExtension}`;
    },
    [basePath, imageExtension]
  );

  const preloadImages = useCallback(() => {
    // Wrap in useCallback for stability
    return new Promise<void>((res, rej) => {
      let loadedCount = 0;
      let erroredCount = 0;
      const totalImages = frameCount;

      if (totalImages === 0) {
        // Handle case with no images
        res();
        return;
      }

      for (let i = 0; i < totalImages; i++) {
        // Loop from 0 for consistency with getImagePath(i)
        const img = new Image();
        const imageUrl = getImagePath(i); // Use getImagePath for consistency
        img.src = imageUrl;

        img.onload = () => {
          loadedCount++;
          if (loadedCount + erroredCount === totalImages) {
            if (erroredCount === 0) {
              res(); // All images loaded successfully
            } else {
              rej(new Error(`Failed to load ${erroredCount} images.`)); // Some images failed
            }
          }
        };

        img.onerror = (e) => {
          erroredCount++;
          console.error(`Failed to load image: ${imageUrl}`, e);
          if (loadedCount + erroredCount === totalImages) {
            // Even if errors, if all attempts are done, we resolve/reject
            rej(new Error(`Failed to load ${erroredCount} images.`));
          }
        };
      }
    });
  }, [frameCount, getImagePath]); // getImagePath is a dependency here

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!imagesLoaded) return; // Prevent dragging before images are loaded
      if (e.button === 0) {
        setIsDragging(true);
        setStartClientX(e.clientX);
        setStartInternalFrameIndex(currentInternalFrameIndex);
      }
    },
    [currentInternalFrameIndex, imagesLoaded] // Added imagesLoaded as dependency
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!imagesLoaded) return; // Prevent dragging before images are loaded
      if (e.touches.length === 1) {
        setIsDragging(true);
        setStartClientX(e.touches[0].clientX);
        setStartInternalFrameIndex(currentInternalFrameIndex);
      }
    },
    [currentInternalFrameIndex, imagesLoaded] // Added imagesLoaded as dependency
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const deltaX = e.clientX - startClientX;
      const pixelsPerFrame = containerWidth / frameCount / rotationSensitivity;

      const frameShift = Math.floor(deltaX / pixelsPerFrame);

      let newInternalFrameIndex =
        (startInternalFrameIndex + frameShift) % frameCount;
      if (newInternalFrameIndex < 0) {
        newInternalFrameIndex += frameCount;
      }

      setCurrentInternalFrameIndex(newInternalFrameIndex);
    },
    [
      isDragging,
      startClientX,
      startInternalFrameIndex,
      frameCount,
      rotationSensitivity,
    ] // Added rotationSensitivity
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current || e.touches.length !== 1)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const deltaX = e.touches[0].clientX - startClientX;
      const pixelsPerFrame = containerWidth / frameCount / rotationSensitivity;

      const frameShift = Math.floor(deltaX / pixelsPerFrame);

      let newInternalFrameIndex =
        (startInternalFrameIndex + frameShift) % frameCount;
      if (newInternalFrameIndex < 0) {
        newInternalFrameIndex += frameCount;
      }

      setCurrentInternalFrameIndex(newInternalFrameIndex);
    },
    [
      isDragging,
      startClientX,
      startInternalFrameIndex,
      frameCount,
      rotationSensitivity,
    ] // Added rotationSensitivity
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Attach global mouse/touch event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <Fragment>
      {imagesLoaded && (
        <Controls
          display360={display360}
          displayCockpit={displayCockpit}
          setDisplay360Active={setDisplay360Active}
          setDisplayCockpitActive={setDisplayCockpitActive}
        />
      )}

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="w-full h-full select-none relative overflow-hidden touch-action-none" // Corrected 'action-none' to 'touch-action-none'
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {/* Conditional rendering based on display360 and imagesLoaded */}
        {loadingError ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-lg">
            Error loading images.
          </div>
        ) : imagesLoaded ? (
          // Display 360-degree rotation
          display360 ? (
            Array.from({ length: frameCount }).map((_, idx) => (
              <img
                key={idx}
                // !!! CRITICAL FIX: Use idx for the image source, not currentInternalFrameIndex
                src={getImagePath(idx)}
                alt={`Object Frame ${idx + 1}`}
                className="w-full h-full object-fit absolute top-0 left-0 pointer-events-none" // Changed 'object-fit' to 'object-contain'
                style={{
                  opacity: currentInternalFrameIndex === idx ? 1 : 0,
                  transition: "opacity 0s", // Instant switch
                }}
              />
            ))
          ) : (
            // Display Cockpit view
            <img
              src={`${basePath}Cockpit.jpg`} // Assuming Cockpit.jpg is directly in basePath
              alt={"Cockpit View"} // More descriptive alt text
              className="w-full h-full object-contain pointer-events-none" // Changed 'object-fit' to 'object-contain'
            />
          )
        ) : (
          // Loading spinner/message
          <div className="absolute top-0 left-0 bg-white w-full h-full">
            <div className="absolute top-1/2 left-1/2 translate-x-[-60px] translate-y-[-40px]">
              <img
                className="w-28 h-24"
                src="loader.gif"
                alt="Loading spinner"
              />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
