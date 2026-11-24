import { edition } from "./edition";
import { DriveDialog } from "./components/DriveDialog";

function Header() {
  return <header><a className="wordmark" href="#top" aria-label="Leonida home"><span aria-hidden="true">◢</span> LEONIDA</a>
    <nav aria-label="Main navigation"><a href="#edition">The edition</a><a href="#art">Key art</a><a href="#release">Release</a></nav>
    <button className="nav-play" data-launch="">Play demo ↗</button></header>;
}
function Hero() {
  return <section className="hero" aria-labelledby="title"><img className="hero-art" src="assets/causeway.webp" alt="A black coupe on a rain-soaked coastal highway at dusk" fetchPriority="high"/>
    <div className="hero-inner"><p className="label accent"><i/> Xbox Edition for PC</p>
    <h1 id="title">LEONIDA</h1><p className="intro">An independent GTA VI fan project.<br/>A coastal drive you can play today.</p>
    <div className="actions"><button className="primary" data-launch=""><span aria-hidden="true">▶</span> Play coastal drive</button><a href="#edition">Explore the edition <span>↓</span></a></div></div>
    <div className="caption"><span>Causeway at dusk</span><span>Original concept art</span></div></section>;
}
function Edition() {
  return <section className="split" id="edition"><div><p className="label">Project dossier</p><h2>Xbox Edition<br/><em>for PC.</em></h2></div>
    <div className="copy"><p>LEONIDA follows an independent effort to bring the Xbox edition of Grand Theft Auto VI to Windows. We believe players should have a say in which machine they play on.</p>
    <p>The first public project is a playable coastal drive. Follow the bends and cover 1.8 km from the waterfront to the keys. The Windows executable is a separate development milestone.</p><a href="docs/xbox-edition.md">Read the edition notes ↗</a></div></section>;
}
export function Site() {
  return <html lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="description" content="LEONIDA winter preview. Drive the coastal route and discover the independent Xbox Edition for PC project."/>
    <title>LEONIDA — Xbox Edition for PC</title><link rel="icon" href="assets/leonida.svg"/><link rel="stylesheet" href="viewer/campaign.css"/><script defer src="runtime/preview.js"/></head>
    <body id="top"><a className="skip" href="#edition">Skip to project details</a><Header/><main><Hero/>
    <section className="release" id="release"><div><p className="label">Winter project preview</p><h2><time dateTime={edition.previewDate}>{edition.releaseLabel}</time></h2></div><div><p className="label">Time to reveal · UTC</p><strong id="timer">22 DEC · 00:00 UTC</strong></div></section>
    <Edition/><figure id="art"><img src="assets/tidal-keys.webp" alt="An aerial view of an island road over turquoise shallows" loading="lazy"/><figcaption><span>Tidal Keys</span><span>Environment concept / Winter collection</span></figcaption></figure>
    </main><footer><strong>◢ LEONIDA</strong><small>Independent fan project. Unaffiliated with Rockstar Games, Take-Two Interactive or Microsoft.</small><a href="#top">Back to top ↑</a></footer><DriveDialog/></body></html>;
}
