(() => {
  // src/edition.ts
  var edition = {
    title: "LEONIDA",
    previewDate: "2026-12-22T00:00:00Z",
    releaseLabel: "22 December 2026",
    routeMeters: 1800
  };

  // src/drive/renderer.ts
  var scenery = new Image();
  scenery.src = "coast.svg";
  function roadCenter(meters, depth) {
    return 550 + 235 * Math.sin(meters / 165 + (1 - depth) * 1.65) * (0.35 + depth * 0.65);
  }
  function render(ctx, meters, car) {
    const horizon = 174;
    ctx.fillStyle = "#bb8493";
    ctx.fillRect(0, 0, 1100, 460);
    if (scenery.naturalWidth) ctx.drawImage(scenery, 0, -28, 1100, 310);
    for (let y = horizon; y < 460; y += 2) {
      const depth = (y - horizon) / (460 - horizon);
      const half = 7 + depth * 490;
      const center = roadCenter(meters, depth);
      const stripe = Math.floor(12 / (depth + 0.016) + meters / 10) % 2 === 0;
      ctx.fillStyle = stripe ? "#354e47" : "#374f49";
      ctx.fillRect(0, y, 1100, 2);
      ctx.fillStyle = stripe ? "#dd9175" : "#e2d7ba";
      ctx.fillRect(center - half - depth * 13, y, half * 2 + depth * 26, 2);
      ctx.fillStyle = "#30373b";
      ctx.fillRect(center - half, y, half * 2, 2);
      if (stripe) {
        ctx.fillStyle = "#f6c48a";
        ctx.fillRect(center, y, 1 + 6 * depth, 2);
      }
    }
    const x = car;
    ctx.fillStyle = "#191d24";
    ctx.fillRect(x - 56, 391, 112, 20);
    ctx.beginPath();
    ctx.moveTo(x - 68, 393);
    ctx.lineTo(x - 58, 358);
    ctx.lineTo(x - 32, 332);
    ctx.lineTo(x + 31, 332);
    ctx.lineTo(x + 58, 358);
    ctx.lineTo(x + 68, 393);
    ctx.closePath();
    ctx.fillStyle = "#d67256";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 39, 355);
    ctx.lineTo(x - 25, 337);
    ctx.lineTo(x + 25, 337);
    ctx.lineTo(x + 39, 355);
    ctx.closePath();
    ctx.fillStyle = "#263a43";
    ctx.fill();
    ctx.fillStyle = "#512f35";
    ctx.fillRect(x - 63, 376, 126, 14);
    ctx.fillStyle = "#ffa18e";
    ctx.fillRect(x - 54, 378, 31, 5);
    ctx.fillRect(x + 23, 378, 31, 5);
    ctx.fillStyle = "#e3d9b9";
    ctx.fillRect(x - 9, 380, 18, 5);
  }

  // src/drive/controller.ts
  function mountDrive() {
    const dialog = document.querySelector("#drive");
    const canvas = document.querySelector("#road");
    const ctx = canvas.getContext("2d");
    const pause = document.querySelector("#pause");
    const meters = document.querySelector("#meters");
    const result = document.querySelector("#result");
    const keys = /* @__PURE__ */ new Set();
    let distance = 0, car = 550, elapsed = 0, last = 0, frame = 0, running = false;
    function stop() {
      cancelAnimationFrame(frame);
      running = false;
      keys.clear();
      pause.textContent = "Resume";
    }
    function step(now) {
      const dt = Math.min((now - last) / 1e3, 0.06);
      last = now;
      elapsed += dt;
      car += (Number(keys.has("ArrowRight")) - Number(keys.has("ArrowLeft"))) * 560 * dt;
      car = Math.max(67, Math.min(1033, car));
      const onRoad = Math.abs(car - roadCenter(distance, 0.72)) < 345;
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
      if (distance === edition.routeMeters) {
        distance = 0;
        elapsed = 0;
        car = 550;
      }
      result.textContent = "";
      running = true;
      pause.textContent = "Pause";
      last = performance.now();
      frame = requestAnimationFrame(step);
    }
    document.querySelectorAll("[data-launch]").forEach((button) => button.addEventListener("click", () => {
      dialog.showModal();
      if (!running) start();
    }));
    document.querySelector("#close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", stop);
    pause.addEventListener("click", () => running ? stop() : start());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && running) stop();
    });
    window.addEventListener("blur", () => {
      if (running) stop();
    });
    window.addEventListener("keydown", (e) => {
      if (running && ["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        keys.add(e.key);
      }
    });
    window.addEventListener("keyup", (e) => keys.delete(e.key));
    for (const [id, key] of [["left", "ArrowLeft"], ["right", "ArrowRight"]]) {
      const button = document.getElementById(id);
      button.addEventListener("pointerdown", (e) => {
        if (running) {
          button.setPointerCapture(e.pointerId);
          keys.add(key);
        }
      });
      button.addEventListener("lostpointercapture", () => keys.delete(key));
    }
  }

  // src/preview.ts
  function updateCountdown() {
    const seconds = Math.max(0, Math.ceil((Date.parse(edition.previewDate) - Date.now()) / 1e3));
    const units = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
    const labels = ["d", "h", "m", "s"];
    document.getElementById("timer").textContent = seconds ? units.map((n, i) => String(n).padStart(2, "0") + labels[i]).join(" ") : "Preview date reached";
  }
  updateCountdown();
  setInterval(updateCountdown, 1e3);
  mountDrive();
})();
