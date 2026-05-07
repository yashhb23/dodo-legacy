import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { historyMilestones } from '../../data/historyMilestones.ts';

/**
 * ScrambleText — "data decoding" kinetic typography effect.
 * On every `text` change the string visually decrypts character-by-character
 * from random glyphs into the real title, evoking a classified-document reveal.
 * Runs entirely on a 20ms setInterval — no external motion libraries needed.
 */
const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  useEffect(() => {
    let iterations = 0;
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iterations) return text[index];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('')
      );
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1;
    }, 20);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayText}</span>;
};

/**
 * HistoryStack — Cinematic 3D Timeline (Next-Gen Interactive build).
 *
 * Layout      : split-pane WebGL (left) + data HUD (right).
 * Lighting    : two organic plasma orbs (red + indigo) instead of a rigid
 *               background colour, so the section blends into the global page.
 * Interaction :
 *   • Spotlight Reveal — a radial mask on the Quadricolour overlay reveals
 *     the Mauritian flag colours only beneath the cursor, like a flashlight.
 *   • Micro-Parallax  — the Rive stack tilts up to ±5° toward the cursor on
 *     a 1000px perspective, so the artifact feels physical.
 *   • Spring-back     — `mouseleave` recentres both the spotlight and tilt.
 *
 * Performance contract (important):
 *   We DO NOT drive mouse position through React state. Re-rendering the
 *   tree on every mousemove would trash the Rive WASM canvas and burn CPU.
 *   Instead, the pointer position lives in a ref, and a single
 *   requestAnimationFrame mutates the wrapper transform + overlay
 *   maskImage directly. Zero React re-renders per mousemove.
 *
 * Active milestone is still resolved by the existing 10fps rAF poller that
 * reads Rive State Machine inputs — completely independent loop.
 */
