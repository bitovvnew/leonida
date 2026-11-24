const scenery = new Image();
scenery.src = "coast.svg";

export function roadCenter(meters: number, depth: number) {
  return 550 + 235 * Math.sin(meters / 165 + (1 - depth) * 1.65) * (.35 + depth * .65);
}

export function render(ctx: CanvasRenderingContext2D, meters: number, car: number) {
  const horizon = 174;
  ctx.fillStyle = "#bb8493";
  ctx.fillRect(0, 0, 1100, 460);
  if (scenery.naturalWidth) ctx.drawImage(scenery, 0, -28, 1100, 310);
  for (let y = horizon; y < 460; y += 2) {
    const depth = (y - horizon) / (460 - horizon);
    const half = 7 + depth * 490;
    const center = roadCenter(meters, depth);
    const stripe = Math.floor(12 / (depth + .016) + meters / 10) % 2 === 0;
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
  ctx.moveTo(x - 68, 393); ctx.lineTo(x - 58, 358); ctx.lineTo(x - 32, 332);
  ctx.lineTo(x + 31, 332); ctx.lineTo(x + 58, 358); ctx.lineTo(x + 68, 393);
  ctx.closePath(); ctx.fillStyle = "#d67256"; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 39, 355); ctx.lineTo(x - 25, 337);
  ctx.lineTo(x + 25, 337); ctx.lineTo(x + 39, 355); ctx.closePath();
  ctx.fillStyle = "#263a43"; ctx.fill();
  ctx.fillStyle = "#512f35"; ctx.fillRect(x - 63, 376, 126, 14);
  ctx.fillStyle = "#ffa18e"; ctx.fillRect(x - 54, 378, 31, 5); ctx.fillRect(x + 23, 378, 31, 5);
  ctx.fillStyle = "#e3d9b9"; ctx.fillRect(x - 9, 380, 18, 5);
}
