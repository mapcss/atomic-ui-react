// This module is browser compatible.

import { DependencyList, useEffect } from "react";
import { Lazyable, lazyEval } from "../util.ts";
import { isString } from "../deps.ts";
import { Useable } from "./types.ts";

export type TargetLike<
  T extends EventTarget,
> = Lazyable<T | undefined | null>;

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

export type Param<
  Target extends EventTarget,
  E extends keyof EventMap<Target> = keyof EventMap<Target>,
> = {
  target: TargetLike<Target>;
  callback: (ev: EventMap<Target>[E]) => void;
  event: E | E[];
};

export type Option = {
  listenerOption: boolean | AddEventListenerOptions | undefined;
} & Useable;

export default function useEventListener<
  Target extends EventTarget,
  E extends keyof EventMap<Target> = keyof EventMap<Target>,
>(
  { target: _target, event: _event, callback }: Readonly<Param<Target, E>>,
  { listenerOption, use = true }: Readonly<Partial<Option>> = {},
  deps?: DependencyList,
): void {
  useEffect(() => {
    if (!use) return;

    const target = lazyEval(_target) as Target;
    if (!target) return;

    const events = isString(_event)
      ? [_event]
      : Array.isArray(_event)
      ? _event
      : [_event];
    events.forEach((event) => {
      target.addEventListener(String(event), callback as never, listenerOption);
    });

    return () => {
      events.forEach((event) => {
        target.removeEventListener(
          String(event),
          callback as never,
          listenerOption,
        );
      });
    };
  }, deps);
}
