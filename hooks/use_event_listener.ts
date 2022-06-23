// This module is browser compatible.

import { DependencyList, useEffect, useMemo } from "react";
import { resolveLazy } from "../util.ts";

export type EventMap<T> = T extends Window ? WindowEventMap
  : T extends WindowEventHandlers ? WindowEventHandlersEventMap
  : T extends Document ? DocumentEventMap
  : T extends HTMLElement ? HTMLElementEventMap
  : T extends SVGElement ? SVGElementEventMap
  : T extends SVGSVGElement ? SVGSVGElementEventMap
  : T extends Element ? ElementEventMap
  : T extends Animation ? AnimationEventMap
  : T extends ServiceWorker ? ServiceWorkerEventMap
  : T extends ServiceWorkerContainer ? ServiceWorkerContainerEventMap
  : T extends ServiceWorkerRegistration ? ServiceWorkerRegistrationEventMap
  : T extends Worker ? WorkerEventMap
  : T extends SharedWorker ? AbstractWorkerEventMap
  : T extends ShadowRoot ? ShadowRootEventMap
  : T extends SourceBuffer ? SourceBufferEventMap
  : T extends SourceBufferList ? SourceBufferListEventMap
  : T extends SpeechSynthesis ? SpeechSynthesisEventMap
  : T extends SpeechSynthesisUtterance ? SpeechSynthesisUtteranceEventMap
  : T extends TextTrack ? TextTrackEventMap
  : T extends TextTrackCue ? TextTrackCueEventMap
  : T extends TextTrackList ? TextTrackListEventMap
  : T extends VisualViewport ? VisualViewportEventMap
  : T extends WebSocket ? WebSocketEventMap
  : T extends XMLHttpRequest ? XMLHttpRequestEventMap
  : T extends XMLHttpRequestEventTarget ? XMLHttpRequestEventTargetEventMap
  : T extends AbortSignal ? AbortSignalEventMap
  : never;

export type Params<
  Target extends EventTarget,
  Ev extends keyof EventMap<Target> = keyof EventMap<Target>,
> = {
  /** The target to add event listener. */
  target: Target | null | undefined | (() => Target | null | undefined);

  /** The callback event. */
  callback: (ev: EventMap<Target>[Ev]) => void;

  /** Event type. */
  event: Ev;

  /** Event listener options.
   * This applies internally to both `addEventListener` and `removeEventListener`.
   */
  options?: boolean | AddEventListenerOptions;
};

/** Hook to register event listeners. Automatically removes event listeners when
 * unmounting and whenever `deps` is changed.
 * @param params useEventListener parameters.
 * @param deps If present, effect will only activate if the values in the list change.
 * @remark The event types is automatically deduced from `target` and `event`.
 * ```tsx
 * import { useEventListener } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * export default () => {
 *   useEventListener({
 *     target: () => document,
 *     event: "keydown",
 *     callback: (ev) => {
 *       // console.log(ev.code)
 *     },
 *     options: {
 *       passive: true,
 *     },
 *   }, []);
 * };
 * ```
 */
export default function useEventListener<
  Target extends EventTarget,
  Ev extends keyof EventMap<Target> = keyof EventMap<Target>,
>(
  { target: _target, event: _event, callback, options }: Readonly<
    Params<Target, Ev>
  >,
  deps?: DependencyList,
): void {
  const event = useMemo<string>(() => String(_event), [_event]);
  useEffect(() => {
    const target = resolveLazy(_target);
    if (!target) return;

    type Callback = Parameters<typeof target["addEventListener"]>[1];

    target.addEventListener(event, callback as Callback, options);

    return () => {
      target.removeEventListener(
        event,
        callback as Callback,
        options,
      );
    };
  }, deps);
}
