// Canvas Scroll Sequence Animation (Antigravity frames)
const canvas = document.getElementById("timeline-canvas");
if (canvas) {
  const context = canvas.getContext("2d");

  // Set internal resolution of the canvas
  canvas.width = 1920;
  canvas.height = 1080;

  const frameCount = 72;
  const currentFrame = index => (
    `timeline/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
  );

  const images = [];
  const sequence = { frame: 0 };

  // Preload all frames
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  // Draw the first frame as soon as it loads
  images[0].onload = render;

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (images[sequence.frame] && images[sequence.frame].complete) {
      context.drawImage(images[sequence.frame], 0, 0, canvas.width, canvas.height);
    }
  }

  // Bind the sequence frame to ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".journey-container", // Trigger off the entire section
      start: "top 80%",  // Starts when canvas container starts entering viewport
      end: "center center", // Finishes earlier, when center is at center of screen, bringing last frame 1 scroll earlier
      scrub: 1,             
      markers: false
    }
  });

  tl.to(sequence, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "power1.inOut",    // 'weightless' easing effect across the frames
    onUpdate: render
  });

  // Float the container upward physically as requested
  tl.to(".timeline-canvas-wrapper", {
    y: -80,                // Float upward on negative y-axis
    ease: "power1.inOut" 
  }, "<"); // The '<' makes it run at the same time as the frame sequence
}
