"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Upload,
  Download,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function VideoAnnotationTool() {
  // Add styles at the top of the component
  const styles = {
    labelsDropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      backgroundColor: "white",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      zIndex: 1000,
      maxHeight: "200px",
      overflowY: "auto",
      width: "200px",
    },
    labelItem: {
      padding: "8px 12px",
      cursor: "pointer",
      transition: "background-color 0.2s",
      "&:hover": {
        backgroundColor: "#f0f0f0",
      },
    },
    selectedLabel: {
      backgroundColor: "#e6f7ff",
      fontWeight: "bold",
    },
  };

  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [splitLength, setSplitLength] = useState(1);
  const [frames, setFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [showLabelsDropdown, setShowLabelsDropdown] = useState(false);
  const [outputFilename, setOutputFilename] = useState("");

  // Video name state - now includes actual video name
  const [videoName, setVideoName] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState("");

  // Available labels for annotation matching the image format
  const [availableLabels] = useState([
    "C-Z1-Z2",
    "C-Z2-Z3",
    "C-Z3-Z4",
    "C-Z1-Z4",
    "C-Z2-Z4",
    "C-Z1-Z3",
  ]);

  // Output annotations - this will be exported in the format shown in the image
  const [outputAnnotations, setOutputAnnotations] = useState([]);

  // Upload & Split progress states (minimal changes)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [splitProgress, setSplitProgress] = useState(0);
  const [isSplitting, setIsSplitting] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load annotations from localStorage on component mount
  useEffect(() => {
    const savedAnnotations = localStorage.getItem('videoAnnotations');
    if (savedAnnotations) {
      try {
        setOutputAnnotations(JSON.parse(savedAnnotations));
      } catch (error) {
        console.error('Error loading saved annotations:', error);
      }
    }
  }, []);

  // Save annotations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('videoAnnotations', JSON.stringify(outputAnnotations));
  }, [outputAnnotations]);

  // Reset video-specific states when video changes
  useEffect(() => {
    if (video) {
      // Clear frames and reset selection for new video
      setFrames([]);
      setSelectedFrame(0);
      setCurrentTime(0);
      setShowLabelsDropdown(false);
    }
  }, [video]);

  // Handle video upload (file selection)
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      // Generate unique ID for this video session
      const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentVideoId(videoId);
      
      // Set the actual video name without extension
      const actualVideoName = file.name.split(".")[0];
      setVideoName(actualVideoName);
      
      setVideo(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setFrames([]);
      setSelectedFrame(0);
      setCurrentTime(0);
      
      // Set output filename based on actual video name
      setOutputFilename(`${actualVideoName}_annotations`);

      // reset upload progress so user can click Upload
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  // Function to run when user clicks the Upload button
  const handleUploadClick = () => {
    // If no file selected, open file picker (same UX as before)
    if (!video) {
      fileInputRef.current?.click();
      return;
    }

    // If already uploading, do nothing
    if (isUploading) return;

    // Use FileReader to provide real progress events for local file read (simulates upload progress)
    try {
      const reader = new FileReader();
      setIsUploading(true);
      setUploadProgress(0);

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      reader.onloadstart = () => {
        setUploadProgress(0);
      };

      reader.onloadend = () => {
        // mark as 100% upon completion
        setUploadProgress(100);
        // small delay so user sees 100%
        setTimeout(() => {
          setIsUploading(false);
        }, 300);
      };

      // We don't need reader.result for functionality since we use URL.createObjectURL,
      // but reading gives us progress events.
      reader.readAsArrayBuffer(video);
    } catch (err) {
      console.error("Upload simulation error:", err);
      setIsUploading(false);
    }
  };

  // Extract frames at specified intervals (preserve logic, add split progress)
  const extractFrames = async () => {
    if (!videoRef.current || !canvasRef.current || !duration) return;

    const videoEl = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 120;

    const frameInterval = splitLength * 60; // Convert minutes to seconds
    const totalFrames = Math.floor(duration / frameInterval);
    const newFrames = [];

    setIsSplitting(true);
    setSplitProgress(0);

    // figure out how many frames we'll actually extract (original limited to 5)
    const framesToExtract = Math.min(totalFrames, 4) + 1; // +1 because loop uses <=
    try {
      for (let i = 0; i <= totalFrames && i < 5; i++) {
        // Limit to 5 frames like in image
        const time = i * frameInterval;
        videoEl.currentTime = time;

        await new Promise((resolve) => {
          videoEl.onseeked = () => {
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            const frameData = canvas.toDataURL("image/jpeg", 0.8);
            newFrames.push({
              time,
              image: frameData,
              timestamp: formatTime(time),
              index: i,
              videoId: currentVideoId, // Associate frame with current video
            });

            // update split progress
            const percent = Math.round(((i + 1) / framesToExtract) * 100);
            setSplitProgress(percent);
            resolve();
          };
        });
      }

      setFrames(newFrames);
      if (newFrames.length > 0) {
        videoEl.currentTime = newFrames[0].time;
      }
    } finally {
      // ensure flags are reset even if something fails
      setSplitProgress(100);
      setTimeout(() => {
        setIsSplitting(false);
      }, 200);
    }
  };

  // Format time display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Video playback controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, currentTime - 5);
    }
  };

  const seekForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, currentTime + 5);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Select frame and seek to that time
  const selectFrame = (frameIndex) => {
    setSelectedFrame(frameIndex);
    if (videoRef.current && frames[frameIndex]) {
      videoRef.current.currentTime = frames[frameIndex].time;
    }
  };

  // Get annotations for current frame (filtered by current video)
  const getCurrentFrameAnnotations = () => {
    if (!frames.length) return [];
    
    const currentFrame = frames[selectedFrame];
    return outputAnnotations.filter(annotation => 
      annotation.videoId === currentVideoId && 
      annotation.frameIndex === selectedFrame
    );
  };

  // Add label to output annotations following the image format
  const addLabelToOutput = (label) => {
    if (!frames.length || !currentVideoId) return; // Don't add if no frames exist or no video loaded

    const currentFrame = frames[selectedFrame];
    
    // Use actual video name and proper split naming
    const splitNumber = selectedFrame + 1;
    const splitName = `${videoName}/split${splitNumber}`;

    // Check if we already have an annotation for this frame in current video
    const existingAnnotationIndex = outputAnnotations.findIndex(
      (a) => a.frameIndex === selectedFrame && 
             a.videoId === currentVideoId &&
             a.videoName === splitName
    );

    if (existingAnnotationIndex !== -1) {
      // Update existing annotation - add label if it doesn't exist
      const updatedAnnotations = [...outputAnnotations];
      const existingLabels = updatedAnnotations[existingAnnotationIndex].labels;

      // Check if label already exists
      if (!existingLabels.includes(label)) {
        updatedAnnotations[existingAnnotationIndex] = {
          ...updatedAnnotations[existingAnnotationIndex],
          labels: [...existingLabels, label],
        };
        setOutputAnnotations(updatedAnnotations);
      }
    } else {
      // Add new annotation with proper video identification
      const newAnnotation = {
        id: Date.now(),
        videoName: splitName,
        videoId: currentVideoId,
        actualVideoName: videoName,
        labels: [label],
        frameIndex: selectedFrame,
        timestamp: currentFrame?.timestamp || "0:00",
        frameTime: currentFrame?.time || 0,
      };

      setOutputAnnotations([...outputAnnotations, newAnnotation]);
    }

    // Hide the labels dropdown after selection
    setShowLabelsDropdown(false);
  };

  // Remove a specific label from an annotation
  const removeLabelFromAnnotation = (annotationId, labelToRemove) => {
    setOutputAnnotations(
      (prev) =>
        prev
          .map((annotation) => {
            if (annotation.id === annotationId) {
              const updatedLabels = annotation.labels.filter(
                (label) => label !== labelToRemove
              );

              // If no labels left, remove the entire annotation
              if (updatedLabels.length === 0) {
                return null;
              }

              return {
                ...annotation,
                labels: updatedLabels,
              };
            }
            return annotation;
          })
          .filter(Boolean) // Remove null entries
    );
  };

  // Remove annotation
  const removeAnnotation = (id) => {
    setOutputAnnotations((prev) => prev.filter((ann) => ann.id !== id));
  };

  // Move annotation up in the list
  const moveAnnotationUp = (index) => {
    if (index <= 0) return; // Can't move first item up
    
    const newAnnotations = [...outputAnnotations];
    const temp = newAnnotations[index];
    newAnnotations[index] = newAnnotations[index - 1];
    newAnnotations[index - 1] = temp;
    
    setOutputAnnotations(newAnnotations);
  };

  // Move annotation down in the list
  const moveAnnotationDown = (index) => {
    if (index >= outputAnnotations.length - 1) return; // Can't move last item down
    
    const newAnnotations = [...outputAnnotations];
    const temp = newAnnotations[index];
    newAnnotations[index] = newAnnotations[index + 1];
    newAnnotations[index + 1] = temp;
    
    setOutputAnnotations(newAnnotations);
  };

  // Move label up within an annotation
  const moveLabelUp = (annotationId, labelIndex) => {
    if (labelIndex <= 0) return; // Can't move first label up
    
    setOutputAnnotations(prev => 
      prev.map(annotation => {
        if (annotation.id === annotationId) {
          const newLabels = [...annotation.labels];
          const temp = newLabels[labelIndex];
          newLabels[labelIndex] = newLabels[labelIndex - 1];
          newLabels[labelIndex - 1] = temp;
          
          return {
            ...annotation,
            labels: newLabels
          };
        }
        return annotation;
      })
    );
  };

  // Move label down within an annotation
  const moveLabelDown = (annotationId, labelIndex) => {
    setOutputAnnotations(prev => 
      prev.map(annotation => {
        if (annotation.id === annotationId) {
          if (labelIndex >= annotation.labels.length - 1) return annotation; // Can't move last label down
          
          const newLabels = [...annotation.labels];
          const temp = newLabels[labelIndex];
          newLabels[labelIndex] = newLabels[labelIndex + 1];
          newLabels[labelIndex + 1] = temp;
          
          return {
            ...annotation,
            labels: newLabels
          };
        }
        return annotation;
      })
    );
  };

  // Move label to first position within an annotation
  const moveLabelToFirst = (annotationId, labelIndex) => {
    if (labelIndex === 0) return; // Already first
    
    setOutputAnnotations(prev => 
      prev.map(annotation => {
        if (annotation.id === annotationId) {
          const newLabels = [...annotation.labels];
          const [movedLabel] = newLabels.splice(labelIndex, 1);
          newLabels.unshift(movedLabel);
          
          return {
            ...annotation,
            labels: newLabels
          };
        }
        return annotation;
      })
    );
  };

  // Move label to last position within an annotation
  const moveLabelToLast = (annotationId, labelIndex) => {
    setOutputAnnotations(prev => 
      prev.map(annotation => {
        if (annotation.id === annotationId) {
          if (labelIndex === annotation.labels.length - 1) return annotation; // Already last
          
          const newLabels = [...annotation.labels];
          const [movedLabel] = newLabels.splice(labelIndex, 1);
          newLabels.push(movedLabel);
          
          return {
            ...annotation,
            labels: newLabels
          };
        }
        return annotation;
      })
    );
  };

  // Export annotations as CSV in the format shown in the image
  const exportAnnotations = () => {
    const headers = ["Video Name", "Labels"];
    const csvContent = [
      headers.join(","),
      ...outputAnnotations.map((annotation) =>
        [annotation.videoName, `{${annotation.labels.join(" | ")}}`].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputFilename || "annotations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear all annotations
  const clearAllAnnotations = () => {
    if (confirm("Are you sure you want to clear all annotations?")) {
      setOutputAnnotations([]);
    }
  };

  // Clear current video annotations only
  const clearCurrentVideoAnnotations = () => {
    if (confirm("Are you sure you want to clear annotations for the current video?")) {
      setOutputAnnotations(prev => 
        prev.filter(annotation => annotation.videoId !== currentVideoId)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Section - Video and Frame Timeline */}
          <div className="lg:col-span-3 space-y-4">
            {/* Frame Timeline */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {frames.map((frame, index) => (
                  <div key={index} className="flex-shrink-0 text-center">
                    <div
                      className={`cursor-pointer border-4 rounded-lg overflow-hidden ${
                        selectedFrame === index
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => selectFrame(index)}
                    >
                      <img
                        src={frame.image}
                        alt={`Frame ${index + 1}`}
                        className="w-32 h-20 object-cover"
                      />
                    </div>
                    <div className="text-xs font-medium text-red-600 mt-1">
                      {frame.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Video Player */}
            <div className="bg-white rounded-lg shadow">
              <div className="aspect-video bg-black rounded-t-lg overflow-hidden relative">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">
                        Upload a video to start annotation
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Controls */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button
                    onClick={seekBackward}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={!video}
                    title="Backward 5s"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={!video}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={seekForward}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={!video}
                    title="Forward 5s"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <button
                    onClick={restartVideo}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={!video}
                    title="Restart"
                  >
                    ↻
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                    style={{
                      width:
                        duration > 0
                          ? `${(currentTime / duration) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Controls and Annotations */}
          <div className="space-y-4">
            {/* File Upload */}
            <div className="bg-white rounded-lg shadow p-4">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <span>Browse</span>
                <Upload className="w-4 h-4" />
              </button>

              {/* Upload button now triggers handleUploadClick and shows progress */}
              <div className="mt-2">
                <button
                  onClick={handleUploadClick}
                  className="w-full mt-0 flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={isUploading}
                >
                  <span>Upload</span>
                  <Upload className="w-4 h-4" />
                </button>

                {/* Upload progress (minimal UI change) */}
                {(isUploading || uploadProgress > 0) && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex-1 w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-blue-500 h-2 rounded transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className="text-xs w-10 text-right">
                      {uploadProgress}%
                    </div>
                  </div>
                )}
              </div>

              {/* Current Video Info */}
              {videoName && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  <strong>Current Video:</strong> {videoName}
                </div>
              )}
            </div>

            {/* Split Length Control */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter split length in minutes
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={splitLength}
                  onChange={(e) =>
                    setSplitLength(parseFloat(e.target.value) || 1)
                  }
                  className="flex-1 px-3 text-black py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  onClick={extractFrames}
                  disabled={!video || isSplitting}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Split ✂
                </button>
                <button
                  onClick={() => setShowLabelsDropdown(true)}
                  disabled={!frames.length}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Choose 🎯
                </button>
              </div>

              {/* Split progress (minimal UI change) */}
              {(isSplitting || splitProgress > 0) && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="flex-1 w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-green-500 h-2 rounded transition-all"
                      style={{ width: `${splitProgress}%` }}
                    />
                  </div>
                  <div className="text-xs w-10 text-right">
                    {splitProgress}%
                  </div>
                </div>
              )}
            </div>

            {/* Labels Dropdown */}
            <div className="bg-white rounded-lg shadow p-4 relative">
              <div className="mb-2 font-medium text-gray-700">
                Current Frame Label:
              </div>
              <button
                onClick={() => setShowLabelsDropdown(!showLabelsDropdown)}
                disabled={!frames.length}
                className="w-full flex items-center justify-between p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <span>
                  {getCurrentFrameAnnotations()
                    .flatMap(a => a.labels)
                    .join(", ") || "Select Label"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    showLabelsDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showLabelsDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                  {availableLabels.map((label, index) => {
                    const isSelected = getCurrentFrameAnnotations()
                      .flatMap(a => a.labels)
                      .includes(label);
                    return (
                      <button
                        key={index}
                        onClick={() => addLabelToOutput(label)}
                        className={`w-full text-left text-black px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0
                          ${
                            isSelected
                              ? "bg-blue-50 font-medium text-blue-600"
                              : ""
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Output Annotations */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-black">Output Annotations</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={clearCurrentVideoAnnotations}
                    disabled={!currentVideoId}
                    className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 disabled:opacity-50"
                    title="Clear current video annotations"
                  >
                    Clear Current
                  </button>
                  <button
                    onClick={clearAllAnnotations}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {outputAnnotations
                  .filter(annotation => annotation.videoId === currentVideoId)
                  .map((annotation, index) => {
                    const globalIndex = outputAnnotations.findIndex(a => a.id === annotation.id);
                    return (
                      <div key={annotation.id} className="p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {annotation.videoName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {annotation.timestamp}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => moveAnnotationUp(globalIndex)}
                              disabled={globalIndex === 0}
                              className={`p-1 rounded ${
                                globalIndex === 0 
                                  ? "text-gray-300 cursor-not-allowed" 
                                  : "text-gray-600 hover:bg-gray-200"
                              }`}
                              title="Move annotation up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveAnnotationDown(globalIndex)}
                              disabled={globalIndex === outputAnnotations.length - 1}
                              className={`p-1 rounded ${
                                globalIndex === outputAnnotations.length - 1
                                  ? "text-gray-300 cursor-not-allowed" 
                                  : "text-gray-600 hover:bg-gray-200"
                              }`}
                              title="Move annotation down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeAnnotation(annotation.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete annotation"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {annotation.labels.map((label, labelIndex) => (
                            <div
                              key={labelIndex}
                              className="flex items-center bg-blue-100 rounded-full px-3 py-1 text-xs font-medium text-blue-800"
                            >
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => moveLabelToFirst(annotation.id, labelIndex)}
                                  disabled={labelIndex === 0}
                                  className={`p-0.5 rounded ${
                                    labelIndex === 0 
                                      ? "text-blue-300 cursor-not-allowed" 
                                      : "text-blue-600 hover:bg-blue-200"
                                  }`}
                                  title="Move to first"
                                >
                                  ⇈
                                </button>
                                <button
                                  onClick={() => moveLabelUp(annotation.id, labelIndex)}
                                  disabled={labelIndex === 0}
                                  className={`p-0.5 rounded ${
                                    labelIndex === 0 
                                      ? "text-blue-300 cursor-not-allowed" 
                                      : "text-blue-600 hover:bg-blue-200"
                                  }`}
                                  title="Move up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <span>{label}</span>
                                <button
                                  onClick={() => moveLabelDown(annotation.id, labelIndex)}
                                  disabled={labelIndex === annotation.labels.length - 1}
                                  className={`p-0.5 rounded ${
                                    labelIndex === annotation.labels.length - 1
                                      ? "text-blue-300 cursor-not-allowed" 
                                      : "text-blue-600 hover:bg-blue-200"
                                  }`}
                                  title="Move down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => moveLabelToLast(annotation.id, labelIndex)}
                                  disabled={labelIndex === annotation.labels.length - 1}
                                  className={`p-0.5 rounded ${
                                    labelIndex === annotation.labels.length - 1
                                      ? "text-blue-300 cursor-not-allowed" 
                                      : "text-blue-600 hover:bg-blue-200"
                                  }`}
                                  title="Move to last"
                                >
                                  ⇊
                                </button>
                                <button
                                  onClick={() =>
                                    removeLabelFromAnnotation(annotation.id, label)
                                  }
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                  title="Remove label"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                {outputAnnotations.filter(annotation => annotation.videoId === currentVideoId).length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No annotations for current video
                  </div>
                )}
              </div>
            </div>

            {/* Export */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter output filename in .csv
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="annotations.csv"
                  value={outputFilename}
                  onChange={(e) => setOutputFilename(e.target.value)}
                  className="flex-1 px-3 text-black py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <button
                  onClick={exportAnnotations}
                  className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 flex items-center space-x-1"
                >
                  <span>Save</span>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for frame extraction */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}