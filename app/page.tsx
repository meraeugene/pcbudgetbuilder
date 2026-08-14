"use client";

import { useMemo, useState } from "react";

type UseCase = "gaming" | "architecture" | "editing" | "work";
type Device = "desktop" | "laptop";
type Tier = "Starter" | "Balanced" | "High-end";
type Part = { category: string; name: string; detail: string; shop: string; price: number };
type BuildPlan = { tier: Tier; label: string; note: string; parts: Part[] };
type Laptop = { name: string; badge: string; specs: string; detail: string; shop: string; price: number };

const useCases: { id: UseCase; name: string; eyebrow: string }[] = [
  { id: "gaming", name: "Gaming", eyebrow: "High FPS" },
  { id: "architecture", name: "Architecture", eyebrow: "CAD + 3D" },
  { id: "editing", name: "Content creation", eyebrow: "Edit + render" },
  { id: "work", name: "Work & study", eyebrow: "Everyday fast" },
];

const p = (category: string, name: string, detail: string, shop: string, price: number): Part => ({ category, name, detail, shop, price });

const commonStarter = [
  p("Motherboard", "MSI B550M PRO-VDH WiFi", "Wi-Fi · 4 DIMM slots", "EasyPC", 5695),
  p("Storage", "Kingston NV2 1TB NVMe", "PCIe 4.0 SSD", "DynaQuest", 3695),
  p("Power", "Cooler Master MWE 650", "650W · 80+ Bronze", "PCHub", 3395),
  p("Case", "Tecware Flatline", "4× fans included", "EasyPC", 2395),
];
const commonBalanced = [
  p("Motherboard", "Gigabyte B650M Gaming X AX", "Wi-Fi 6E · AM5", "DynaQuest", 9295),
  p("Storage", "WD Black SN770 1TB", "PCIe 4.0 SSD", "VillMan", 4595),
  p("Power", "Corsair RM750e", "750W · 80+ Gold", "DynaQuest", 5995),
  p("Case", "Montech Air 100", "High-airflow mATX", "EasyPC", 3495),
  p("Cooling", "DeepCool AK400", "Quiet tower cooler", "EasyPC", 1695),
];
const commonHigh = [
  p("Motherboard", "MSI MAG B650 Tomahawk", "Wi-Fi 6E · AM5", "VillMan", 13995),
  p("Storage", "Samsung 990 EVO 2TB", "High-speed workspace SSD", "VillMan", 8995),
  p("Power", "Seasonic Focus GX-850", "850W · 80+ Gold", "PCHub", 7995),
  p("Case", "Fractal North", "Premium airflow", "DynaQuest", 8995),
  p("Cooling", "Arctic Liquid Freezer III", "360mm liquid cooling", "PCHub", 7495),
];

