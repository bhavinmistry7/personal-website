'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

export type LiquidPreset = 'prism' | 'lava' | 'plasma' | 'pulse' | 'vortex' | 'mist' | 'custom'

export interface LiquidBackgroundProps {
  /** Named color preset. Use 'custom' + color1/2/3 for your own palette. Default: 'prism' */
  preset?:       LiquidPreset
  /** Hex colors used when preset='custom' */
  color1?:       string
  color2?:       string
  color3?:       string
  /**
   * Animation speed (0.1–2). Default: 0.6
   * For flame preset: controls how fast the noise scrolls upward.
   */
  speed?:        number
  /**
   * Warp intensity (0–3). Default: 1.4
   * For flame preset: controls how wide and dramatic flame tongue deformation is.
   * Higher = more turbulent, wider tongues.
   */
  distortion?:   number
  /** Reserved for future use. Default: 0.6 */
  swirl?:        number
  /** Zoom scale (0.5–2). Default: 1 */
  scale?:        number
  /**
   * Flame height control (0.3–1.5). Default: 0.85
   * For flame preset: how far up the screen flames reach before fading to black.
   * 0.5 = flames fill ~40% of screen height. 1.0 = flames fill ~60%.
   */
  softness?:     number
  /**
   * Heat threshold — pixels below this value are pure black.
   * Lower = more visible flame area; higher = tighter, hotter-only glow.
   */
  threshold?:    number
  /** SVG fractal noise overlay opacity (0–1). Default: 0.045 */
  noiseOpacity?: number
  /** CSS border-radius applied to the wrapper */
  borderRadius?: string
  className?:    string
  style?:        CSSProperties
}

// ── Preset palettes — RGB triplets, normalised 0–1 ───────────────────────────

type RGB = readonly [number, number, number]

const PRESETS: Record<Exclude<LiquidPreset, 'custom'>, readonly [RGB, RGB, RGB]> = {
  prism:  [[0.38, 0.40, 0.95], [0.54, 0.28, 0.96], [0.02, 0.71, 0.84]],
  // Lava color structure (maps to heat field, not palette order):
  //   c1 = deep red   (#4A0000) — low  heat / upper flame / tips
  //   c2 = orange-red (#FF3B00) — mid  heat / mid flame
  //   c3 = warm amber (#FFC247) — high heat / flame base at bottom
  lava:   [[0.290, 0.000, 0.000], [1.000, 0.231, 0.000], [1.000, 0.761, 0.278]],
  plasma: [[0.80, 0.05, 0.72], [0.18, 0.22, 0.92], [0.50, 0.05, 0.88]],
  pulse:  [[0.05, 0.82, 0.52], [0.02, 0.78, 0.78], [0.05, 0.50, 0.38]],
  vortex: [[0.06, 0.03, 0.18], [0.40, 0.12, 0.72], [0.03, 0.06, 0.28]],
  mist:   [[0.80, 0.84, 0.94], [0.58, 0.70, 0.88], [0.92, 0.94, 0.98]],
}

// ── GLSL Shaders ─────────────────────────────────────────────────────────────

