import { edition } from "../edition";
import { render, roadCenter } from "./renderer";

export function mountDrive() {
  const dialog = document.querySelector<HTMLDialogElement>("#drive")!;
  const canvas = document.querySelector<HTMLCanvasElement>("#road")!;
  const ctx = canvas.getContext("2d")!;
  const pause = document.querySelector<HTMLButtonElement>("#pause")!;
  const meters = document.querySelector<HTMLOutputElement>("#meters")!;
  const result = document.querySelector<HTMLElement>("#result")!;
  const keys = new Set<string>();
  let distance = 0, car = 550, elapsed = 0, last = 0, frame = 0, running = false;

  function stop() {
    cancelAnimationFrame(frame);
    running = false;
    keys.clear();
    pause.textContent = "Resume";
  }
  function step(now: number) {
    const dt = Math.min((now - last) / 1000, .06);
    last = now;
    elapsed += dt;
    car += (Number(keys.has("ArrowRight")) - Number(keys.has("ArrowLeft"))) * 560 * dt;
    car = Math.max(67, Math.min(1033, car));
    const onRoad = Math.abs(car - roadCenter(distance, .72)) < 345;
    distance = Math.min(edition.routeMeters, distance + dt * (onRoad ? 39 : 14));
    render(ctx, distance, car);
    meters.value = Math.floor(distance).toLocaleString("en-US") + " / 1,800 m";
    if (distance === edition.routeMeters) {
      stop();
      result.textContent = "Tidal Keys reached in " + elapsed.toFixed(1) + " seconds.";
      pause.textContent = "Drive again";
      return;
    }
    frame = requestAnimationFrame(step);
  }
  function start() {
    if (distance === edition.routeMeters) { distance = 0; elapsed = 0; car = 550; }
    result.textContent = "";
    running = true;
    pause.textContent = "Pause";
    last = performance.now();
    frame = requestAnimationFrame(step);
  }
  document.querySelectorAll("[data-launch]").forEach(button => button.addEventListener("click", () => {
    dialog.showModal();
    if (!running) start();
  }));
  document.querySelector("#close")!.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", stop);
  pause.addEventListener("click", () => running ? stop() : start());
  document.addEventListener("visibilitychange", () => { if (document.hidden && running) stop(); });
  window.addEventListener("blur", () => { if (running) stop(); });
  window.addEventListener("keydown", e => {
    if (running && ["ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); keys.add(e.key); }
  });
  window.addEventListener("keyup", e => keys.delete(e.key));
  for (const [id, key] of [["left", "ArrowLeft"], ["right", "ArrowRight"]]) {
    const button = document.getElementById(id)!;
    button.addEventListener("pointerdown", e => {
      if (running) { button.setPointerCapture(e.pointerId); keys.add(key); }
    });
    button.addEventListener("lostpointercapture", () => keys.delete(key));
  }
}