const builds: Record<UseCase, BuildPlan[]> = {
  gaming: [
    { tier: "Starter", label: "1080p Value Build", note: "Smooth esports and AAA gaming at high settings.", parts: [p("Processor", "AMD Ryzen 5 5600", "6 cores · 12 threads", "DynaQuest", 6295), p("Graphics", "ASUS Dual RX 7600 8GB", "Best-value 1080p GPU", "PCHub", 16995), p("Memory", "TeamGroup T-Force 16GB", "2×8GB · DDR4-3600", "EasyPC", 2395), ...commonStarter] },
    { tier: "Balanced", label: "1440p Sweet Spot", note: "High-refresh 1440p performance with an upgrade-ready platform.", parts: [p("Processor", "AMD Ryzen 5 7600", "6 cores · 12 threads", "DynaQuest", 11995), p("Graphics", "Zotac RTX 4070 Super Twin", "12GB GDDR6X", "PCHub", 38995), p("Memory", "G.Skill Flare X5 32GB", "2×16GB · DDR5-6000", "PCHub", 6395), ...commonBalanced] },
    { tier: "High-end", label: "4K Performance Build", note: "Built for ultra settings, ray tracing, and high-refresh 4K.", parts: [p("Processor", "AMD Ryzen 7 7800X3D", "8 cores · 3D V-Cache", "DynaQuest", 26995), p("Graphics", "Gigabyte RTX 4080 Super", "16GB GDDR6X", "PCHub", 71995), p("Memory", "Corsair Vengeance 32GB", "2×16GB · DDR5-6000", "DynaQuest", 6995), ...commonHigh] },
  ],
  architecture: [
    { tier: "Starter", label: "CAD Starter Workstation", note: "Balanced for AutoCAD, SketchUp, and light Lumion work.", parts: [p("Processor", "AMD Ryzen 5 5600", "6 cores · 12 threads", "DynaQuest", 6295), p("Graphics", "Zotac RTX 4060 8GB", "CUDA + ray tracing", "PCHub", 19495), p("Memory", "TeamGroup T-Force 32GB", "2×16GB · DDR4-3600", "EasyPC", 4295), ...commonStarter] },
    { tier: "Balanced", label: "3D Design Workstation", note: "More CPU cores and VRAM for Revit, Rhino, and Lumion renders.", parts: [p("Processor", "AMD Ryzen 7 7700", "8 cores · 16 threads", "DynaQuest", 17495), p("Graphics", "Zotac RTX 4070 Super Twin", "12GB GDDR6X", "PCHub", 38995), p("Memory", "G.Skill Flare X5 32GB", "2×16GB · DDR5-6000", "PCHub", 6395), ...commonBalanced] },
    { tier: "High-end", label: "Visualization Pro", note: "Serious rendering power for large BIM scenes and 4K walkthroughs.", parts: [p("Processor", "AMD Ryzen 9 7900X", "12 cores · 24 threads", "DynaQuest", 25495), p("Graphics", "Gigabyte RTX 4080 Super", "16GB GDDR6X", "PCHub", 71995), p("Memory", "Kingston Fury Beast 64GB", "2×32GB · DDR5-6000", "PCHub", 12995), ...commonHigh] },
  ],
  editing: [
    { tier: "Starter", label: "Creator Essentials", note: "Comfortable 1080p editing and entry-level streaming.", parts: [p("Processor", "Intel Core i5-12400", "6 cores · Quick Sync", "DynaQuest", 7895), p("Graphics", "Zotac RTX 4060 8GB", "Fast NVENC encoder", "PCHub", 19495), p("Memory", "TeamGroup T-Force 32GB", "2×16GB · DDR4-3600", "EasyPC", 4295), ...commonStarter] },
    { tier: "Balanced", label: "4K Creator Build", note: "Fast timeline playback, effects, exports, and generous memory.", parts: [p("Processor", "Intel Core i7-14700F", "20 cores · 28 threads", "DynaQuest", 22995), p("Graphics", "Zotac RTX 4070 Super Twin", "12GB · dual NVENC", "PCHub", 38995), p("Memory", "G.Skill Ripjaws S5 32GB", "2×16GB · DDR5-6000", "PCHub", 6395), ...commonBalanced] },
    { tier: "High-end", label: "Studio Workhorse", note: "For heavy 4K/8K workflows, motion graphics, and 3D compositing.", parts: [p("Processor", "Intel Core i9-14900K", "24 cores · Quick Sync", "DynaQuest", 34995), p("Graphics", "Gigabyte RTX 4080 Super", "16GB · dual NVENC", "PCHub", 71995), p("Memory", "Kingston Fury Beast 64GB", "2×32GB · DDR5-6000", "PCHub", 12995), ...commonHigh] },
  ],
  work: [
    { tier: "Starter", label: "Smart Everyday PC", note: "A fast, quiet setup for documents, classes, and remote work.", parts: [p("Processor", "AMD Ryzen 5 5600G", "6 cores · Radeon graphics", "DynaQuest", 7495), p("Memory", "TeamGroup Elite 16GB", "2×8GB · DDR4-3200", "EasyPC", 2195), p("Motherboard", "MSI B550M PRO-VDH WiFi", "Wi-Fi · 4 DIMM slots", "EasyPC", 5695), p("Storage", "Kingston NV2 500GB", "PCIe 4.0 SSD", "DynaQuest", 2395), p("Power", "FSP HV Pro 550", "550W · 80+ Bronze", "PCHub", 2295), p("Case", "Tecware Nexus Air M2", "3× fans included", "EasyPC", 1895)] },
    { tier: "Balanced", label: "Productivity Plus", note: "More headroom for multitasking, coding, and light creative work.", parts: [p("Processor", "AMD Ryzen 7 8700G", "8 cores · Radeon 780M", "DynaQuest", 18495), p("Memory", "G.Skill Flare X5 32GB", "2×16GB · DDR5-6000", "PCHub", 6395), ...commonBalanced] },
    { tier: "High-end", label: "Executive Desktop", note: "Premium speed, silence, and longevity for demanding professionals.", parts: [p("Processor", "AMD Ryzen 9 7900", "12 cores · 24 threads", "DynaQuest", 23995), p("Graphics", "ASUS Dual RTX 4060", "8GB · creator capable", "PCHub", 19995), p("Memory", "Kingston Fury Beast 64GB", "2×32GB · DDR5-6000", "PCHub", 12995), ...commonHigh] },
  ],
};

