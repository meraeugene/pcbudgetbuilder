"use client";

import { useMemo, useState } from "react";

type UseCase = "gaming" | "architecture" | "editing" | "work";
type Device = "desktop" | "laptop";
type Part = { category: string; name: string; shop: string; price: number };
type Build = { tier: string; label: string; note: string; parts: Part[] };
type Laptop = { tier: string; name: string; specs: string[]; note: string; shop: string; price: number };

const purposes: { id: UseCase; label: string; note: string; mark: string }[] = [
  { id: "gaming", label: "Gaming", note: "FPS + quality", mark: "G" },
  { id: "architecture", label: "Architecture", note: "CAD + render", mark: "A" },
  { id: "editing", label: "Content", note: "Edit + stream", mark: "C" },
  { id: "work", label: "Work & study", note: "Daily speed", mark: "W" },
];

const part = (category: string, name: string, shop: string, price: number): Part => ({ category, name, shop, price });
const sumBuild = (build: Build) => build.parts.reduce((sum, item) => sum + item.price, 0);

const starterBase = [
  part("Motherboard", "ASUS Prime B650M-K", "PC Corner", 6998),
  part("Memory", "TeamGroup 32GB DDR5-6000", "EasyPC", 5295),
  part("Storage", "WD Blue SN580 1TB", "DynaQuest", 3895),
  part("Power", "Cooler Master MWE 650", "PCHub", 3595),
  part("Case", "Tecware Infinity M2", "EasyPC", 2895),
];

const balancedBase = [
  part("Motherboard", "MSI B850 Gaming Plus WiFi", "DynaQuest", 13395),
  part("Memory", "G.Skill Flare X5 32GB DDR5", "PCHub", 6395),
  part("Storage", "WD Black SN850X 1TB", "VillMan", 5695),
  part("Power", "Corsair RM750e Gold", "DynaQuest", 5995),
  part("Case", "Montech Air 903 Max", "EasyPC", 4295),
  part("Cooling", "Thermalright Peerless Assassin", "DynaQuest", 2495),
];

const proBase = [
  part("Motherboard", "ASUS ROG Strix B850-G WiFi", "PC Corner", 16198),
  part("Memory", "Kingston Fury 64GB DDR5", "PCHub", 11995),
  part("Storage", "Samsung 990 Pro 2TB", "VillMan", 8995),
  part("Power", "Seasonic Focus GX-850 Gold", "DynaQuest", 7995),
  part("Case", "Fractal North", "DynaQuest", 7995),
  part("Cooling", "Arctic Liquid Freezer III 360", "PCHub", 6495),
];

