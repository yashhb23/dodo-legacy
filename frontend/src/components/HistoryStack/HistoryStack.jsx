import React, { useState, useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';
import { historyMilestones } from '../../data/historyMilestones.ts';

/**
 * HistoryStack — Cinematic WebGL + HUD Split Architecture.
 *
 * Left pane  : oversized Rive 3D stack with the Mauritian Quadricolour
 *              mix-blend-color overlay (the "Art").
 * Right pane : data HUD that fades into the canvas via a solid gradient
 *              (no backdrop-blur — keeps GPU/ROM cost flat on mobile).
 *
 * The active milestone is detected by polling the Rive State Machine
 * inputs at ~10fps via requestAnimationFrame. The last active card is
 * intentionally retained when the user lifts their finger so that mobile
 * users always see context.
 */
export const HistoryStack = () => {
  const [activeMilestone, setActiveMilestone] = useState(null);

  const { rive, RiveComponent } = useRive({
    src: '/assets/rive/history_stack.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    onLoad: () => console.log('RIVE FIRE: Successfully loaded!'),
    onLoadError: (e) => console.error('RIVE FATAL ERROR:', e)
  });

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
      // Persist the last active milestone when nothing is hovered so the
      // HUD never blanks out mid-interaction.
      const checkHoverState = (time) => {
        if (time - lastTime > 100) {
          const activeInput = inputs.find((item) => item?.input?.value === true);
          if (activeInput && activeInput.milestone.id !== activeMilestone?.id) {
            setActiveMilestone(activeInput.milestone);
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

  return (
    <div
      className="flex flex-col md:flex-row items-center w-full min-h-[800px] bg-[#0a050a] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#0a050a] to-red-950/20 overflow-hidden relative"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)'
      }}
    >
      {/* Basalt Frame — soft Red glow (top-left) */}
      <div
        className="absolute top-0 left-0 w-[800px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(153, 27, 27, 0.15) 0%, transparent 60%)',
          filter: 'blur(80px)'
        }}
      />

      {/* Basalt Frame — soft Indigo glow (bottom-right) */}
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(49, 46, 129, 0.15) 0%, transparent 60%)',
          filter: 'blur(80px)'
        }}
      />

      {/* LEFT — WebGL Canvas */}
      <div className="w-full md:w-2/3 h-[500px] md:h-[800px] relative z-0">
        <RiveComponent
          style={{
            width: '100%',
            height: '100%',
            mixBlendMode: 'plus-lighter',
            filter: 'saturate(0.6) brightness(1.1) contrast(1.1)',
            transform: 'scale(1.4) translateX(-10%)'
          }}
        />

        {/* Quadricolour blend overlay — strict top→bottom Mauritian flag stripes
            (Red / Blue / Yellow / Green). Inline style is required: Tailwind's
            gradient utilities can only express ONE `via-*` stop, which silently
            drops one of the four flag colours. Hard 0/33/66/100% percentages
            mirror the flag's equal-band layout. */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color opacity-90 z-10"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, #dc2626 0%, #2563eb 33%, #facc15 66%, #16a34a 100%)'
          }}
        />
      </div>

      {/* RIGHT — Cinematic HUD (data panel).
          Gradient fades up (mobile) / left (desktop) into the canvas
          without backdrop-blur, so we stay GPU-cheap and avoid Safari/
          mobile blur jank. Stops use the atmospheric #0a050a void colour
          so the panel dissolves seamlessly into the parent gradient. */}
      <div className="w-full md:w-1/3 h-full flex flex-col justify-center gap-6 p-8 md:p-12 z-20 relative bg-gradient-to-t from-[#0a050a] via-[#0a050a]/90 to-transparent md:bg-gradient-to-l md:from-[#0a050a] md:via-[#0a050a]/90 md:to-transparent">
        {activeMilestone && (
          <div
            key={activeMilestone.id}
            className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both"
          >
            {/* Massive faded year — pure decorative backdrop */}
            <div className="text-6xl md:text-8xl font-serif text-zinc-800 absolute top-10 right-10 opacity-30 pointer-events-none">
              {activeMilestone.date.split('-')[0]}
            </div>

            <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-6 drop-shadow-lg">
              {activeMilestone.title}
            </h2>

            <p className="text-lg font-light leading-relaxed md:leading-loose text-zinc-300/90">
              {activeMilestone.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryStack;