const laptopData: Record<UseCase, Laptop[]> = {
  gaming: [
    { name: "Lenovo LOQ 15IRX9", badge: "Best value", specs: "Core i5 · RTX 4050 · 16GB · 512GB", detail: "A strong 1080p entry with upgradeable memory.", shop: "Gigahertz", price: 56995 },
    { name: "ASUS TUF Gaming A15", badge: "Best match", specs: "Ryzen 7 · RTX 4060 · 16GB · 1TB", detail: "Excellent thermals and 144Hz performance for the price.", shop: "VillMan", price: 82995 },
    { name: "ROG Strix G16", badge: "Performance", specs: "Core i9 · RTX 4070 · 32GB · 1TB", detail: "Desktop-class speed in a polished high-refresh package.", shop: "PC Central", price: 139995 },
  ],
  architecture: [
    { name: "Acer Nitro V 15", badge: "CAD starter", specs: "Core i5 · RTX 4050 · 16GB · 512GB", detail: "CUDA acceleration and enough power for student projects.", shop: "PC Express", price: 55999 },
    { name: "Lenovo Legion 5", badge: "Best match", specs: "Ryzen 7 · RTX 4060 · 32GB · 1TB", detail: "Color-accurate display and serious power for mobile renders.", shop: "Gigahertz", price: 92995 },
    { name: "Lenovo Legion Pro 7i", badge: "Studio grade", specs: "Core i9 · RTX 4080 · 32GB · 1TB", detail: "Heavy visualization work without giving up portability.", shop: "VillMan", price: 169995 },
  ],
  editing: [
    { name: "ASUS Vivobook Pro 15", badge: "Creator value", specs: "Ryzen 7 · RTX 4050 · 16GB · 1TB OLED", detail: "An OLED canvas with GPU acceleration for creative apps.", shop: "VillMan", price: 65995 },
    { name: "MacBook Pro 14 M4", badge: "Best match", specs: "Apple M4 · 16GB · 512GB", detail: "Excellent battery life and fast, quiet video workflows.", shop: "Beyond the Box", price: 99990 },
    { name: "ASUS ProArt P16", badge: "Studio grade", specs: "Ryzen AI 9 · RTX 4070 · 32GB · 2TB OLED", detail: "A premium mobile studio for video, motion, and 3D.", shop: "ASUS Concept Store", price: 174995 },
  ],
  work: [
    { name: "Lenovo IdeaPad Slim 3", badge: "Budget pick", specs: "Ryzen 5 · 16GB · 512GB", detail: "Reliable everyday speed and a practical port selection.", shop: "Gigahertz", price: 32995 },
    { name: "ASUS Zenbook 14 OLED", badge: "Best match", specs: "Core Ultra 5 · 16GB · 1TB OLED", detail: "Light, polished, and ready for a full day away from a desk.", shop: "VillMan", price: 64995 },
    { name: "Lenovo ThinkPad X1 Carbon", badge: "Business class", specs: "Core Ultra 7 · 32GB · 1TB", detail: "Premium build, keyboard, and enterprise durability.", shop: "Lenovo Store", price: 119995 },
  ],
};

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
const chooseTier = (budget: number) => budget < 65000 ? 0 : budget < 125000 ? 1 : 2;