const VERT = /* glsl */`
  attribute vec2 a_position;
  varying   vec2 v_uv;
  void main() {
    v_uv        = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// Vertical flame shader — rising lava wall from the bottom of the screen.
//
// Architecture:
//   UV convention: v_uv.y = 0 at bottom of canvas, 1 at top.
//
//   The heat field is built from a vertical gradient (high at y=0, zero at top),
//   then distorted by 3 upward-scrolling noise layers to produce organic
//   flame tongues. No radial blobs.
//
//   Layer 1 (n1) — broad base waves, slowest scroll
//     Low x-frequency → wide flame columns spanning ~30–40% of screen width
//     This layer dominates the overall column shape
//
//   Layer 2 (n2) — medium tongues, medium scroll
//     Feeds off n1 (mild domain warp) for organic flame neck shapes
//
//   Layer 3 (n3) — flame tip filigree, fastest scroll
//     Fine detail; only has visible effect near flame tips (high up)
//     Creates the jagged, irregular pointed tops
//
//   The vertical gradient provides:
//     • Dense, solid hot base at the bottom
//     • Gradual taper into distinct tongues toward the top
//     • Pure black above flame reach
//
//   Vertical motion: all noise layers subtract (t × speed) from their y
//   coordinate — this scrolls the noise pattern upward, making the flame
//   appear to rise continuously.
//
// Adjustable knobs (via props → uniforms):
//   u_speed       flame scroll speed (how fast lava rises)
//   u_distortion  warp strength (wider/wilder tongues vs. tame columns)
//   u_softness    flame height — flameReach = softness × 0.75
//   u_threshold   black cutoff (lower = more visible flame area)
//   u_aspect      corrects noise x-frequency for non-square screens
// ─────────────────────────────────────────────────────────────────────────────
const FRAG = /* glsl */`
  precision mediump float;

  uniform float u_time;
  uniform float u_speed;
  uniform float u_distortion;
  uniform float u_scale;
  uniform float u_softness;
  uniform float u_threshold;
  uniform float u_aspect;    // canvas width / height
  uniform vec3  u_c1;        // deep red   — low  heat (tips)
  uniform vec3  u_c2;        // orange-red — mid  heat
  uniform vec3  u_c3;        // warm amber — high heat (base)

  varying vec2 v_uv;

  // ── Simplex noise (Ashima Arts, public domain) ────────────────────────────
  vec3 _m3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 _m2(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 _pr(vec3 x) { return _m3(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
       0.211324865405187,  0.366025403784439,
      -0.577350269189626,  0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = _m2(i);
    vec3 p = _pr(_pr(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 xg = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(xg) - 0.5;
    vec3 ox = floor(xg + 0.5);
    vec3 a0 = xg - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float t  = u_time * u_speed;
    vec2  uv = v_uv;

    // Zoom centred on canvas centre
    uv = (uv - 0.5) / u_scale + 0.5;

    // ── Three upward-scrolling noise layers ─────────────────────────────────
    //
    // x-frequency scaled by u_aspect so noise features stay physically square
    // on any screen aspect ratio (prevents blob distortion on ultra-wide screens).
    //
    // y-frequency > x-frequency → features are taller than wide (flame-shaped).
    //
    // All layers SUBTRACT from y in the noise lookup:
    //   snoise(uv.y - t × speed) → the noise pattern marches upward over time
    //   → visually reads as flames rising.
    //
    // Domain warp: each layer's x-coordinate is offset by the previous layer's
    // value. This is a single-step domain warp — enough to create organic tongue
    // shapes without full FBM marbling.

    float ax = u_aspect * 0.80;   // aspect-corrected x noise scale

    // Layer 1 — broad base columns, slowest scroll
    float n1 = snoise(vec2(uv.x * ax * 2.2,             uv.y * 3.8  - t * 0.28));

    // Layer 2 — flame neck / tongue detail, feeds off n1
    float n2 = snoise(vec2(uv.x * ax * 4.8 + n1 * 0.35, uv.y * 7.0  - t * 0.46));

    // Layer 3 — fine flame tips, fastest scroll, lowest amplitude
    float n3 = snoise(vec2(uv.x * ax * 9.5 + n2 * 0.28, uv.y * 12.0 - t * 0.70));

    // ── Horizontal warp (u_distortion scales total warp amount) ─────────────
    // n1 dominates — creates the broad column positions.
    // n2, n3 add progressively finer tongue detail.
    // Vertical warp (yWarp) is very small — just enough for subtle "breathing".
    float xWarp = (n1 * 0.110 + n2 * 0.052 + n3 * 0.020) * u_distortion;
    float yWarp =  n1 * 0.022                              * u_distortion;

    vec2 wp = uv + vec2(xWarp, yWarp);

    // ── Base heat — inverted vertical gradient ───────────────────────────────
    // wp.y = 0 (bottom of screen) → maximum heat.
    // wp.y = 1 (top of screen)   → zero heat.
    //
    // flameReach = how far up the screen heat extends before fading to black.
    //   flameReach = u_softness × 0.75
    //   At y = (1 − flameReach): baseHeat = 1.0 (full brightness).
    //   Above that: power-law falloff.
    //
    // pow exponent 1.80: steeper than linear so the dense lava base is
    // solid and bright while the transition to black is crisp.
    float flameReach = u_softness * 0.75;
    float baseHeat   = pow(
      clamp((1.0 - wp.y) / (flameReach + 0.001), 0.0, 1.0),
      1.80
    );

    // ── Noise contribution to heat ───────────────────────────────────────────
    // The combined noise field creates uneven heat "columns" across x —
    // some x positions burn hotter and reach higher than others.
    // n1 dominates the column shape; n2/n3 add tip texture.
    float nf = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;
    nf = nf * 0.5 + 0.5;                     // remap −1..1 → 0..1

    // Tip modulation: near the flame tops (low baseHeat) the noise has full
    // effect, creating jagged, organic tips. At the dense hot base
    // (high baseHeat) the gradient dominates, keeping the base solid.
    float tipW = smoothstep(0.55, 0.0, baseHeat);
    float heat  = mix(baseHeat, baseHeat * nf, tipW * 0.65);

    // ── Heat shimmer — subtle boundary distortion ────────────────────────────
    // A tiny wavering is applied to the heat value near the flame boundary,
    // simulating the visual shimmer of hot gas rising above lava.
    // Only fires near the flame edge (low heat values); base is undisturbed.
    float shimmer = snoise(vec2(uv.x * 6.5, uv.y * 4.0 - t * 1.10)) * 0.030;
    heat += shimmer * smoothstep(0.50, 0.05, heat);

    // ── Black-background mask ────────────────────────────────────────────────
    float mask = smoothstep(u_threshold - 0.05, u_threshold + 0.12, heat);

    // ── Lava color ramp — base hot, tips deep red ────────────────────────────
    //   heat ≈ 0.20–0.35  →  deep red tips / upper flame
    //   heat ≈ 0.35–0.65  →  orange-red mid flame
    //   heat ≈ 0.65–1.00  →  warm amber / orange flame base
    vec3 col = u_c1;
    col = mix(col, u_c2, smoothstep(0.22, 0.58, heat));   // → orange-red
    col = mix(col, u_c3, smoothstep(0.52, 0.86, heat));   // → warm amber

    col *= mask;

    // ── Internal depth variation ─────────────────────────────────────────────
    // Low-frequency noise (wavelength ≈ 50% screen height) creates slow-moving
    // darker channels of deep red within the flame body, giving volumetric depth.
    float depth = snoise(uv * 1.80 + vec2(t * 0.018, t * -0.012)) * 0.5 + 0.5;
    col *= mix(0.70, 1.0, depth);

    // ── Bloom — tight warm glow at the hottest base only ─────────────────────
    float bloom = smoothstep(0.80, 1.0, heat) * mask;
    col = min(col + col * bloom * 0.38, vec3(1.0));

    // ── Soft side vignette ────────────────────────────────────────────────────
    // Darkens only the outer ~18% on each side — keeps the central
    // flame wall bright while preventing hard seams at canvas edges.
    float sideV = 1.0 - smoothstep(0.32, 0.50, abs(uv.x - 0.5));
    col *= sideV;

    gl_FragColor = vec4(col, 1.0);
  }
`

// ── WebGL helpers ─────────────────────────────────────────────────────────────

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s) ?? 'Shader error')
  return s
}

function hexToRGB(hex: string): RGB {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ]
}

type UniformMap = {
  time:       WebGLUniformLocation | null
  speed:      WebGLUniformLocation | null
  distortion: WebGLUniformLocation | null
  swirl:      WebGLUniformLocation | null  // not in shader → null → no-op
  scale:      WebGLUniformLocation | null
  softness:   WebGLUniformLocation | null
  threshold:  WebGLUniformLocation | null
  aspect:     WebGLUniformLocation | null
  c1:         WebGLUniformLocation | null
  c2:         WebGLUniformLocation | null
  c3:         WebGLUniformLocation | null
}

type VisualProps = Required<Pick<
  LiquidBackgroundProps,
  'preset' | 'color1' | 'color2' | 'color3' | 'speed' | 'distortion' | 'swirl' | 'scale' | 'softness' | 'threshold'
>>

function applyUniforms(gl: WebGLRenderingContext, u: UniformMap, p: VisualProps) {
  const [c1, c2, c3] =
    p.preset !== 'custom'
      ? PRESETS[p.preset]
      : [hexToRGB(p.color1), hexToRGB(p.color2), hexToRGB(p.color3)]

  gl.uniform1f(u.speed,      p.speed)
  gl.uniform1f(u.distortion, p.distortion)
  gl.uniform1f(u.swirl,      p.swirl)      // no-op
  gl.uniform1f(u.scale,      p.scale)
  gl.uniform1f(u.softness,   p.softness)
  gl.uniform1f(u.threshold,  p.threshold)
  gl.uniform3fv(u.c1, new Float32Array(c1))
  gl.uniform3fv(u.c2, new Float32Array(c2))
  gl.uniform3fv(u.c3, new Float32Array(c3))
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LiquidBackground({
  preset       = 'prism',
  color1       = '#6366f1',
  color2       = '#8b5cf6',
  color3       = '#06b6d4',
  speed        = 0.6,
  distortion   = 1.4,
  swirl        = 0.6,
  scale        = 1.0,
  softness     = 0.85,
  threshold    = 0,
  noiseOpacity = 0.045,
  borderRadius,
  className,
  style,
}: LiquidBackgroundProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)
  const glRef      = useRef<WebGLRenderingContext | null>(null)
  const uRef       = useRef<UniformMap | null>(null)
  const pausedRef  = useRef(false)
  const startRef   = useRef(0)

  const propsRef = useRef<VisualProps>({ preset, color1, color2, color3, speed, distortion, swirl, scale, softness, threshold })
  propsRef.current = { preset, color1, color2, color3, speed, distortion, swirl, scale, softness, threshold }

  // ── One-time WebGL setup ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = (
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    ) as WebGLRenderingContext | null

    if (!gl) {
      console.warn('LiquidBackground: WebGL not available')
      return
    }
    glRef.current = gl

    let vert: WebGLShader, frag: WebGLShader, prog: WebGLProgram
    try {
      vert = compileShader(gl, gl.VERTEX_SHADER,   VERT)
      frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
      prog = gl.createProgram()!
      gl.attachShader(prog, vert)
      gl.attachShader(prog, frag)
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(prog) ?? 'Link error')
    } catch (e) {
      console.error('LiquidBackground:', e)
      return
    }

    gl.useProgram(prog)

    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1,
    ]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u: UniformMap = {
      time:       gl.getUniformLocation(prog, 'u_time'),
      speed:      gl.getUniformLocation(prog, 'u_speed'),
      distortion: gl.getUniformLocation(prog, 'u_distortion'),
      swirl:      gl.getUniformLocation(prog, 'u_swirl'),    // intentionally null
      scale:      gl.getUniformLocation(prog, 'u_scale'),
      softness:   gl.getUniformLocation(prog, 'u_softness'),
      threshold:  gl.getUniformLocation(prog, 'u_threshold'),
      aspect:     gl.getUniformLocation(prog, 'u_aspect'),
      c1:         gl.getUniformLocation(prog, 'u_c1'),
      c2:         gl.getUniformLocation(prog, 'u_c2'),
      c3:         gl.getUniformLocation(prog, 'u_c3'),
    }
    uRef.current = u

    applyUniforms(gl, u, propsRef.current)

    const setAspect = () =>
      gl!.uniform1f(u.aspect, canvas.width / (canvas.height || 1))

    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.clientWidth
      canvas.height = canvas.clientHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      setAspect()
    })
    ro.observe(canvas)
    canvas.width  = canvas.clientWidth  || 400
    canvas.height = canvas.clientHeight || 400
    gl.viewport(0, 0, canvas.width, canvas.height)
    setAspect()

    const io = new IntersectionObserver(([e]) => { pausedRef.current = !e.isIntersecting })
    io.observe(canvas)

    startRef.current = performance.now()
    function frame() {
      rafRef.current = requestAnimationFrame(frame)
      if (pausedRef.current) return
      const t = (performance.now() - startRef.current) / 1000
      gl!.uniform1f(u.time, t)
      gl!.drawArrays(gl!.TRIANGLES, 0, 6)
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      io.disconnect()
      gl.deleteBuffer(buf)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      gl.deleteProgram(prog)
      glRef.current = null
      uRef.current  = null
    }
  }, [])

  useEffect(() => {
    const gl = glRef.current
    const u  = uRef.current
    if (!gl || !u) return
    applyUniforms(gl, u, { preset, color1, color2, color3, speed, distortion, swirl, scale, softness, threshold })
  }, [preset, color1, color2, color3, speed, distortion, swirl, scale, softness, threshold])

  const noiseSrc = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden', borderRadius, ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      {noiseOpacity > 0 && (
        <div
          aria-hidden="true"
          style={{
            position:        'absolute',
            inset:           0,
            backgroundImage: noiseSrc,
            opacity:         noiseOpacity,
            pointerEvents:   'none',
          }}
        />
      )}
    </div>
  )
}
