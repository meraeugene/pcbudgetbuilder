"use client";

import { useMemo, useState } from "react";
import {
  Box, BriefcaseBusiness, Check, CircuitBoard, Clapperboard, Copy, Cpu,
  DraftingCompass, Fan, Gamepad2, HardDrive, Laptop, MemoryStick, Monitor,
  Moon, PhilippinePeso, SlidersHorizontal, Store, Sun, Zap,
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

const purposes: { id: UseCase; label: string; note: string; icon: LucideIcon }[] = [
  { id: "gaming", label: "Gaming", note: "High FPS", icon: Gamepad2 },
  { id: "architecture", label: "Architecture", note: "CAD + 3D", icon: DraftingCompass },
  { id: "editing", label: "Content", note: "Edit + render", icon: Clapperboard },
  { id: "work", label: "Work & study", note: "Everyday", icon: BriefcaseBusiness },
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

const laptops: Record<UseCase, LaptopPick[]> = {
  gaming: [
    { name: "Acer Nitro V 15", specs: "Core i5 · RTX 4050 · 16GB · 512GB", shop: "PC Express", price: 55999 },
    { name: "Lenovo LOQ 15", specs: "Core i5 · RTX 4050 · 16GB · 512GB", shop: "VillMan", price: 62995 },
    { name: "Gigabyte Gaming A16", specs: "Core i7 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 87995 },
    { name: "MSI Crosshair A16 HX", specs: "Ryzen 7 · RTX 5070 · 16GB · 512GB", shop: "PC Express", price: 99995 },
    { name: "ASUS Gaming V16", specs: "Core 7 · RTX 5070 · 16GB · 512GB", shop: "PC Express", price: 104995 },
    { name: "ROG Strix G16", specs: "Ultra 9 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 174995 },
  ],
  architecture: [
    { name: "ASUS Vivobook Pro 15", specs: "Ryzen 7 · RTX 4050 · 16GB · 1TB OLED", shop: "VillMan", price: 65995 },
    { name: "Lenovo LOQ 15", specs: "Core i7 · RTX 4060 · 24GB · 1TB", shop: "Gigahertz", price: 82995 },
    { name: "Acer Predator Helios Neo 16", specs: "Ultra 7 · RTX 5060 · 16GB · 512GB", shop: "VillMan", price: 104999 },
    { name: "HP Omen 16", specs: "Ryzen AI 9 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 116990 },
    { name: "Lenovo Legion 5", specs: "Ryzen AI 7 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 123995 },
    { name: "ROG Zephyrus G14", specs: "Ryzen AI 9 · RTX 5070 · 32GB · 1TB OLED", shop: "PC Express", price: 179995 },
  ],
  editing: [
    { name: "ASUS Vivobook Pro 15", specs: "Ryzen 7 · RTX 4050 · 16GB · 1TB OLED", shop: "VillMan", price: 65995 },
    { name: "MacBook Air 13 M4", specs: "Apple M4 · 16GB · 512GB", shop: "Beyond the Box", price: 74990 },
    { name: "Acer Predator Helios Neo 16", specs: "Ultra 7 · RTX 5060 · 16GB · 512GB OLED", shop: "VillMan", price: 104999 },
    { name: "HP Omen 16", specs: "Ryzen AI 9 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 116990 },
    { name: "Lenovo Legion 5", specs: "Ryzen AI 7 · RTX 5070 · 16GB · 1TB", shop: "PC Express", price: 123995 },
    { name: "ROG Zephyrus G14", specs: "Ryzen AI 9 · RTX 5070 · 32GB · 1TB OLED", shop: "PC Express", price: 179995 },
  ],
  work: [
    { name: "Lenovo IdeaPad Slim 3", specs: "Ryzen 5 · 16GB · 512GB", shop: "Gigahertz", price: 34995 },
    { name: "ASUS Vivobook 15", specs: "Core 5 · 16GB · 512GB", shop: "VillMan", price: 44995 },
    { name: "Lenovo IdeaPad Slim 5", specs: "Ryzen 7 · 16GB · 1TB", shop: "Gigahertz", price: 54995 },
    { name: "ASUS Zenbook 14 OLED", specs: "Core Ultra 5 · 16GB · 1TB", shop: "VillMan", price: 64995 },
    { name: "MacBook Air 13 M4", specs: "Apple M4 · 16GB · 512GB", shop: "Beyond the Box", price: 74990 },
    { name: "Lenovo ThinkPad X1 Carbon", specs: "Core Ultra 7 · 32GB · 1TB", shop: "Lenovo Store", price: 119995 },
  ],
};

function PartIcon({ category }: { category: string }) {
  const icons: Record<string, LucideIcon> = { Processor: Cpu, Graphics: CircuitBoard, Motherboard: CircuitBoard, Memory: MemoryStick, Storage: HardDrive, Power: Zap, Case: Box, Cooling: Fan };
  const Icon = icons[category] ?? Box;
  return <Icon size={17} strokeWidth={1.7} aria-hidden="true" />;
}

export default function Home() {
  const [budget, setBudget] = useState(75000);
  const [device, setDevice] = useState<Device>("desktop");
  const [useCase, setUseCase] = useState<UseCase>("architecture");
  const [dark, setDark] = useState(true);
  const [copied, setCopied] = useState(false);

  const selectedBuild = useMemo(() => [...builds[useCase]].reverse().find((item) => totalOf(item) <= budget) ?? builds[useCase][0], [budget, useCase]);
  const shortlist = useMemo(() => [...laptops[useCase]].sort((a, b) => {
    const aOver = a.price > budget ? 1 : 0;
    const bOver = b.price > budget ? 1 : 0;
    if (aOver !== bOver) return aOver - bOver;
    return Math.abs(budget - a.price) - Math.abs(budget - b.price);
  }).slice(0, 3), [budget, useCase]);
  const buildTotal = totalOf(selectedBuild);

  const copyResults = async () => {
    const text = device === "desktop"
      ? `${selectedBuild.label} - ${peso.format(buildTotal)}\n${selectedBuild.parts.map((item) => `${item.category}: ${item.name} - ${peso.format(item.price)} at ${item.shop}`).join("\n")}`
      : `Laptop shortlist for ${peso.format(budget)}\n${shortlist.map((item) => `${item.name} - ${peso.format(item.price)} at ${item.shop}`).join("\n")}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className={dark ? "app dark" : "app"}>
      <header className="header">
        <div className="brand"><span>B</span><strong>BUILDWISE</strong></div>
        <p>PC and laptop picks in Philippine pesos</p>
        <button className="theme" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode" aria-pressed={dark}>{dark ? <Moon size={16} /> : <Sun size={16} />}<span>Dark mode</span><i className={dark ? "on" : ""}><b /></i></button>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="intro"><SlidersHorizontal size={19} /><div><h1>Build finder</h1><p>Set your budget and use case.</p></div></div>

          <section className="control">
            <label htmlFor="budget"><PhilippinePeso size={15} /> Budget</label>
            <div className="budget"><span>₱</span><input id="budget" type="number" min="30000" max="250000" step="1000" value={budget} onChange={(event) => setBudget(Math.max(30000, Math.min(250000, Number(event.target.value) || 30000)))} /></div>
            <input className="slider" type="range" min="30000" max="250000" step="1000" value={budget} onChange={(event) => setBudget(Number(event.target.value))} aria-label="Adjust budget" />
            <div className="limits"><span>₱30K</span><span>₱250K</span></div>
          </section>

          <section className="control">
            <label><Monitor size={15} /> Device</label>
            <div className="device" role="group" aria-label="Device type"><button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}><Monitor size={17} /> Desktop</button><button className={device === "laptop" ? "active" : ""} onClick={() => setDevice("laptop")}><Laptop size={17} /> Laptop</button></div>
          </section>

          <section className="control grow">
            <label><BriefcaseBusiness size={15} /> Use case</label>
            <div className="uses">{purposes.map(({ id, label, note, icon: Icon }) => <button key={id} className={useCase === id ? "active" : ""} onClick={() => setUseCase(id)}><Icon size={17} /><span><b>{label}</b><small>{note}</small></span>{useCase === id && <Check size={14} />}</button>)}</div>
          </section>

          <div className="shops"><Store size={14} /><span>Compared across DynaQuest, PC Hub, EasyPC, and VillMan</span></div>
        </aside>

        <section className="results" aria-live="polite">
          <div className="results-head">
            <div><span className="live"><i /> UPDATED LIVE</span><h2>{device === "desktop" ? selectedBuild.label : "Laptop shortlist"}</h2><p>{device === "desktop" ? selectedBuild.note : `Three options closest to your ${peso.format(budget)} budget.`}</p></div>
            <button onClick={copyResults}><Copy size={15} />{copied ? "Copied" : "Copy"}</button>
          </div>

          {device === "desktop" ? (
            <div className="desktop-result" key={`${useCase}-${selectedBuild.label}`}>
              <div className="build-summary"><div><span>{selectedBuild.tier}</span><b>{selectedBuild.parts.length} compatible parts</b></div><div><small>Estimated total</small><strong>{peso.format(buildTotal)}</strong><span>{budget >= buildTotal ? `${peso.format(budget - buildTotal)} left` : `${peso.format(buildTotal - budget)} over`}</span></div></div>
              <div className="parts">{selectedBuild.parts.map((item) => <article key={`${item.category}-${item.name}`}><i><PartIcon category={item.category} /></i><div><small>{item.category}</small><h3>{item.name}</h3><span><Store size={11} /> {item.shop}</span></div><strong>{peso.format(item.price)}</strong></article>)}</div>
            </div>
          ) : (
            <div className="laptop-list" key={`${useCase}-${budget}`}>
              {shortlist.map((item, index) => {
                const fits = item.price <= budget;
                return <article key={item.name} className={index === 0 ? "best" : ""}><div className="laptop-mark"><Laptop size={24} /><span>{index === 0 ? "Best match" : `Option ${index + 1}`}</span></div><div className="laptop-copy"><h3>{item.name}</h3><p>{item.specs}</p><span><Store size={12} /> {item.shop}</span></div><div className="laptop-price"><strong>{peso.format(item.price)}</strong><span className={fits ? "fits" : "stretch"}>{fits ? <Check size={11} /> : null}{fits ? "Within budget" : `+${peso.format(item.price - budget)}`}</span></div></article>;
              })}
              <div className="list-note"><Check size={15} /><span><b>Shortlist updates with every change</b><small>Models are ranked by budget fit and your selected use case.</small></span></div>
            </div>
          )}

          <footer><span>Indicative cash prices · Confirm stock before checkout</span><span>Refreshed August 2026</span></footer>
        </section>
      </div>
    </main>
  );
}