const builds: Record<UseCase, Build[]> = {
  gaming: [
    { tier: "Smart starter", label: "1080p Play Pal", note: "Fast 1080p gaming with a current AM5 upgrade path.", parts: [part("Processor", "AMD Ryzen 5 9600X", "DynaQuest", 12265), part("Graphics", "MSI RTX 5060 Shadow 8GB", "EasyPC", 24030), ...starterBase] },
    { tier: "Sweet spot", label: "1440p Happy Place", note: "A current-gen 1440p build tuned for high refresh rates.", parts: [part("Processor", "AMD Ryzen 7 9700X", "PC Corner", 17898), part("Graphics", "Gigabyte RTX 5070 Aero 12GB", "EasyPC", 46811), ...balancedBase] },
    { tier: "Big power", label: "4K Tiny Monster", note: "Serious 4K power without wasting the budget on decoration.", parts: [part("Processor", "AMD Ryzen 9 9900X", "PC Corner", 23198), part("Graphics", "Gigabyte RTX 5070 Ti 16GB", "DynaQuest", 66785), ...proBase] },
  ],
  architecture: [
    { tier: "Smart starter", label: "CAD Cutie", note: "Great for AutoCAD, SketchUp, and student visualization work.", parts: [part("Processor", "AMD Ryzen 5 9600X", "DynaQuest", 12265), part("Graphics", "MSI RTX 5060 Shadow 8GB", "EasyPC", 24030), ...starterBase] },
    { tier: "Sweet spot", label: "Studio Sidekick", note: "More CPU speed and VRAM for Revit, Rhino, and Lumion.", parts: [part("Processor", "AMD Ryzen 7 9700X", "PC Corner", 17898), part("Graphics", "Gigabyte RTX 5070 Aero 12GB", "EasyPC", 46811), ...balancedBase] },
    { tier: "Big power", label: "Render Buddy Pro", note: "A 64GB visualization workstation for large BIM and 4K scenes.", parts: [part("Processor", "AMD Ryzen 9 9900X", "PC Corner", 23198), part("Graphics", "MSI RTX 5070 Ti 16GB", "EasyPC", 63105), ...proBase] },
  ],
  editing: [
    { tier: "Smart starter", label: "Creator Cub", note: "Quick 1080p editing, streaming, and hardware-accelerated exports.", parts: [part("Processor", "AMD Ryzen 5 9600X", "DynaQuest", 12265), part("Graphics", "MSI RTX 5060 Shadow 8GB", "EasyPC", 24030), ...starterBase] },
    { tier: "Sweet spot", label: "4K Edit Friend", note: "A responsive timeline, current NVENC, and fast scratch storage.", parts: [part("Processor", "AMD Ryzen 7 9700X", "PC Corner", 17898), part("Graphics", "Gigabyte RTX 5070 Aero 12GB", "EasyPC", 46811), ...balancedBase] },
    { tier: "Big power", label: "Studio Bear", note: "Built for heavy 4K/8K edits, motion graphics, and 3D compositing.", parts: [part("Processor", "AMD Ryzen 9 9900X", "PC Corner", 23198), part("Graphics", "Gigabyte RTX 5070 Ti 16GB", "DynaQuest", 66785), ...proBase] },
  ],
  work: [
    { tier: "Smart starter", label: "Daily Desk Pal", note: "Quiet, quick, and complete without a graphics card you do not need.", parts: [part("Processor", "AMD Ryzen 7 8700G", "PC Corner", 16698), part("Motherboard", "ASUS Prime B650M-K", "PC Corner", 6998), part("Memory", "TeamGroup 16GB DDR5", "EasyPC", 3295), part("Storage", "WD Blue SN580 1TB", "DynaQuest", 3895), part("Power", "FSP HV Pro 550", "PCHub", 2495), part("Case", "Tecware Infinity M2", "EasyPC", 2895)] },
    { tier: "Sweet spot", label: "Multitask Mate", note: "Lots of memory and CPU headroom for code, research, and creative work.", parts: [part("Processor", "AMD Ryzen 7 9700X", "PC Corner", 17898), part("Graphics", "MSI RTX 5050 8GB", "DynaQuest", 20550), ...balancedBase] },
    { tier: "Big power", label: "Office Overachiever", note: "Premium multitasking, silence, and longevity for demanding teams.", parts: [part("Processor", "AMD Ryzen 9 9900X", "PC Corner", 23198), part("Graphics", "MSI RTX 5060 Shadow 8GB", "EasyPC", 24030), ...proBase] },
  ],
};