export const HistoryStack = () => {
  const [activeMilestone, setActiveMilestone] = useState(null);

  // DOM refs for direct, render-free mutation under rAF.
  const sceneRef = useRef(null);         // mouse-tracking surface (left pane)
  const riveWrapperRef = useRef(null);   // carries perspective + tilt + scale
  const overlayRef = useRef(null);       // Quadricolour overlay carrying mask
  const tooltipRef = useRef(null);             // anchored image tooltip (CSS-positioned)
  const pointerRef = useRef({ x: 50, y: 50 }); // percentages, default centre
  const rafRef = useRef(null);

  const { rive, RiveComponent } = useRive({
    src: '/assets/rive/history_stack.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    // Fit.Cover scales the artwork to fully fill the canvas while preserving
    // aspect ratio — visually enlarges the card stack without resorting to
    // CSS scale() (which would re-rasterise and reintroduce blur).
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    onLoad: () => console.log('RIVE FIRE: Successfully loaded!'),
    onLoadError: (e) => console.error('RIVE FATAL ERROR:', e)
  });

  /* -------- Rive State Machine polling (unchanged) -------- */
  useEffect(() => {
    if (!rive) return;

    const smName = rive.stateMachineNames.includes('State Machine 1')
      ? 'State Machine 1'
      : rive.stateMachineNames[0];

    if (!smName) {
      console.error('No State Machine found in this Rive file!');
      return;
    }

    try {
      const inputs = historyMilestones.map((m) => ({
        milestone: m,
        input: rive.stateMachineInputs(smName)?.find((i) => i.name === m.riveInput)
      }));

      let lastTime = 0;
      let animationFrameId;

      // Poll at 10fps to keep mobile CPU/battery cost negligible.
      // When cursor leaves a card and no input is active, immediately
      // null out the milestone so the tooltip retracts into the stack.
      const checkHoverState = (time) => {
        if (time - lastTime > 100) {
          const activeInput = inputs.find((item) => item?.input?.value === true);
          if (activeInput) {
            if (activeInput.milestone.id !== activeMilestone?.id) {
              setActiveMilestone(activeInput.milestone);
            }
          } else if (activeMilestone !== null) {
            setActiveMilestone(null);
          }
          lastTime = time;
        }
        animationFrameId = requestAnimationFrame(checkHoverState);
      };

      checkHoverState(performance.now());
      return () => cancelAnimationFrame(animationFrameId);
    } catch (err) {
      console.warn('State Machine mapping failed.', err);
    }
    // activeMilestone is intentionally omitted: re-binding inputs on every
    // milestone change would tear down the rAF loop mid-poll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive]);

  /* -------- Pointer-driven parallax + spotlight (rAF batched) -------- */

  // Single rAF tick: read pointerRef and mutate DOM — never schedules React.
  const paintFrame = useCallback(() => {
    rafRef.current = null;
    const { x, y } = pointerRef.current;

    // Map cursor offset (0..100%) → tilt range (-5°..+5°).
    // rotateY follows horizontal cursor, rotateX follows vertical.
    const tiltX = ((x - 50) / 50) * 5;
    const tiltY = ((y - 50) / 50) * 5;

    if (riveWrapperRef.current) {
      // No CSS scale(): we now grow the *layout* size of the container
      // (md:w-3/4 + md:h-[900px]) so Rive renders at native pixel
      // resolution. CSS scale upsamples a rasterised canvas → blur.
      riveWrapperRef.current.style.transform =
        `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) ` +
        'translateX(-10%)';
    }

    if (overlayRef.current) {
      const mask = `radial-gradient(circle 350px at ${x}% ${y}%, black 0%, transparent 100%)`;
      overlayRef.current.style.maskImage = mask;
      overlayRef.current.style.WebkitMaskImage = mask;
    }

    // Tooltip is now CSS-anchored (top-center of the scene container).
    // No per-frame position updates needed.
  }, []);

  const scheduleFrame = useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(paintFrame);
    }
  }, [paintFrame]);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = sceneRef.current?.getBoundingClientRect();
      if (!rect) return;
      pointerRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      };
      scheduleFrame();
    },
    [scheduleFrame]
  );

  const handleMouseLeave = useCallback(() => {
    pointerRef.current = { x: 50, y: 50 };
    scheduleFrame();
  }, [scheduleFrame]);

  // Cancel any pending frame on unmount to avoid orphan paints.
  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="flex flex-col md:flex-row items-center w-full min-h-[800px] bg-transparent relative"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
      }}
    >
      {/* BASEMENT — Ambient Mesh light layer.
          Isolated in its own overflow-hidden container so the massive
          off-screen orbs never expand the page or clip with hard edges.
          z-0 sits below everything. mix-blend-screen adds the light
          without overwriting the dark page background. */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[800px] h-[800px] bg-red-900/15 rounded-[100%] blur-[120px] animate-pulse mix-blend-screen" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[800px] h-[800px] bg-indigo-900/15 rounded-[100%] blur-[120px] mix-blend-screen animate-[pulse_4s_ease-in-out_infinite]" />
      </div>

      {/* LEFT — WebGL Scene (mouse-tracking surface) */}
      <div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full md:w-[70%] h-[700px] md:h-[1000px] relative z-10"
        style={{
          // Kill the visible rectangular stage with a *4-edge* feather built
          // from two crossed linear gradients composited together. A single
          // radial-gradient leaves visible flat sides on a 3:4 rectangle —
          // the intersect of two perpendicular linear masks dissolves every
          // edge identically, regardless of aspect ratio.
          maskImage:
            'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in'
        }}
      >
        {/* Tilting wrapper — every visual layer of the scene lives inside it
            so they tilt together as a single 3D plane. Critically, the
            wrapper carries an opaque page-matched backdrop (first child
            below) so the canvas's screen blend has something opaque to
            blend against — that's what makes the "dark square" boundary
            mathematically vanish, since the backdrop colour matches the
            page on both sides of the rectangle's edge. */}
        <div
          ref={riveWrapperRef}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(-10%)',
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Page-matched backdrop. Identical colour to LandingPage's
              `bg-background`, so the wrapper rectangle is invisible
              against the page. The 4-edge mask above feathers the very
              edges as defence-in-depth in case the theme token shifts. */}
          <div className="absolute inset-0 bg-background" />

          {/* Rive canvas. mix-blend-mode: screen now blends against the
              opaque backdrop + orbs combined, so:
                • black artboard pixels  → backdrop colour (invisible)
                • coloured card pixels   → lit additively over orbs
              Saturation pushed up to keep colours punchy after screen. */}
          <RiveComponent
            style={{
              width: '100%',
              height: '100%',
              mixBlendMode: 'screen',
              filter: 'saturate(0.9) brightness(1.25) contrast(1.05)'
            }}
          />

          {/* Quadricolour spotlight overlay — site-aligned palette.
              DODO BIRD theme dominates: red top, blue bottom, with
              compressed yellow + green slivers preserving the flag's
              cultural completeness. Tracks cursor via radial mask. */}
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none mix-blend-color opacity-90 z-10"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, #ef4444 0%, #ef4444 35%, #3b82f6 50%, #3b82f6 80%, #eab308 90%, #22c55e 100%)',
              maskImage:
                'radial-gradient(circle 350px at 50% 50%, black 0%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(circle 350px at 50% 50%, black 0%, transparent 100%)'
            }}
          />
        </div>

        {/* Depth of Field — cinematic tilt-shift blur that softens the top
            and bottom fringes of the 3D scene, funnelling the viewer's focus
            into the centre interaction zone where the cards live. Sits above
            the canvas (z-20) but below the tooltip (z-50). */}
        <div
          className="absolute inset-0 pointer-events-none z-20 backdrop-blur-md"
          style={{
            maskImage:
              'linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)'
          }}
        />

        {/* ANCHORED EXTRACTION TOOLTIP — locked dead-centre at the top of
            the canvas container. No mouse tracking; position is pure CSS.
            The inner images still spring from scale-[0.2] + translate-y-[100px]
            up to their resting position, creating the "rise from the stack"
            effect without any chaotic cursor-chasing. */}
        <div
          ref={tooltipRef}
          className={`absolute top-2 md:top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-72 md:w-[24rem] h-52 md:h-[16rem] transition-opacity duration-300 ease-out ${
            activeMilestone ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {historyMilestones.map((milestone) => (
            <img
              key={milestone.id}
              src={milestone.image}
              alt={milestone.title}
              loading="eager"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-contain will-change-transform will-change-opacity transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                activeMilestone?.id === milestone.id
                  ? 'opacity-100 scale-100 translate-y-0 rotate-0 shadow-2xl'
                  : 'opacity-0 scale-[0.2] translate-y-[100px] rotate-3 pointer-events-none'
              }`}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT — Text-only HUD.
          Image is now a floating tooltip over the canvas (see above).
          This panel only carries Title, Year watermark, and Description. */}
      <div className="w-full md:w-1/3 h-full flex flex-col justify-center gap-6 p-8 md:p-12 z-30 relative bg-gradient-to-l from-[#0a050a] via-[#0a050a]/80 to-transparent">
        {activeMilestone && (
          <div
            key={activeMilestone.id}
            className="animate-in fade-in zoom-in-[0.98] duration-300 fill-mode-both relative"
          >
            <div className="text-[10rem] md:text-[14rem] font-serif font-black absolute top-4 right-8 pointer-events-none text-zinc-400/20 mix-blend-plus-lighter leading-none">
              {activeMilestone.date.split('-')[0]}
            </div>

            <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-4 drop-shadow-lg">
              <ScrambleText text={activeMilestone.title} />
            </h2>

            <p className="text-lg font-light leading-relaxed md:leading-loose text-zinc-300/90">
              {activeMilestone.description}
            </p>
          </div>
        )}

        {/* Progression Scrubber — vertical track with glowing dot.
            Dot position maps milestone ID (1-10) linearly down the track.
            The 15px white box-shadow gives it a neon "active waypoint" look. */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2/3 w-1 bg-white/5 rounded-full">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-700 ease-out"
            style={{ top: `${activeMilestone ? ((activeMilestone.id - 1) / 9) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryStack;
