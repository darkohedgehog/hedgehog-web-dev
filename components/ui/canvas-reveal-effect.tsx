"use client";

import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** ---------- Strong tuple types ---------- */

type Axis = "x" | "y";
type RGB = readonly [number, number, number];
type Vec2 = readonly [number, number];
type Vec3 = readonly [number, number, number];

// Tačno 10 vrednosti (shader uniform float u_opacities[10])
type Opacities10 = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

/** ---------- Uniform typing ---------- */

type UniformDefinition =
  | { type: "uniform1f"; value: number }
  | { type: "uniform2f"; value: Vec2 }
  | { type: "uniform3f"; value: Vec3 }
  | { type: "uniform1fv"; value: Opacities10 }
  | { type: "uniform3fv"; value: ReadonlyArray<Vec3> };

type UniformDefinitions = Record<string, UniformDefinition>;

/** ---------- Props ---------- */

type CanvasRevealEffectProps = {
  animationSpeed?: number;
  opacities?: Opacities10;
  colors?: RGB[];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
};

type DotMatrixProps = {
  colors?: RGB[];
  opacities?: Opacities10;
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: Axis[];
};

type ShaderProps = {
  source: string;
  uniforms: UniformDefinitions;
  maxFps?: number;
};

type ShaderPlaneProps = ShaderProps;

/** ---------- Defaults (typed) ---------- */

const DEFAULT_OPACITIES: Opacities10 = [
  0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1,
] as const;

const DEFAULT_DOT_OPACITIES: Opacities10 = [
  0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14,
] as const;

/** ---------- Public component ---------- */

export function CanvasRevealEffect({
  animationSpeed = 0.4,
  opacities = DEFAULT_OPACITIES,
  colors = [
    [0, 100, 0], // Tamno zelena
    [128, 0, 128], // Ljubičasta
    [0, 0, 255], // Plava
  ],
  containerClassName,
  dotSize,
  showGradient = true,
}: CanvasRevealEffectProps) {
  return (
    <div className={cn("h-full relative bg-white w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors}
          dotSize={dotSize ?? 3}
          opacities={opacities}
          shader={`
            float animation_speed_factor = ${animationSpeed.toFixed(1)};
            float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
            opacity *= step(intro_offset, u_time * animation_speed_factor);
            opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
          `}
          center={["x", "y"]}
        />
      </div>

      {showGradient && (
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 to-84%" />
      )}
    </div>
  );
}

/** ---------- DotMatrix ---------- */

function DotMatrix({
  colors = [[0, 0, 0]],
  opacities = DEFAULT_DOT_OPACITIES,
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}: DotMatrixProps) {
  const uniforms = useMemo<UniformDefinitions>(() => {
    // Shader očekuje u_colors[6]
    let colorsArray: RGB[] = [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]];

    if (colors.length === 2) {
      colorsArray = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]];
    } else if (colors.length >= 3) {
      colorsArray = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]];
    }

    const normalized: ReadonlyArray<Vec3> = colorsArray.map((c) => [
      c[0] / 255,
      c[1] / 255,
      c[2] / 255,
    ]);

    return {
      u_colors: { value: normalized, type: "uniform3fv" },
      u_opacities: { value: opacities, type: "uniform1fv" },
      u_total_size: { value: totalSize, type: "uniform1f" },
      u_dot_size: { value: dotSize, type: "uniform1f" },
    };
  }, [colors, opacities, totalSize, dotSize]);

  const centerX = center.includes("x");
  const centerY = center.includes("y");

  return (
    <Shader
      source={`
        precision mediump float;

        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;

        float random(vec2 xy) {
          return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }

        void main() {
          vec2 st = fragCoord.xy;

          ${centerX ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ""}
          ${centerY ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ""}

          float opacity = step(0.0, st.x);
          opacity *= step(0.0, st.y);

          vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

          float frequency = 5.0;
          float show_offset = random(st2);

          float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);

          opacity *= u_opacities[int(rand * 10.0)];
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

          vec3 color = u_colors[int(show_offset * 6.0)];

          ${shader}

          fragColor = vec4(color, opacity);
          fragColor.rgb *= fragColor.a;
        }
      `}
      uniforms={uniforms}
      maxFps={60}
    />
  );
}

/** ---------- Shader plane (R3F) ---------- */

function ShaderPlane({ source, uniforms, maxFps = 60 }: ShaderPlaneProps) {
  const { size } = useThree();

  const lastFrameTimeRef = useRef<number>(0);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const preparedUniforms = useMemo<Record<string, THREE.IUniform>>(() => {
    const out: Record<string, THREE.IUniform> = {};

    for (const uniformName of Object.keys(uniforms)) {
      const uniform = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          out[uniformName] = { value: uniform.value };
          break;

        case "uniform2f": {
          const [x, y] = uniform.value;
          out[uniformName] = { value: new THREE.Vector2(x, y) };
          break;
        }

        case "uniform3f": {
          const [x, y, z] = uniform.value;
          out[uniformName] = { value: new THREE.Vector3(x, y, z) };
          break;
        }

        case "uniform1fv":
          out[uniformName] = { value: [...uniform.value] };
          break;

        case "uniform3fv":
          out[uniformName] = {
            value: uniform.value.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
          };
          break;

        default: {
          const _exhaustive: never = uniform;
          return _exhaustive;
        }
      }
    }

    // internal uniforms
    out.u_time = { value: 0 };
    out.u_resolution = { value: new THREE.Vector2(size.width * 2, size.height * 2) };

    return out;
  }, [uniforms, size.width, size.height]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const last = lastFrameTimeRef.current;

    if (t - last < 1 / maxFps) return;
    lastFrameTimeRef.current = t;

    const m = materialRef.current;
    if (!m) return;

    const uTime = m.uniforms.u_time as THREE.IUniform<number> | undefined;
    if (uTime) uTime.value = t;

    const uRes = m.uniforms.u_resolution as THREE.IUniform<THREE.Vector2> | undefined;
    if (uRes) uRes.value.set(size.width * 2, size.height * 2);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        args={[
          {
            vertexShader: `
              precision mediump float;

              uniform vec2 u_resolution;
              out vec2 fragCoord;

              void main() {
                gl_Position = vec4(position.xy, 0.0, 1.0);

                fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
                fragCoord.y = u_resolution.y - fragCoord.y;
              }
            `,
            fragmentShader: source,
            uniforms: preparedUniforms,
            glslVersion: THREE.GLSL3,
            blending: THREE.CustomBlending,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneFactor,
            transparent: true,
            depthWrite: false,
            depthTest: false,
          },
        ]}
        attach="material"
      />
    </mesh>
  );
}

/** ---------- Shader wrapper ---------- */

function Shader({ source, uniforms, maxFps = 60 }: ShaderProps) {
  return (
    <Canvas className="absolute inset-0 h-full w-full" dpr={[1, 2]} gl={{ antialias: true }}>
      <ShaderPlane source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
}