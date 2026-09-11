import { FormEvent, useEffect, useState } from "react";
import { ArrowClockwise, ArrowSquareOut, Camera, DeviceMobile, DeviceRotate, LinkSimple, SlidersHorizontal } from "@phosphor-icons/react";
import { Analytics } from "@vercel/analytics/react";
import { normalizeUrl } from "./url";

declare global {
  interface Window {
    umami?: { track: (eventName: string, eventData?: Record<string, string>) => void };
  }
}

function trackUmami(eventName: string, eventData?: Record<string, string>) {
  if (typeof window === "undefined") return;

  let attempts = 0;
  const send = () => {
    if (window.umami) {
      window.umami.track(eventName, eventData);
      return;
    }
    if (attempts++ < 100) window.setTimeout(send, 100);
  };
  send();
}

type Orientation = "portrait" | "landscape";
const SAMPLE_URL = "https://example.com";

function Chassis() { return <div className="chassis" aria-hidden="true">{Array.from({ length: 17 }, (_, index) => <div key={index} className="chassis-slice" style={{ transform: `translateZ(${-9 + index * .75}px)` }} />)}<div className="side-key side-key--power" /><div className="side-key side-key--volume" /></div>; }
function PreviewContent({ url, reloadKey, onLoad }: { url: string; reloadKey: number; onLoad: () => void }) { return <iframe key={`${url}-${reloadKey}`} title={`Preview of ${url}`} src={url} onLoad={onLoad} sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" referrerPolicy="strict-origin-when-cross-origin" />; }
function EmptyScreen({ onTrySample }: { onTrySample: () => void }) { return <div className="empty-screen"><div className="empty-orbit" aria-hidden="true"><span /><span /><span /></div><p className="empty-kicker">FOLDVIEW / DEVICE LAB</p><strong>Tu próxima interfaz<br />empieza acá.</strong><span>Pegá una URL y mirala tomar forma en una pantalla plegable.</span><button type="button" onClick={onTrySample}><LinkSimple size={15} /> Probar un ejemplo</button></div>; }
function RearCamera() { return <div className="panel-back rear-panel"><div className="camera-cluster"><i /><i /><span className="camera-flash" /></div><svg className="back-logo" viewBox="0 0 64 76" aria-label="Apple"><path d="M43 1c1 10-6 17-15 18-1-9 6-17 15-18ZM49 39c0-8 5-13 10-16-5-6-12-9-18-7-4 1-7 3-10 3s-7-3-12-3C7 16 1 26 2 39c1 16 11 34 19 35 4 0 7-3 12-3s8 3 12 3c7-1 14-12 17-21-8-3-13-7-13-14Z" /></svg></div>; }
function CoverDisplay({ isOuter, url, reloadKey, onLoad }: { isOuter: boolean; url: string; reloadKey: number; onLoad: () => void }) { return <div className="panel-back cover-display">{isOuter && url ? <PreviewContent url={url} reloadKey={reloadKey} onLoad={onLoad} /> : <div className="cover-idle"><div className="lock-status" aria-hidden="true"><span>100%</span></div><a className="creator-link" href="https://x.com/romanmeclazcke_" target="_blank" rel="noreferrer">Desarrollado por romanmeclazcke</a><span>9:41</span><div className="lock-shortcuts"><span aria-hidden="true"><Camera size={18} weight="fill" /></span></div></div>}<div className="cover-camera" /></div>; }

function Device({ url, fold, tilt, rotation, orientation, reloadKey, loading, onLoad, onTrySample }: { url: string; fold: number; tilt: number; rotation: number; orientation: Orientation; reloadKey: number; loading: boolean; onLoad: () => void; onTrySample: () => void }) {
  const isOuter = fold > 82;
  const openAmount = (100 - fold) / 100;
  // Apple lists the open Duo at 164.6 mm wide x 117.8 mm high.
  const width = orientation === "portrait" ? 1060 : 980;
  const height = orientation === "portrait" ? 760 : 460;
  return <div className="device-stage" aria-label="Interactive foldable device preview"><div className={`device ${isOuter ? "device--closed" : ""}`} style={{ "--fold": `${fold}deg`, "--tilt": `${tilt}deg`, "--rotation": `${rotation}deg`, "--device-width": `${width}px`, "--device-height": `${height}px`, "--open-amount": openAmount } as React.CSSProperties}>
    <div className="fold-panel fold-panel--fixed"><Chassis /><CoverDisplay isOuter={isOuter} url={url} reloadKey={reloadKey} onLoad={onLoad} /><div className="panel-face"><div className="panel-wallpaper" /></div></div>
    <div className="fold-panel fold-panel--moving"><Chassis /><div className="panel-face"><div className="panel-wallpaper" /></div><RearCamera /></div>
    <div className="device-body live-inner" inert={isOuter}><div className="screen-clip">{url ? <PreviewContent url={url} reloadKey={reloadKey} onLoad={onLoad} /> : <EmptyScreen onTrySample={onTrySample} />}{loading && <div className="loading-layer" aria-live="polite"><div /><div /><div /></div>}<div className="screen-sheen" /></div><div className="crease" aria-hidden="true" /></div><div className="device-shadow" />
  </div></div>;
}

export default function App() {
  const [input, setInput] = useState(""); const [url, setUrl] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const [fold, setFold] = useState(0); const [tilt, setTilt] = useState(-7); const [rotation, setRotation] = useState(0); const orientation: Orientation = "portrait"; const [reloadKey, setReloadKey] = useState(0); const [showTip, setShowTip] = useState(false);
  useEffect(() => { const sharedUrl = new URLSearchParams(window.location.search).get("url"); const normalized = sharedUrl && normalizeUrl(sharedUrl); if (normalized) { setInput(normalized); setUrl(normalized); setLoading(true); } }, []);
  function loadUrl(value: string) { const normalized = normalizeUrl(value); if (!normalized) { setError("Enter a valid public URL, for example studio.com."); return; } setError(""); setInput(normalized); setUrl(normalized); setLoading(true); setShowTip(false); trackUmami("preview_started", { domain: new URL(normalized).hostname }); const shareUrl = new URL(window.location.href); shareUrl.searchParams.set("url", normalized); window.history.replaceState({}, "", shareUrl); }
  function handleSubmit(event: FormEvent) { event.preventDefault(); loadUrl(input); }
  return <main><header className="topbar"><a className="brand" href="/" aria-label="iPhone 18 Fold View home"><span className="brand-symbol"><span className="brand-symbol__panel" /><span className="brand-symbol__panel" /></span><span>iPhone 18 Fold View</span></a><div className="status"><span /> Browser preview · MVP</div></header><section className="workspace"><aside className="control-panel"><div className="intro"><p className="eyebrow">Responsive device lab</p><h1>See the layout<br />before the hardware.</h1><p>Load any public website into an interactive foldable canvas. Open it, rotate it, and inspect the awkward widths.</p></div><form onSubmit={handleSubmit} noValidate><label htmlFor="website-url">Website URL</label><div className={`url-field ${error ? "url-field--error" : ""}`}><LinkSimple size={19} /><input id="website-url" type="text" inputMode="url" value={input} onChange={(event) => { setInput(event.target.value); if (error) setError(""); }} placeholder="your-site.com" aria-describedby={error ? "url-error" : "url-helper"} /><button type="submit">Load site</button></div>{error ? <p id="url-error" className="field-message error" role="alert">{error}</p> : <p id="url-helper" className="field-message">Only public HTTP or HTTPS addresses.</p>}</form><div className="control-group"><div className="control-heading"><span><DeviceMobile size={18} /> Dispositivo</span><output>{fold ? "Cerrado" : "Abierto"}</output></div><button type="button" className="fold-button" aria-pressed={fold > 0} onClick={() => setFold((current) => current ? 0 : 100)}><DeviceMobile size={20} />{fold ? "Abrir celular" : "Plegar celular"}<span>{fold ? "↗" : "↙"}</span></button><p className="field-message">Un clic para abrir o cerrar la bisagra.</p></div><div className="control-group"><div className="control-heading"><span><SlidersHorizontal size={18} /> Perspective</span><output>{tilt}��</output></div><input aria-label="Perspective angle" type="range" min="-18" max="18" value={tilt} onChange={(event) => setTilt(Number(event.target.value))} /></div><div className="button-row"><button type="button" className="secondary-button" onClick={() => setRotation(0)} aria-pressed={rotation === 0}>Frente</button><button type="button" className="secondary-button" onClick={() => setRotation(180)} aria-pressed={rotation === 180}>Reverso</button></div><div className="control-group"><div className="control-heading"><span><DeviceRotate size={18} /> Giro 360°</span><output>{rotation}°</output></div><input aria-label="Giro del celular" type="range" min="0" max="360" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} /></div><div className="button-row"><button type="button" className="icon-button" onClick={() => { if (url) { setLoading(true); setReloadKey((key) => key + 1); } }} aria-label="Reload preview" disabled={!url}><ArrowClockwise size={18} /></button><a className={`icon-button ${!url ? "disabled" : ""}`} href={url || undefined} target="_blank" rel="noreferrer" aria-label="Open website in a new tab"><ArrowSquareOut size={18} /></a></div><button type="button" className="iframe-note" onClick={() => setShowTip((current) => !current)} aria-expanded={showTip}><span>Site not appearing?</span><span>{showTip ? "−" : "+"}</span></button>{showTip && <p className="tip">Some websites block previews for security. Open the site directly to confirm it works.</p>}</aside><section className="preview-panel"><div className="preview-grid" aria-hidden="true" /><div className="preview-toolbar"><span>Live viewport</span><span className="url-readout">{url ? new URL(url).hostname : "No site loaded"}</span></div><Device url={url} fold={fold} tilt={tilt} rotation={rotation} orientation={orientation} reloadKey={reloadKey} loading={loading} onLoad={() => { setLoading(false); if (url) trackUmami("preview_loaded", { domain: new URL(url).hostname }); }} onTrySample={() => loadUrl(SAMPLE_URL)} /><div className="social-links" aria-label="Redes de Roman"><span>Creado por romanmeclazcke</span><span className="social-links__divider">·</span><a href="https://x.com/romanmeclazcke_" target="_blank" rel="noreferrer">X</a><a href="https://www.linkedin.com/in/roman-meclazcke/" target="_blank" rel="noreferrer">LinkedIn</a></div><p className="disclaimer">Conceptual foldable viewport · not a hardware-accurate simulator</p></section></section><Analytics /></main>;
}
