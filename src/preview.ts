import { edition } from "./edition";
import { mountDrive } from "./drive/controller";

function updateCountdown() {
  const seconds = Math.max(0, Math.ceil((Date.parse(edition.previewDate) - Date.now()) / 1000));
  const units = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  const labels = ["d", "h", "m", "s"];
  document.getElementById("timer")!.textContent = seconds
    ? units.map((n, i) => String(n).padStart(2, "0") + labels[i]).join(" ")
    : "Preview date reached";
}
updateCountdown();
setInterval(updateCountdown, 1000);
mountDrive();
