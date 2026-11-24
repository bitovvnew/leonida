export function DriveDialog() {
  return <dialog id="drive" aria-labelledby="drive-title"><div className="bar"><div><p className="label">Playable browser scene</p><h2 id="drive-title">Coastal drive</h2></div><button id="close" aria-label="Close drive">✕</button></div>
    <canvas id="road" width="1100" height="460" aria-label="A coupe on a winding road. Use the left and right controls to steer."/>
    <div className="controls"><div><button id="left" aria-label="Steer left">←</button> <button id="right" aria-label="Steer right">→</button> <button id="pause">Pause</button></div><output id="meters">0 / 1,800 m</output></div>
    <p id="instruction">Hold the arrow keys or steering buttons. Keep your coupe on the road to maintain speed.</p><p id="result" role="status"></p></dialog>;
}
