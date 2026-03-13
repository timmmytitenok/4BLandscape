"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import styles from "./CircularGallery.module.css";

const TITLE_VERTEX_SHADER = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TITLE_FRAGMENT_SHADER = `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(tMap, vUv);
    if (color.a < 0.02) discard;
    gl_FragColor = vec4(color.rgb, color.a * uOpacity);
  }
`;

function debounce(func, wait) {
  let timeout;
  return function debounced(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function wrapText(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width <= maxWidth) {
      line = testLine;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function createTitleTexture(gl, title, textColor = "#ffffff") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 1200;
  canvas.height = 230;

  const isLongDeliveryTitle = title.trim() == "Gravel/Mulch Deliveries";
  context.font = isLongDeliveryTitle ? "800 86px sans-serif" : "800 108px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = textColor;
  context.strokeStyle = "rgba(0,0,0,0.75)";
  context.lineWidth = 8;

  const lines = isLongDeliveryTitle
    ? [title]
    : wrapText(context, title, canvas.width - 90);
  const lineHeight = isLongDeliveryTitle ? 74 : 84;
  const titleStartY = isLongDeliveryTitle ? 106 : lines.length === 2 ? 44 : 102;
  const titleCenterX = isLongDeliveryTitle ? canvas.width / 2 + 14 : canvas.width / 2;
  lines.forEach((line, index) => {
    const y = titleStartY + index * lineHeight;
    context.strokeText(line, titleCenterX, y);
    context.fillText(line, titleCenterX, y);
  });
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createImageShader();
    this.createImageMesh();
    this.createTitleMesh();
    this.onResize();
  }

  createImageShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.imageProgram = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          float subtleSpeed = min(abs(uSpeed), 1.0);
          float waveAmount = 0.05 + subtleSpeed * 0.06;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * waveAmount;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uOpacity;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          gl_FragColor = vec4(color.rgb, alpha * uOpacity);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uOpacity: { value: 1 },
      },
      transparent: true,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.imageProgram.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createImageMesh() {
    this.imagePlane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.imageProgram,
    });
    this.imagePlane.setParent(this.scene);
  }

  createTitleMesh() {
    const { texture, width, height } = createTitleTexture(this.gl, this.text, this.textColor);
    const program = new Program(this.gl, {
      vertex: TITLE_VERTEX_SHADER,
      fragment: TITLE_FRAGMENT_SHADER,
      uniforms: { tMap: { value: texture }, uOpacity: { value: 1 } },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.titlePlane = new Mesh(this.gl, {
      geometry: this.geometry,
      program,
    });
    this.titlePlane.setParent(this.scene);
    this.titleAspect = width / height;
  }

  update(scroll, direction) {
    this.imagePlane.position.x = this.x - scroll.current - this.extra;

    const x = this.imagePlane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.imagePlane.position.y = 0;
      this.imagePlane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);

      if (this.bend > 0) {
        this.imagePlane.position.y = -arc;
        this.imagePlane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.imagePlane.position.y = arc;
        this.imagePlane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.titlePlane.position.x = this.imagePlane.position.x;
    this.titlePlane.position.y = this.imagePlane.position.y - this.imagePlane.scale.y * 0.61;
    this.titlePlane.position.z = this.imagePlane.position.z + 0.02;
    this.titlePlane.rotation.z = this.imagePlane.rotation.z;

    this.speed = scroll.current - scroll.last;
    this.imageProgram.uniforms.uTime.value += 0.02;
    this.imageProgram.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.imagePlane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.imagePlane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.imagePlane.position.x - planeOffset > viewportOffset;

    const isMobile = this.screen && this.screen.width < 640;
    let opacity = 1;
    if (isMobile) {
      const isFullyOffScreen = this.isBefore || this.isAfter;
      if (isFullyOffScreen) {
        opacity = 0;
      } else {
        const fadeZone = planeOffset * 1.4;
        const rightEdge = this.imagePlane.position.x + planeOffset;
        const leftEdge = this.imagePlane.position.x - planeOffset;
        const fadeOutLeft = Math.max(0, (rightEdge + viewportOffset) / fadeZone);
        const fadeOutRight = Math.max(0, (viewportOffset - leftEdge) / fadeZone);
        opacity = Math.min(1, Math.min(fadeOutLeft, fadeOutRight));
      }
    }
    this.imageProgram.uniforms.uOpacity.value = opacity;
    if (this.titlePlane && this.titlePlane.program && this.titlePlane.program.uniforms.uOpacity) {
      this.titlePlane.program.uniforms.uOpacity.value = isMobile ? 0 : opacity;
    }
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    this.scale = this.screen.height / 1500;
    const mobileScale = this.screen.width < 640 ? 1.68 : 1;
    this.imagePlane.scale.y = ((this.viewport.height * (900 * this.scale)) / this.screen.height) * mobileScale;
    this.imagePlane.scale.x = ((this.viewport.width * (700 * this.scale)) / this.screen.width) * mobileScale;
    this.imagePlane.program.uniforms.uPlaneSizes.value = [this.imagePlane.scale.x, this.imagePlane.scale.y];
    this.titlePlane.scale.x = this.imagePlane.scale.x * 1.08;
    this.titlePlane.scale.y = this.titlePlane.scale.x / this.titleAspect;
    this.padding = 2;
    this.width = this.imagePlane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = "#ffffff",
      borderRadius = 0,
      font = "bold 30px sans-serif",
      scrollSpeed = 2,
      scrollEase = 0.05,
      onCurrentItemChange,
    } = {}
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.onCurrentItemChange = onCurrentItemChange;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaultItems = [
      { image: "https://picsum.photos/seed/1/800/600?grayscale", text: "Service" },
      { image: "https://picsum.photos/seed/2/800/600?grayscale", text: "Service" },
      { image: "https://picsum.photos/seed/3/800/600?grayscale", text: "Service" },
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
  }

  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  nudge(direction = 1) {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    this.scroll.target += direction * width * 0.9;
    this.onCheckDebounce();
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    if (this.onCurrentItemChange && this.medias && this.medias[0]) {
      const width = this.medias[0].width;
      const itemIndex = Math.round(Math.abs(this.scroll.current) / width);
      const baseLength = this.mediasImages.length / 2;
      const index = itemIndex % baseLength;
      const item = this.mediasImages[index];
      if (item && this._lastItemIndex !== index) {
        this._lastItemIndex = index;
        this.onCurrentItemChange({ index, item });
      }
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);

    window.addEventListener("resize", this.boundOnResize);
    this.container.addEventListener("mousedown", this.boundOnTouchDown);
    this.container.addEventListener("touchstart", this.boundOnTouchDown, { passive: true });
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchmove", this.boundOnTouchMove, { passive: true });
    window.addEventListener("touchend", this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    this.container.removeEventListener("mousedown", this.boundOnTouchDown);
    this.container.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);

    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

const CircularGallery = forwardRef(function CircularGallery(
  {
    items,
    bend = 1,
    textColor = "#ffffff",
    borderRadius = 0.05,
    font = "bold 30px sans-serif",
    scrollSpeed = 2,
    scrollEase = 0.05,
    onCurrentItemChange,
  },
  ref
) {
  const containerRef = useRef(null);
  const appRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      nudgeLeft: () => appRef.current?.nudge(-1),
      nudgeRight: () => appRef.current?.nudge(1),
    }),
    []
  );

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const app = new App(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
      onCurrentItemChange,
    });
    appRef.current = app;
    return () => {
      app.destroy();
      appRef.current = null;
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, onCurrentItemChange]);

  return <div className={styles.circularGallery} ref={containerRef} />;
});

export default CircularGallery;