export default function Home() {
  const [budget, setBudget] = useState(75000);
  const [device, setDevice] = useState<Device>("desktop");
  const [useCase, setUseCase] = useState<UseCase>("architecture");
  const [lightMode, setLightMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const selectedBuild = builds[useCase][chooseTier(budget)];
  const selectedLaptop = useMemo(() => [...laptopData[useCase]].reverse().find((item) => item.price <= budget) ?? laptopData[useCase][0], [budget, useCase]);
  const total = selectedBuild.parts.reduce((sum, part) => sum + part.price, 0);
  const recommendationTotal = device === "desktop" ? total : selectedLaptop.price;
  const remaining = budget - recommendationTotal;
  const percentage = Math.min(100, Math.round((recommendationTotal / budget) * 100));

  const copyRecommendation = async () => {
    const summary = device === "desktop"
      ? `${selectedBuild.label} — ${peso.format(total)}\n${selectedBuild.parts.map((part) => `${part.category}: ${part.name} — ${peso.format(part.price)} at ${part.shop}`).join("\n")}`
      : `${selectedLaptop.name} — ${peso.format(selectedLaptop.price)} at ${selectedLaptop.shop}\n${selectedLaptop.specs}`;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className={lightMode ? "site light" : "site"}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Buildwise home"><span className="brand-mark">B</span><span>BUILDWISE</span></a>
        <nav aria-label="Main navigation"><a href="#builder">Builder</a><a href="#recommendation">Recommendation</a><a href="#shops">Shops</a></nav>
        <button className="theme-button" onClick={() => setLightMode((value) => !value)} aria-label="Toggle color theme"><span aria-hidden="true">{lightMode ? "●" : "○"}</span>{lightMode ? "Dark" : "Light"}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker"><span /> BUILT FOR THE PHILIPPINES</p>
          <h1>Spend smarter.<br />Build <em>better.</em></h1>
          <p className="hero-subtitle">Tell us your budget and what you do. We&apos;ll match you with the right PC parts or laptop—priced in pesos from trusted local shops.</p>
          <div className="hero-proof"><div><strong>4+</strong><span>trusted shops</span></div><div><strong>₱30K–₱250K</strong><span>budget range</span></div><div><strong>100%</strong><span>compatibility checked</span></div></div>
        </div>

        <div className="builder-card" id="builder">
          <div className="card-heading"><div><span className="step-label">01</span><h2>Set your budget</h2></div><span className="status"><i /> READY</span></div>
          <label className="budget-label" htmlFor="budget">Your budget</label>
          <div className="budget-field"><span>₱</span><input id="budget" inputMode="numeric" type="number" min="30000" max="250000" step="1000" value={budget} onChange={(event) => setBudget(Math.max(30000, Math.min(250000, Number(event.target.value) || 30000)))} aria-label="Budget in Philippine pesos" /><small>PHP</small></div>
          <input className="budget-range" type="range" min="30000" max="250000" step="1000" value={budget} onChange={(event) => setBudget(Number(event.target.value))} aria-label="Adjust budget" />
          <div className="range-labels"><span>₱30K</span><span>₱250K</span></div>

          <div className="question-block">
            <span className="question-label"><b>02</b> What are you looking for?</span>
            <div className="segmented" role="group" aria-label="Device type"><button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}><span aria-hidden="true">▣</span> Build a PC</button><button className={device === "laptop" ? "active" : ""} onClick={() => setDevice("laptop")}><span aria-hidden="true">▬</span> Find a laptop</button></div>
          </div>
          <div className="question-block">
            <span className="question-label"><b>03</b> What will you use it for?</span>
            <div className="use-grid">{useCases.map((item) => <button key={item.id} className={useCase === item.id ? "use-case active" : "use-case"} onClick={() => setUseCase(item.id)}><small>{item.eyebrow}</small><span>{item.name}</span><i aria-hidden="true">{useCase === item.id ? "●" : "○"}</i></button>)}</div>
          </div>
          <button className="primary-button" onClick={() => document.getElementById("recommendation")?.scrollIntoView({ behavior: "smooth" })}>See my recommendation <span>↘</span></button>
          <p className="helper-text">No sign-up needed · Recommendations update instantly</p>
        </div>
      </section>

      <section className="trust-strip" id="shops" aria-label="Compared shops"><span>PRICES COMPARED FROM</span><strong>DYNAQUEST</strong><strong>PC HUB</strong><strong>EASYPC</strong><strong>VILLMAN</strong><small>Indicative listings—verify availability at checkout</small></section>

      <section className="recommendation" id="recommendation">
        <div className="section-intro">
          <div><p className="kicker"><span /> YOUR MATCH</p><h2>{device === "desktop" ? selectedBuild.label : selectedLaptop.name}</h2><p>{device === "desktop" ? selectedBuild.note : selectedLaptop.detail}</p></div>
          <div className="match-score"><span>{selectedBuild.tier}</span><strong>{percentage}%</strong><small>of budget used</small></div>
        </div>
        <div className="results-layout">
          <div className="results-main">
            {device === "desktop" ? <div className="parts-table">
              <div className="table-head"><span>Component</span><span>Lowest listing</span></div>
              {selectedBuild.parts.map((part, index) => <article className="part-row" key={`${part.category}-${part.name}`}><span className="part-number">{String(index + 1).padStart(2, "0")}</span><div className="part-copy"><small>{part.category}</small><h3>{part.name}</h3><p>{part.detail}</p></div><div className="shop-price"><small>{part.shop}</small><strong>{peso.format(part.price)}</strong><span>Best listed price</span></div></article>)}
            </div> : <div className="laptop-results">
              {laptopData[useCase].map((laptop) => { const isMatch = laptop.name === selectedLaptop.name; return <article className={isMatch ? "laptop-card selected" : "laptop-card"} key={laptop.name}><div className="laptop-top"><span>{laptop.badge}</span>{isMatch && <b>YOUR MATCH</b>}</div><div className="laptop-visual"><span>BUILDWISE SELECT</span><i>/////</i></div><h3>{laptop.name}</h3><p className="specs">{laptop.specs}</p><p>{laptop.detail}</p><div className="laptop-price"><span>{laptop.shop}</span><strong>{peso.format(laptop.price)}</strong></div></article>; })}
            </div>}
          </div>
          <aside className="summary-card">
            <p>BUILD SUMMARY</p><div className="summary-total"><span>Estimated total</span><strong>{peso.format(recommendationTotal)}</strong></div><div className="spend-track"><i style={{ width: `${percentage}%` }} /></div><div className="summary-line"><span>Your budget</span><b>{peso.format(budget)}</b></div><div className={remaining >= 0 ? "summary-line positive" : "summary-line negative"}><span>{remaining >= 0 ? "Budget left" : "Over budget"}</span><b>{peso.format(Math.abs(remaining))}</b></div>
            <div className="compatibility"><span>✓</span><div><strong>{device === "desktop" ? "Parts are compatible" : "Budget matched"}</strong><small>{device === "desktop" ? "Power, socket, and size checked" : "Best option within your range"}</small></div></div>
            <button className="copy-button" onClick={copyRecommendation}>{copied ? "Copied to clipboard ✓" : "Copy recommendation"}</button>
            <button className="reset-button" onClick={() => { setBudget(75000); setUseCase("architecture"); setDevice("desktop"); }}>Start over</button>
            <p className="fine-print">Prices are indicative sample listings and may change. Always confirm final pricing and stock with the retailer.</p>
          </aside>
        </div>
      </section>

      <footer><a className="brand" href="#top"><span className="brand-mark">B</span><span>BUILDWISE</span></a><p>Better builds begin with a better budget.</p><span>Made for Filipino builders · 2026</span></footer>
    </main>
  );
}