const laptops: Record<UseCase, Laptop[]> = {
  gaming: [
    { tier: "Starter", name: "Lenovo LOQ 15", specs: ["Core i5", "RTX 4050", "16GB", "512GB"], note: "The sensible entry pick for smooth 1080p play.", shop: "VillMan", price: 62995 },
    { tier: "Sweet spot", name: "ASUS Gaming V16", specs: ["Core 7 240H", "RTX 5070", "16GB", "512GB"], note: "Current RTX 5070 performance at a notably sharp local price.", shop: "PC Express", price: 104995 },
    { tier: "Big power", name: "ROG Strix G16", specs: ["Ultra 9 275HX", "RTX 5070", "16GB", "1TB"], note: "A high-refresh 16-inch powerhouse for serious play.", shop: "PC Express", price: 174995 },
  ],
  architecture: [
    { tier: "Starter", name: "ASUS Vivobook Pro 15", specs: ["Ryzen 7", "RTX 4050", "16GB", "1TB OLED"], note: "A portable student studio with CUDA acceleration.", shop: "VillMan", price: 65995 },
    { tier: "Sweet spot", name: "Acer Predator Helios Neo 16", specs: ["Ultra 7 255HX", "RTX 5060", "16GB", "512GB"], note: "OLED, 240Hz, and current GPU power for mobile renders.", shop: "VillMan", price: 104999 },
    { tier: "Big power", name: "ROG Zephyrus G14", specs: ["Ryzen AI 9 HX", "RTX 5070", "32GB", "1TB OLED"], note: "A compact visualization studio with a color-rich display.", shop: "PC Express", price: 179995 },
  ],
  editing: [
    { tier: "Starter", name: "ASUS Vivobook Pro 15", specs: ["Ryzen 7", "RTX 4050", "16GB", "1TB OLED"], note: "An OLED creator laptop for edits, photos, and motion work.", shop: "VillMan", price: 65995 },
    { tier: "Sweet spot", name: "Acer Predator Helios Neo 16", specs: ["Ultra 7 255HX", "RTX 5060", "16GB", "512GB"], note: "Fast exports and a 240Hz OLED canvas for creators.", shop: "VillMan", price: 104999 },
    { tier: "Big power", name: "ROG Zephyrus G14", specs: ["Ryzen AI 9 HX", "RTX 5070", "32GB", "1TB OLED"], note: "Premium mobile editing with more memory and GPU headroom.", shop: "PC Express", price: 179995 },
  ],
  work: [
    { tier: "Starter", name: "Lenovo IdeaPad Slim 3", specs: ["Ryzen 5", "16GB", "512GB", "15.6 inch"], note: "A tidy everyday laptop for school and office essentials.", shop: "Gigahertz", price: 34995 },
    { tier: "Sweet spot", name: "ASUS Zenbook 14 OLED", specs: ["Core Ultra 5", "16GB", "1TB", "14 inch OLED"], note: "Light, polished, and ready for a full day away from a desk.", shop: "VillMan", price: 64995 },
    { tier: "Big power", name: "Lenovo ThinkPad X1 Carbon", specs: ["Core Ultra 7", "32GB", "1TB", "14 inch"], note: "Premium build quality, keyboard, and business durability.", shop: "Lenovo Store", price: 119995 },
  ],
};

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export default function Home() {
  const [budget, setBudget] = useState(75000);
  const [device, setDevice] = useState<Device>("desktop");
  const [useCase, setUseCase] = useState<UseCase>("architecture");
  const [dark, setDark] = useState(true);
  const [copied, setCopied] = useState(false);

  const selectedBuild = useMemo(() => [...builds[useCase]].reverse().find((item) => sumBuild(item) <= budget) ?? builds[useCase][0], [budget, useCase]);
  const selectedLaptop = useMemo(() => [...laptops[useCase]].reverse().find((item) => item.price <= budget) ?? laptops[useCase][0], [budget, useCase]);
  const total = device === "desktop" ? sumBuild(selectedBuild) : selectedLaptop.price;
  const difference = budget - total;
  const fit = Math.min(100, Math.round((total / budget) * 100));

  const copyPick = async () => {
    const text = device === "desktop"
      ? `${selectedBuild.label} - ${peso.format(total)}\n${selectedBuild.parts.map((item) => `${item.category}: ${item.name} - ${peso.format(item.price)} at ${item.shop}`).join("\n")}`
      : `${selectedLaptop.name} - ${peso.format(total)} at ${selectedLaptop.shop}\n${selectedLaptop.specs.join(" / ")}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className={dark ? "app dark" : "app"}>
      <header className="app-header">
        <div className="logo"><span className="logo-box">B</span><strong>BUILDWISE</strong><small>PC PICKS IN PESOS</small></div>
        <div className="fresh"><i /> PRICES REFRESHED AUG &apos;26</div>
        <button className="dark-toggle" aria-pressed={dark} onClick={() => setDark((value) => !value)}>
          <span className="toggle-icon" aria-hidden="true">{dark ? "☾" : "☀"}</span>
          <span><b>Dark mode</b><small>{dark ? "On" : "Off"}</small></span>
          <i className={dark ? "switch on" : "switch"}><b /></i>
        </button>
      </header>

      <div className="workspace">
        <section className="controls" aria-label="Build controls">
          <div className="welcome">
            <div><span className="eyebrow">HELLO, BUILDER!</span><h1>Let&apos;s find your<br /><em>happy setup.</em></h1><p>Move the budget. Your pick updates right away.</p></div>
            <div className="buddy" aria-hidden="true"><span className="eye one" /><span className="eye two" /><span className="smile" /><i>✦</i></div>
          </div>

          <div className="control-card budget-card">
            <div className="control-title"><span>1</span><label htmlFor="budget">Your budget</label><small>PHP</small></div>
            <div className="budget-input"><span>₱</span><input id="budget" type="number" min="30000" max="250000" step="1000" value={budget} onChange={(event) => setBudget(Math.max(30000, Math.min(250000, Number(event.target.value) || 30000)))} /></div>
            <input className="range" type="range" min="30000" max="250000" step="1000" value={budget} onChange={(event) => setBudget(Number(event.target.value))} aria-label="Adjust budget" />
            <div className="range-ends"><span>₱30K</span><span>₱250K</span></div>
          </div>

          <div className="control-card">
            <div className="control-title"><span>2</span><p>Choose your kind</p><small>LIVE</small></div>
            <div className="device-toggle" role="group" aria-label="Choose desktop or laptop">
              <button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}><i className="desktop-icon" /> <span><b>Build a PC</b><small>Pick every part</small></span></button>
              <button className={device === "laptop" ? "active" : ""} onClick={() => setDevice("laptop")}><i className="laptop-icon" /> <span><b>Find a laptop</b><small>Ready to go</small></span></button>
            </div>
          </div>

          <div className="control-card purpose-card">
            <div className="control-title"><span>3</span><p>What&apos;s it for?</p><small>PICK ONE</small></div>
            <div className="purpose-grid">{purposes.map((item) => <button key={item.id} className={useCase === item.id ? "active" : ""} onClick={() => setUseCase(item.id)}><i>{item.mark}</i><span><b>{item.label}</b><small>{item.note}</small></span><em>{useCase === item.id ? "●" : "○"}</em></button>)}</div>
          </div>

          <div className="shops"><span>Compared at</span><b>DYNAQUEST</b><b>PC HUB</b><b>EASYPC</b><b>VILLMAN</b></div>
        </section>

        <section className="result" aria-live="polite">
          <div className="result-top">
            <div><span className="live-pill"><i /> LIVE MATCH</span><small>{device === "desktop" ? "CUSTOM DESKTOP" : "READY-TO-GO LAPTOP"}</small></div>
            <div className="fit"><b>{fit}%</b><span>budget fit</span></div>
          </div>

          <div className="pick-heading">
            <div><span>{device === "desktop" ? selectedBuild.tier : selectedLaptop.tier}</span><h2>{device === "desktop" ? selectedBuild.label : selectedLaptop.name}</h2><p>{device === "desktop" ? selectedBuild.note : selectedLaptop.note}</p></div>
            <div className="price"><small>YOUR TOTAL</small><strong>{peso.format(total)}</strong><span className={difference >= 0 ? "under" : "over"}>{difference >= 0 ? `${peso.format(difference)} left` : `${peso.format(Math.abs(difference))} over`}</span></div>
          </div>

          {device === "desktop" ? (
            <div className="parts-grid" key={`${useCase}-${selectedBuild.label}`}>
              {selectedBuild.parts.map((item) => <article key={`${item.category}-${item.name}`}><div><span>{item.category}</span><h3>{item.name}</h3></div><div><b>{peso.format(item.price)}</b><small>{item.shop}</small></div></article>)}
            </div>
          ) : (
            <div className="laptop-showcase" key={`${useCase}-${selectedLaptop.name}`}>
              <div className="laptop-doodle"><div className="screen"><span>BW</span><i>•ᴗ•</i></div><div className="base" /></div>
              <div className="laptop-info"><span>BEST MATCH FOR {useCase.toUpperCase()}</span><h3>{selectedLaptop.name}</h3><div className="spec-grid">{selectedLaptop.specs.map((spec) => <b key={spec}>{spec}</b>)}</div><div className="seller"><span><small>Available at</small><b>{selectedLaptop.shop}</b></span><strong>{peso.format(selectedLaptop.price)}</strong></div></div>
            </div>
          )}

          <div className="result-footer">
            <div className="checked"><span>✓</span><div><b>{device === "desktop" ? "Compatibility checked" : "Budget matched"}</b><small>{device === "desktop" ? "Socket, power, size, and performance balance" : "The strongest current option that fits your budget"}</small></div></div>
            <button onClick={copyPick}>{copied ? "Copied! ✓" : "Copy my pick"}<span>↗</span></button>
          </div>
          <p className="disclaimer">Indicative cash prices from current Philippine shop listings. Confirm stock and final price before checkout.</p>
        </section>
      </div>
    </main>
  );
}
