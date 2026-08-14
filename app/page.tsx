"use client";

import { useMemo, useState } from "react";
import {
  Box, BriefcaseBusiness, Check, CircuitBoard, Clapperboard, Copy, Cpu,
  DraftingCompass, ExternalLink, Fan, Gamepad2, HardDrive, Laptop, MemoryStick,
  Monitor, ListFilter, Moon, Search, Store, Sun, X, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type UseCase = "gaming" | "architecture" | "editing" | "work";
type Device = "desktop" | "laptop";
type Part = { category: string; name: string; shop: string; price: number };
type Build = { tier: string; label: string; note: string; parts: Part[] };
type LaptopPick = { name: string; specs: string; shop: string; price: number };

const part = (category: string, name: string, shop: string, price: number): Part => ({ category, name, shop, price });
const totalOf = (build: Build) => build.parts.reduce((sum, item) => sum + item.price, 0);
const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
const shopUrls: Record<string, string> = {
  "DynaQuest": "https://dynaquestpc.com/",
  "EasyPC": "https://easypc.com.ph/",
  "PCHub": "https://pchubonline.com/",
  "VillMan": "https://villman.com/",
  "PC Corner": "https://pccorner.com.ph/",
  "PC Express": "https://pcx.com.ph/",
  "Gigahertz": "https://www.gigahertz.com.ph/",
  "Beyond the Box": "https://beyondthebox.ph/",
  "Lenovo Store": "https://www.lenovo.com/ph/en/",
};

function laptopSearchUrl(item: LaptopPick) {
  const query = encodeURIComponent(item.name);
  const searches: Record<string, string> = {
    "PC Express": `https://pcx.com.ph/search?q=${query}`,
    "VillMan": `https://villman.com/search?q=${query}`,
    "Gigahertz": `https://www.gigahertz.com.ph/search?q=${query}`,
    "Beyond the Box": `https://beyondthebox.ph/search?q=${query}`,
    "Lenovo Store": `https://www.lenovo.com/ph/en/search?text=${query}`,
  };
  return searches[item.shop] ?? `${shopUrls[item.shop]}search?q=${query}`;
}

function laptopSpecRows(item: LaptopPick) {
  let memoryFound = false;
  return item.specs.split(" · ").map((value) => {
    if (/RTX|GeForce|Radeon/i.test(value)) {
      const brandedGpu = /^NVIDIA|^AMD/i.test(value)
        ? value
        : /Radeon/i.test(value)
          ? `AMD ${value}`
          : /GeForce/i.test(value)
            ? `NVIDIA ${value}`
            : `NVIDIA GeForce ${value}`;
      return { label: "GPU", value: brandedGpu, icon: CircuitBoard };
    }
    if (/^(8|16|24|32|64|128)GB\b/i.test(value) && !memoryFound) {
      memoryFound = true;
      return { label: "RAM", value, icon: MemoryStick };
    }
    if (/\b(256GB|512GB|1TB|2TB|4TB)\b/i.test(value)) return { label: "Storage", value, icon: HardDrive };
    if (/inch|OLED|Hz/i.test(value)) return { label: "Display", value, icon: Monitor };
    const brandedCpu = /^Intel|^AMD|^Apple/i.test(value)
      ? value
      : /^Ryzen/i.test(value)
        ? `AMD ${value}`
        : /^(Core|Ultra)/i.test(value)
          ? `Intel ${value}`
          : /^M\d/i.test(value)
            ? `Apple ${value}`
            : value;
    return { label: "CPU", value: brandedCpu, icon: Cpu };
  });
}

const purposes: { id: UseCase; label: string; note: string; icon: LucideIcon }[] = [
  { id: "gaming", label: "Gaming", note: "High FPS", icon: Gamepad2 },
  { id: "architecture", label: "Architecture", note: "CAD + 3D", icon: DraftingCompass },
  { id: "editing", label: "Content", note: "Edit + render", icon: Clapperboard },
  { id: "work", label: "Work & study", note: "Everyday", icon: BriefcaseBusiness },
];

const budgetRanges = [
  { id: "entry", label: "₱30–50K", min: 30000, max: 50000 },
  { id: "value", label: "₱50–80K", min: 50000, max: 80000 },
  { id: "mid", label: "₱80–120K", min: 80000, max: 120000 },
  { id: "high", label: "₱120–180K", min: 120000, max: 180000 },
  { id: "premium", label: "₱180–250K", min: 180000, max: 250000 },
  { id: "ultra", label: "₱250–400K", min: 250000, max: 400000 },
];

const starter = [
  part("Motherboard", "ASUS Prime B650M-K", "PC Corner", 6998),
  part("Memory", "TeamGroup 32GB DDR5", "EasyPC", 5295),
  part("Storage", "WD Blue SN580 1TB", "DynaQuest", 3895),
  part("Power", "Cooler Master MWE 650", "PCHub", 3595),
  part("Case", "Tecware Infinity M2", "EasyPC", 2895),
];
const balanced = [
  part("Motherboard", "MSI B850 Gaming Plus WiFi", "DynaQuest", 13395),
  part("Memory", "G.Skill Flare X5 32GB", "PCHub", 6395),
  part("Storage", "WD Black SN850X 1TB", "VillMan", 5695),
  part("Power", "Corsair RM750e Gold", "DynaQuest", 5995),
  part("Case", "Montech Air 903 Max", "EasyPC", 4295),
  part("Cooling", "Thermalright Peerless Assassin", "DynaQuest", 2495),
];
const pro = [
  part("Motherboard", "ASUS ROG Strix B850-G WiFi", "PC Corner", 16198),
  part("Memory", "Kingston Fury 64GB DDR5", "PCHub", 11995),
  part("Storage", "Samsung 990 Pro 2TB", "VillMan", 8995),
  part("Power", "Seasonic Focus GX-850", "DynaQuest", 7995),
  part("Case", "Fractal North", "DynaQuest", 7995),
  part("Cooling", "Arctic Liquid Freezer III", "PCHub", 6495),
];

const builds: Record<UseCase, Build[]> = {
  gaming: [
    { tier: "Starter", label: "1080p Gaming", note: "Current AM5 value build for smooth 1080p play.", parts: [part("Processor", "AMD Ryzen 5 9600X", "DynaQuest", 12265), part("Graphics", "MSI RTX 5060 8GB", "EasyPC", 24030), ...starter] },
    { tier: "Balanced", label: "1440p Gaming", note: "High-refresh 1440p performance with an RTX 5070.", parts: [part("Processor", "AMD Ryzen 7 9700X", "PC Corner", 17898), part("Graphics", "Gigabyte RTX 5070 12GB", "EasyPC", 46811), ...balanced] },
    { tier: "High-end", label: "4K Gaming", note: "A focused 4K build with more VRAM and cooling headroom.", parts: [part("Processor", "AMD Ryzen 9 9900X", "PC Corner", 23198), part("Graphics", "Gigabyte RTX 5070 Ti 16GB", "DynaQuest", 66785), ...pro] },
  ],
  architecture: [
    { tier: "Starter", label: "CAD Workstation", note: "For AutoCAD, SketchUp, and student visualization.", parts: [part("Processor", "AMD Ryzen 5 9600X", "DynaQuest", 12265), part("Graphics", "MSI RTX 5060 8GB", "EasyPC", 24030), ...starter] },
    { tier: "Balanced", label: "3D Workstation", note: "More CPU and GPU power for Revit, Rhino, and Lumion.", parts: [part("Processor", "AMD Ryzen 7 9700X", "PC Corner", 17898), part("Graphics", "Gigabyte RTX 5070 12GB", "EasyPC", 46811), ...balanced] },
    { tier: "High-end", label: "Render Workstation", note: "64GB workstation for large BIM and 4K scenes.", parts: [part("Processor", "AMD Ryzen 9 9900X", "PC Corner", 23198), part("Graphics", "MSI RTX 5070 Ti 16GB", "EasyPC", 63105), ...pro] },
  ],
  editing: [
    { tier: "Starter", label: "Creator Build", note: "Fast 1080p editing and hardware-accelerated exports.", parts: [part("Processor", "AMD Ryzen 5 9600X", "DynaQuest", 12265), part("Graphics", "MSI RTX 5060 8GB", "EasyPC", 24030), ...starter] },
    { tier: "Balanced", label: "4K Editing Build", note: "A responsive timeline, current NVENC, and fast storage.", parts: [part("Processor", "AMD Ryzen 7 9700X", "PC Corner", 17898), part("Graphics", "Gigabyte RTX 5070 12GB", "EasyPC", 46811), ...balanced] },
    { tier: "High-end", label: "Studio Build", note: "For heavy 4K/8K edits, motion, and 3D compositing.", parts: [part("Processor", "AMD Ryzen 9 9900X", "PC Corner", 23198), part("Graphics", "Gigabyte RTX 5070 Ti 16GB", "DynaQuest", 66785), ...pro] },
  ],
  work: [
    { tier: "Starter", label: "Everyday Desktop", note: "Quiet and quick without an unnecessary graphics card.", parts: [part("Processor", "AMD Ryzen 7 8700G", "PC Corner", 16698), part("Motherboard", "ASUS Prime B650M-K", "PC Corner", 6998), part("Memory", "TeamGroup 16GB DDR5", "EasyPC", 3295), part("Storage", "WD Blue SN580 1TB", "DynaQuest", 3895), part("Power", "FSP HV Pro 550", "PCHub", 2495), part("Case", "Tecware Infinity M2", "EasyPC", 2895)] },
    { tier: "Balanced", label: "Productivity Desktop", note: "More memory and CPU headroom for demanding multitasking.", parts: [part("Processor", "AMD Ryzen 7 9700X", "PC Corner", 17898), part("Graphics", "MSI RTX 5050 8GB", "DynaQuest", 20550), ...balanced] },
    { tier: "High-end", label: "Professional Desktop", note: "Premium performance and longevity for heavy workloads.", parts: [part("Processor", "AMD Ryzen 9 9900X", "PC Corner", 23198), part("Graphics", "MSI RTX 5060 8GB", "EasyPC", 24030), ...pro] },
  ],
};

const rangeLaptopCatalog: LaptopPick[] = [
  { name: "Lenovo IdeaPad Slim 3 15IRU8", specs: "Core i3-1315U · 8GB · 512GB · 15.6-inch FHD", shop: "PC Express", price: 34995 },
  { name: "Acer Nitro V ANV15-51", specs: "Core i5-13420H · RTX 2050 · 8GB · 512GB · 15.6-inch 144Hz", shop: "PC Express", price: 42299 },
  { name: "Acer Aspire 3 A315-59", specs: "Core i7-1255U · 16GB · 512GB · 15.6-inch FHD", shop: "PC Express", price: 47999 },
  { name: "Gigabyte Gaming A16 RTX 4050", specs: "Core i5 · RTX 4050 · 16GB · 512GB · 16-inch 165Hz", shop: "PC Express", price: 59995 },
  { name: "ASUS TUF Gaming F16", specs: "Core 5 · RTX 4050 · 16GB · 512GB · 16-inch 144Hz", shop: "PC Express", price: 73995 },
  { name: "Gigabyte Gaming A16 RTX 5050", specs: "Ryzen 7 · RTX 5050 · 16GB · 1TB · 16-inch 165Hz", shop: "PC Express", price: 79995 },
  { name: "ASUS Zenbook 14 UM3406", specs: "Ryzen 7 · 16GB · 1TB · 14-inch OLED", shop: "PC Express", price: 82995 },
  { name: "MSI Katana 15 HX", specs: "Core i7 · RTX 5070 · 16GB · 1TB · 15.6-inch 165Hz", shop: "PC Express", price: 97995 },
  { name: "MSI Crosshair A16 HX RTX 5070", specs: "Ryzen 7 · RTX 5070 · 16GB · 512GB · 16-inch 165Hz", shop: "PC Express", price: 99995 },
  { name: "MSI Vector 16 HX AI", specs: "Core Ultra 9-275HX · RTX 5080 · 16GB · 1TB · 16-inch 240Hz", shop: "PC Express", price: 158995 },
  { name: "Dell Alienware 16 Aurora", specs: "Core 9 · RTX 5070 · 32GB · 1TB · 16-inch 240Hz", shop: "PC Express", price: 159990 },
  { name: "ASUS ROG Flow Z13", specs: "Ryzen AI MAX · 32GB · 1TB · 13-inch 180Hz", shop: "PC Express", price: 174995 },
  { name: "ASUS ROG Strix G16 RTX 5080", specs: "Core Ultra 9-275HX · RTX 5080 · 32GB · 1TB · 16-inch 240Hz", shop: "PC Express", price: 219995 },
  { name: "HP Omen Max 16", specs: "Core Ultra 9-275HX · RTX 5080 · 32GB · 1TB · 16-inch 240Hz", shop: "PC Express", price: 229990 },
  { name: "Acer Predator Helios 18", specs: "Core Ultra 9-275HX · RTX 5080 · 32GB · 2TB · 18-inch 250Hz", shop: "PC Express", price: 239999 },
  { name: "ASUS ROG Strix 16", specs: "Core Ultra 9 · RTX 5080 · 32GB · 2TB · 16-inch 240Hz", shop: "PC Express", price: 259995 },
  { name: "Lenovo Legion Pro 7", specs: "Core Ultra 9 · RTX 5080 · 64GB · 1TB · 16-inch 240Hz", shop: "PC Express", price: 275995 },
  { name: "ASUS ROG Strix 18", specs: "Core Ultra 9 · RTX 5090 · 64GB · 2TB · 18-inch 240Hz", shop: "PC Express", price: 363995 },
];

const laptops: Record<UseCase, LaptopPick[]> = {
  gaming: [
    { name: "Acer Nitro V 15", specs: "Core i5 · RTX 4050 · 16GB · 512GB", shop: "PC Express", price: 55999 },
    { name: "Lenovo LOQ 15", specs: "Core i5 · RTX 4050 · 16GB · 512GB", shop: "VillMan", price: 62995 },
    { name: "Gigabyte Gaming A16", specs: "Core i7 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 87995 },
    { name: "MSI Crosshair A16 HX", specs: "Ryzen 7 · RTX 5070 · 16GB · 512GB", shop: "PC Express", price: 99995 },
    { name: "ASUS Gaming V16", specs: "Core 7 · RTX 5070 · 16GB · 512GB", shop: "PC Express", price: 104995 },
    { name: "ROG Strix G16", specs: "Ultra 9 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 174995 },
    ...rangeLaptopCatalog,
  ],
  architecture: [
    { name: "ASUS Vivobook Pro 15", specs: "Ryzen 7 · RTX 4050 · 16GB · 1TB OLED", shop: "VillMan", price: 65995 },
    { name: "Lenovo LOQ 15", specs: "Core i7 · RTX 4060 · 24GB · 1TB", shop: "Gigahertz", price: 82995 },
    { name: "Acer Predator Helios Neo 16", specs: "Ultra 7 · RTX 5060 · 16GB · 512GB", shop: "VillMan", price: 104999 },
    { name: "HP Omen 16", specs: "Ryzen AI 9 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 116990 },
    { name: "Lenovo Legion 5", specs: "Ryzen AI 7 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 123995 },
    { name: "ROG Zephyrus G14", specs: "Ryzen AI 9 · RTX 5070 · 32GB · 1TB OLED", shop: "PC Express", price: 179995 },
    ...rangeLaptopCatalog,
  ],
  editing: [
    { name: "ASUS Vivobook Pro 15", specs: "Ryzen 7 · RTX 4050 · 16GB · 1TB OLED", shop: "VillMan", price: 65995 },
    { name: "MacBook Air 13 M4", specs: "Apple M4 · 16GB · 512GB", shop: "Beyond the Box", price: 74990 },
    { name: "Acer Predator Helios Neo 16", specs: "Ultra 7 · RTX 5060 · 16GB · 512GB OLED", shop: "VillMan", price: 104999 },
    { name: "HP Omen 16", specs: "Ryzen AI 9 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 116990 },
    { name: "Lenovo Legion 5", specs: "Ryzen AI 7 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 123995 },
    { name: "ROG Zephyrus G14", specs: "Ryzen AI 9 · RTX 5070 · 32GB · 1TB OLED", shop: "PC Express", price: 179995 },
    ...rangeLaptopCatalog,
  ],
  work: [
    { name: "Lenovo IdeaPad Slim 3", specs: "Ryzen 5 · 16GB · 512GB", shop: "Gigahertz", price: 34995 },
    { name: "ASUS Vivobook 15", specs: "Core 5 · 16GB · 512GB", shop: "VillMan", price: 44995 },
    { name: "Lenovo IdeaPad Slim 5", specs: "Ryzen 7 · 16GB · 1TB", shop: "Gigahertz", price: 54995 },
    { name: "ASUS Zenbook 14 OLED", specs: "Core Ultra 5 · 16GB · 1TB", shop: "VillMan", price: 64995 },
    { name: "MacBook Air 13 M4", specs: "Apple M4 · 16GB · 512GB", shop: "Beyond the Box", price: 74990 },
    { name: "Lenovo ThinkPad X1 Carbon", specs: "Core Ultra 7 · 32GB · 1TB", shop: "Lenovo Store", price: 119995 },
    ...rangeLaptopCatalog,
  ],
};

function PartIcon({ category }: { category: string }) {
  const icons: Record<string, LucideIcon> = { Processor: Cpu, Graphics: CircuitBoard, Motherboard: CircuitBoard, Memory: MemoryStick, Storage: HardDrive, Power: Zap, Case: Box, Cooling: Fan };
  const Icon = icons[category] ?? Box;
  return <Icon size={17} strokeWidth={1.7} aria-hidden="true" />;
}

export default function Home() {
  const [device, setDevice] = useState<Device>("desktop");
  const [useCase, setUseCase] = useState<UseCase>("architecture");
  const [dark, setDark] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedRange, setSelectedRange] = useState("value");
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopPick | null>(null);

  const activeRange = budgetRanges.find((range) => range.id === selectedRange) ?? budgetRanges[1];
  const budget = activeRange.max;
  const selectedBuild = useMemo(() => [...builds[useCase]].reverse().find((item) => totalOf(item) <= budget) ?? builds[useCase][0], [budget, useCase]);
  const shortlist = useMemo(() => {
    const uniqueOptions = laptops[useCase].filter((item, index, options) => options.findIndex((candidate) => candidate.name === item.name && candidate.price === item.price) === index);
    const inRanges = uniqueOptions.filter((item) => item.price >= activeRange.min && item.price <= activeRange.max);
    const ranked = [...inRanges].sort((a, b) => {
      return Math.abs(budget - a.price) - Math.abs(budget - b.price);
    });
    return ranked.slice(0, 3);
  }, [activeRange, budget, useCase]);
  const buildTotal = totalOf(selectedBuild);

  const copyResults = async () => {
    const text = device === "desktop"
      ? `${selectedBuild.label} - ${peso.format(buildTotal)}\n${selectedBuild.parts.map((item) => `${item.category}: ${item.name} - ${peso.format(item.price)} at ${item.shop}`).join("\n")}`
      : `Laptop shortlist for ${activeRange.label}\n${shortlist.map((item) => `${item.name} - ${peso.format(item.price)} at ${item.shop}`).join("\n")}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className={dark ? "app dark" : "app"}>
      <header className="header">
        <div className="brand"><span>B</span><strong>BUILDWISE</strong></div>
        <p>Shops: DynaQuest, EasyPC, PCHub, VillMan, PC Corner, PC Express, Gigahertz, Beyond the Box &amp; Lenovo · Updated August 2026</p>
        <button className="theme" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode" aria-pressed={dark}>{dark ? <Moon size={16} /> : <Sun size={16} />}<span>Dark mode</span><i className={dark ? "on" : ""}><b /></i></button>
      </header>

      <div className={`layout ${device === "laptop" && selectedLaptop ? "with-detail" : ""}`}>
        <aside className="sidebar">
          <section className="control ranges-control">
            <div className="range-title"><span><ListFilter size={15} /> Price range</span><small>Choose one</small></div>
            <div className="range-options" role="group" aria-label="Select a price range">
              {budgetRanges.map((range) => {
                const active = selectedRange === range.id;
                return <button key={range.id} className={active ? "active" : ""} aria-pressed={active} onClick={() => { setSelectedRange(range.id); setSelectedLaptop(null); }}>{active && <Check size={12} />}{range.label}</button>;
              })}
            </div>
          </section>

          <section className="control device-control">
            <label><Monitor size={15} /> Device</label>
            <div className="device" role="group" aria-label="Device type"><button className={device === "desktop" ? "active" : ""} onClick={() => { setDevice("desktop"); setSelectedLaptop(null); }} aria-label="Show desktop build"><Monitor size={17} /><span>Desktop</span></button><button className={device === "laptop" ? "active" : ""} onClick={() => setDevice("laptop")} aria-label="Show laptop shortlist"><Laptop size={17} /><span>Laptop</span></button></div>
          </section>

          <section className="control grow">
            <label><BriefcaseBusiness size={15} /> Use case</label>
            <div className="uses">{purposes.map(({ id, label, note, icon: Icon }) => <button key={id} className={useCase === id ? "active" : ""} onClick={() => { setUseCase(id); setSelectedLaptop(null); }}><Icon size={17} /><span><b>{label}</b><small>{note}</small></span>{useCase === id && <Check size={14} />}</button>)}</div>
          </section>
        </aside>

        <section className="results" aria-live="polite">
          <div className="results-head">
            <div><h2>{device === "desktop" ? selectedBuild.label : "Laptop shortlist"}</h2>{device === "desktop" && <p>{selectedBuild.note}</p>}</div>
            <div className="results-actions">
              <button className="copy-button" onClick={copyResults}><Copy size={15} /><span>{copied ? "Copied" : "Copy"}</span></button>
            </div>
          </div>

          {device === "desktop" ? (
            <div className="desktop-result" key={`${useCase}-${selectedBuild.label}`}>
              <div className="build-summary"><div><span>{selectedBuild.tier}</span><b>{selectedBuild.parts.length} compatible parts</b></div><div><small>Estimated total</small><strong>{peso.format(buildTotal)}</strong><span>{budget >= buildTotal ? `${peso.format(budget - buildTotal)} left` : `${peso.format(buildTotal - budget)} over`}</span></div></div>
              <div className="parts">{selectedBuild.parts.map((item) => <article key={`${item.category}-${item.name}`}><i><PartIcon category={item.category} /></i><div><small>{item.category}</small><h3>{item.name}</h3><a href={shopUrls[item.shop]} target="_blank" rel="noreferrer" aria-label={`Open ${item.shop} store`}><Store size={11} /> {item.shop}</a></div><strong>{peso.format(item.price)}</strong></article>)}</div>
            </div>
          ) : (
            <div className="laptop-list" key={`${useCase}-${budget}`}>
              {shortlist.map((item, index) => {
                const fits = item.price >= activeRange.min && item.price <= activeRange.max;
                const selected = selectedLaptop?.name === item.name;
                return <article key={item.name} className={`${index === 0 ? "best" : ""} ${selected ? "selected" : ""}`} role="button" tabIndex={0} aria-label={`View details for ${item.name}`} onClick={() => setSelectedLaptop(item)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedLaptop(item); } }}><div className="laptop-mark"><Laptop size={24} /><span>{index === 0 ? "Best match" : `Option ${index + 1}`}</span></div><div className="laptop-copy"><h3>{item.name}</h3><p>{item.specs}</p><a href={laptopSearchUrl(item)} target="_blank" rel="noreferrer" aria-label={`Search ${item.name} at ${item.shop}`} onClick={(event) => event.stopPropagation()}><Search size={12} /> {item.shop}</a></div><div className="laptop-price"><strong>{peso.format(item.price)}</strong><span className={fits ? "fits" : "stretch"}>{fits ? <Check size={11} /> : null}{fits ? "In selected range" : "Closest match"}</span></div></article>;
              })}
            </div>
          )}
        </section>

        {device === "laptop" && selectedLaptop && (
          <aside className="detail-sidebar" aria-label={`${selectedLaptop.name} details`}>
            <div className="detail-head"><span>Laptop details</span><button onClick={() => setSelectedLaptop(null)} aria-label="Close laptop details"><X size={17} /></button></div>
            <div className="laptop-visual"><Laptop size={68} strokeWidth={1.25} /><span>{useCase === "architecture" ? "CAD + 3D ready" : purposes.find((purpose) => purpose.id === useCase)?.note}</span></div>
            <section className="detail-name"><small>Selected laptop</small><h2>{selectedLaptop.name}</h2><strong>{peso.format(selectedLaptop.price)}</strong></section>
            <section className="detail-specs"><small>Specifications</small><ul>{laptopSpecRows(selectedLaptop).map(({ label, value, icon: Icon }) => <li key={`${label}-${value}`}><i><Icon size={16} strokeWidth={1.7} /></i><span><small>{label}</small><b>{value}</b></span></li>)}</ul></section>
            <a className="detail-shop" href={laptopSearchUrl(selectedLaptop)} target="_blank" rel="noreferrer"><Search size={15} /><span>Search at {selectedLaptop.shop}</span><ExternalLink size={14} /></a>
          </aside>
        )}
      </div>
    </main>
  );
}
