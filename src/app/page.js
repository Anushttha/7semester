"use client"




import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Upload, Download, ChevronDown, ChevronUp, X, Plus, Minus } from 'lucide-react';

export default function VideoAnnotationTool() {
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [splitLength, setSplitLength] = useState(1);
  const [frames, setFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [showLabelsDropdown, setShowLabelsDropdown] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');
  
  // Available labels for annotation
  const [availableLabels] = useState([
    'C:Z1-Z3',
    'C:Z1-Z2', 
    'C+:Z3-Z4',
    'C+:Z1-Z2',
    'P:C1-C2',
    'P+:C1-C2',
    'P+:C1-C2'
  ]);

  // Output annotations - this will be exported
  const [outputAnnotations, setOutputAnnotations] = useState([
    { id: 1, label: 'C:Z1-Z2', status: 'up', splitName: 'split_1', frameIndex: 0, timestamp: '1:00' },
    { id: 2, label: 'P:C1-C4', status: 'down', splitName: 'split_2', frameIndex: 1, timestamp: '2:00' },  
    { id: 3, label: 'B:Z1-Z2', status: 'up', splitName: 'split_3', frameIndex: 2, timestamp: '3:00' }
  ]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle video upload
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setFrames([]);
      setSelectedFrame(0);
      setCurrentTime(0);
    }
  };

  // Extract frames at specified intervals
  const extractFrames = async () => {
    if (!videoRef.current || !canvasRef.current || !duration) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 200;
    canvas.height = 120;
    
    const frameInterval = splitLength * 60; // Convert minutes to seconds
    const totalFrames = Math.floor(duration / frameInterval);
    const newFrames = [];
    
    for (let i = 0; i <= totalFrames && i < 5; i++) { // Limit to 5 frames like in image
      const time = i * frameInterval;
      video.currentTime = time;
      
      await new Promise(resolve => {
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL('image/jpeg', 0.8);
          newFrames.push({
            time,
            image: frameData,
            timestamp: formatTime(time),
            index: i
          });
          resolve();
        };
      });
    }
    
    setFrames(newFrames);
    if (newFrames.length > 0) {
      video.currentTime = newFrames[0].time;
    }
  };

  // Format time display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  // Add label to output annotations
  const addLabelToOutput = (label) => {
    const currentFrame = frames[selectedFrame];
    const splitName = `split_${selectedFrame + 1}`;
    
    const newAnnotation = {
      id: Date.now(),
      label: label,
      status: 'up', // default status
      frameIndex: selectedFrame,
      timestamp: currentFrame?.timestamp || '0:00',
      splitName: splitName,
      frameTime: currentFrame?.time || 0
    };
    setOutputAnnotations([...outputAnnotations, newAnnotation]);
    setShowLabelsDropdown(false);
  };

  // Toggle annotation status (up/down)
  const toggleAnnotationStatus = (id) => {
    setOutputAnnotations(prev => 
      prev.map(annotation => 
        annotation.id === id 
          ? { ...annotation, status: annotation.status === 'up' ? 'down' : 'up' }
          : annotation
      )
    );
  };

  // Move annotation up/down in list
  const moveAnnotation = (id, direction) => {
    const currentIndex = outputAnnotations.findIndex(ann => ann.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= outputAnnotations.length) return;
    
    const newAnnotations = [...outputAnnotations];
    [newAnnotations[currentIndex], newAnnotations[newIndex]] = [newAnnotations[newIndex], newAnnotations[currentIndex]];
    setOutputAnnotations(newAnnotations);
  };

  // Remove annotation
  const removeAnnotation = (id) => {
    setOutputAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  // Export annotations as CSV
  const exportAnnotations = () => {
    const headers = ['id', 'split_name', 'label', 'status', 'timestamp', 'frame_index', 'frame_time_seconds'];
    const csvContent = [
      headers.join(','),
      ...outputAnnotations.map((annotation, index) => [
        index + 1,
        annotation.splitName || `split_${annotation.frameIndex + 1}`,
        annotation.label,
        annotation.status,
        annotation.timestamp || '0:00',
        annotation.frameIndex || 0,
        annotation.frameTime || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputFilename || 'annotations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate frames when split length changes
  useEffect(() => {
    if (video && duration > 0) {
      extractFrames();
    }
  }, [splitLength, duration]);

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
                        selectedFrame === index ? 'border-red-500' : 'border-gray-300'
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
                      <p className="text-lg">Upload a video to start annotation</p>
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
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
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
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
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
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-2 flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <span>Upload</span>
                <Upload className="w-4 h-4" />
              </button>
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
                  onChange={(e) => setSplitLength(parseFloat(e.target.value) || 1)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  onClick={extractFrames}
                  disabled={!video}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Split ✂
                </button>
                <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                  Choose 🎯
                </button>
              </div>
            </div>

            {/* Labels Dropdown */}
            <div className="bg-white rounded-lg shadow p-4 relative">
              <button
                onClick={() => setShowLabelsDropdown(!showLabelsDropdown)}
                className="w-full flex items-center justify-between p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <span>Labels</span>
                <ChevronDown className={`w-4 h-4 transform transition-transform ${showLabelsDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showLabelsDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10">
                  {availableLabels.map((label, index) => (
                    <button
                      key={index}
                      onClick={() => addLabelToOutput(label)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Output Annotations */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium mb-3">Output Annotations</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {outputAnnotations.map((annotation, index) => (
                  <div key={annotation.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{annotation.label}</div>
                      <div className="text-xs text-gray-500">
                        {annotation.splitName} • {annotation.timestamp}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {/* Status indicators with proper functionality */}
                      <div className="flex items-center space-x-1 mr-2">
                        <div className={`w-3 h-3 rounded-full ${annotation.status === 'up' ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div className={`w-3 h-3 rounded-full ${annotation.status === 'down' ? 'bg-red-500' : 'bg-gray-300'}`} />
                      </div>
                      
                      {/* Toggle status buttons */}
                      <button
                        onClick={() => toggleAnnotationStatus(annotation.id)}
                        className={`p-1 rounded ${annotation.status === 'up' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-green-50 hover:text-green-600'}`}
                        title="Set to Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleAnnotationStatus(annotation.id)}
                        className={`p-1 rounded ${annotation.status === 'down' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:bg-red-50 hover:text-red-600'}`}
                        title="Set to Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {/* Move controls */}
                      <button
                        onClick={() => moveAnnotation(annotation.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up in list"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveAnnotation(annotation.id, 'down')}
                        disabled={index === outputAnnotations.length - 1}
                        className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down in list"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {/* Remove */}
                      <button
                        onClick={() => removeAnnotation(annotation.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete annotation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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