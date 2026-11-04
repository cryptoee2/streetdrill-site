#!/usr/bin/env node
/*
 * streetdrill.app city landing pages: /cities/<slug>/ for every city in cities.mjs, the /cities/ hub that
 * lists them, and their <url> lines in sitemap.xml. Run it from anywhere, with no dependencies:
 *
 *   node scripts/city-pages/build.mjs
 *
 * The pages reuse the home page's markup and only the classes already in /styles.css, so a publish of the
 * main site (which rewrites styles.css) can't break them. Like every other page, they have no inline
 * script or style: the Content-Security-Policy allows scripts and styles from this site only.
 *
 * Slugs match the city packs (packs/<slug>.json): the city in lowercase, dashes for spaces, then the state.
 * To add a city, add it to cities.mjs and run this again. Every local fact in cities.mjs has its source
 * next to it; check a city's facts again before you change them.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CITIES } from './cities.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://streetdrill.app';
const CSP = "default-src 'self'; img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com; style-src 'self'; script-src 'self' https://www.googletagmanager.com; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

// The app's MaterialCommunityIcons glyphs, copied from the home page's cards (see /images/LICENSE-material-design-icons.txt).
const ICONS = {
  run: 'M17.06 2.02Q16.73 2.02 16.5 2.16L5.58 8.48L9.56 8.48L17.48 3.84Q17.86 3.66 17.95 3.26Q18.05 2.86 17.86 2.48Q17.58 2.02 17.06 2.02ZM15.98 8.02L15.98 9.98L3 9.98Q2.16 9.98 1.57 10.57Q0.98 11.16 0.98 12L2.02 12L2.02 15L0.98 15L0.98 18.98L3 18.98Q3 20.25 3.87 21.12Q4.73 21.98 6 21.98Q7.27 21.98 8.13 21.12Q9 20.25 9 18.98L15 18.98Q15 20.25 15.87 21.12Q16.73 21.98 18 21.98Q19.27 21.98 20.13 21.12Q21 20.25 21 18.98L23.02 18.98L23.02 12.52L19.5 8.02L15.98 8.02ZM18 9.52L18.98 9.52L21.52 12.52L21.52 13.5L18 13.5L18 9.52ZM3.98 12L6.98 12L6.98 15L3.98 15L3.98 12ZM9 12L12 12L12 15L9 15L9 12ZM14.02 12L15.98 12L15.98 15L14.02 15L14.02 12ZM6 17.48Q6.61 17.48 7.05 17.93Q7.5 18.38 7.5 19.01Q7.5 19.64 7.05 20.06Q6.61 20.48 6 20.48Q5.39 20.48 4.95 20.06Q4.5 19.64 4.5 19.01Q4.5 18.38 4.95 17.93Q5.39 17.48 6 17.48ZM18 17.48Q18.61 17.48 19.05 17.93Q19.5 18.38 19.5 19.01Q19.5 19.64 19.05 20.06Q18.61 20.48 18 20.48Q17.39 20.48 16.95 20.06Q16.5 19.64 16.5 19.01Q16.5 18.38 16.95 17.93Q17.39 17.48 18 17.48Z',
  dispatch: 'M9 2.02Q8.58 2.02 8.3 2.3Q8.02 2.58 8.02 3L8.02 20.02Q8.02 20.81 8.6 21.4Q9.19 21.98 9.98 21.98L15 21.98Q15.84 21.98 16.43 21.4Q17.02 20.81 17.02 20.02L17.02 9Q17.02 8.16 16.43 7.57Q15.84 6.98 15 6.98L9.98 6.98L9.98 3Q9.98 2.58 9.7 2.3Q9.42 2.02 9 2.02ZM9.98 9L15 9L15 12.98L9.98 12.98L9.98 9Z',
  blocks: 'M3.98 17.02L3.98 9L2.02 9L2.02 6.98L6 6.98L6 17.02L3.98 17.02ZM21.98 15Q21.98 15.84 21.4 16.43Q20.81 17.02 20.02 17.02L15.98 17.02L15.98 15L20.02 15L20.02 12.98L18 12.98L18 11.02L20.02 11.02L20.02 9L15.98 9L15.98 6.98L20.02 6.98Q20.81 6.98 21.4 7.57Q21.98 8.16 21.98 9L21.98 10.5Q21.98 11.11 21.56 11.55Q21.14 12 20.48 12Q21.14 12 21.56 12.45Q21.98 12.89 21.98 13.5L21.98 15ZM14.02 15L14.02 17.02L8.02 17.02L8.02 12.98Q8.02 12.19 8.6 11.6Q9.19 11.02 9.98 11.02L12 11.02L12 9L8.02 9L8.02 6.98L12 6.98Q12.84 6.98 13.43 7.57Q14.02 8.16 14.02 9L14.02 11.02Q14.02 11.81 13.43 12.4Q12.84 12.98 12 12.98L9.98 12.98L9.98 15L14.02 15Z',
  cross: 'M11.02 12L3.52 12L6 9.52L3.52 6.98L11.02 6.98L11.02 3L12 2.02L12.98 3L12.98 6.98L18 6.98L20.48 9.52L18 12L12.98 12L12.98 20.02Q13.83 20.02 14.41 20.6Q15 21.19 15 21.98L9 21.98Q9 21.19 9.59 20.6Q10.17 20.02 11.02 20.02L11.02 12Z',
  lineup: 'M6.98 12.98L6.98 11.02L21 11.02L21 12.98L6.98 12.98ZM6.98 18.98L6.98 17.02L21 17.02L21 18.98L6.98 18.98ZM6.98 6.98L6.98 5.02L21 5.02L21 6.98L6.98 6.98ZM3 8.02L3 5.02L2.02 5.02L2.02 3.98L3.98 3.98L3.98 8.02L3 8.02ZM2.02 17.02L2.02 15.98L5.02 15.98L5.02 20.02L2.02 20.02L2.02 18.98L3.98 18.98L3.98 18.52L3 18.52L3 17.48L3.98 17.48L3.98 17.02L2.02 17.02ZM4.27 9.98Q4.55 9.98 4.78 10.22Q5.02 10.45 5.02 10.76Q5.02 11.06 4.78 11.25L3.14 12.98L5.02 12.98L5.02 14.02L2.02 14.02L2.02 13.08L3.98 11.02L2.02 11.02L2.02 9.98L4.27 9.98Z',
  hazards: 'M2.02 21.98L2.02 6.98Q2.02 6.56 2.3 6.28Q2.58 6 3 6L6.98 6L6.98 2.02L17.02 2.02L17.02 6L21 6Q21.42 6 21.7 6.28Q21.98 6.56 21.98 6.98L21.98 21.98L14.02 21.98L14.02 17.02L9.98 17.02L9.98 21.98L2.02 21.98ZM9 3.98L9 9.98L11.02 9.98L11.02 8.02L12.98 8.02L12.98 9.98L15 9.98L15 3.98L12.98 3.98L12.98 6L11.02 6L11.02 3.98L9 3.98ZM3.98 20.02L8.02 20.02L8.02 17.02L3.98 17.02L3.98 20.02ZM3.98 15L8.02 15L8.02 12L3.98 12L3.98 15ZM15.98 20.02L20.02 20.02L20.02 17.02L15.98 17.02L15.98 20.02ZM15.98 15L20.02 15L20.02 12L15.98 12L15.98 15ZM9.98 15L14.02 15L14.02 12L9.98 12L9.98 15Z',
  firstdue: 'M21 11.02Q21 13.73 19.83 16.27Q18.66 18.8 16.59 20.58Q14.53 22.36 12 23.02Q9.47 22.36 7.41 20.58Q5.34 18.8 4.17 16.27Q3 13.73 3 11.02L3 5.02L12 0.98L21 5.02L21 11.02ZM12 21Q13.83 20.48 15.45 18.98Q17.06 17.48 18.02 15.42Q18.98 13.36 18.98 11.2L18.98 6.28L12 3.19L5.02 6.28L5.02 11.2Q5.02 13.36 5.98 15.42Q6.94 17.48 8.55 18.98Q10.17 20.48 12 21ZM11.02 14.02L12.98 14.02L12.98 17.02L15.98 17.02L15.98 12L18 12L12 6.98L6 12L8.02 12L8.02 17.02L11.02 17.02L11.02 14.02Z',
  maptest: 'M18.98 3L14.81 3Q14.39 1.83 13.27 1.31Q12.14 0.8 11.02 1.22Q9.7 1.64 9.19 3L5.02 3Q4.17 3 3.59 3.59Q3 4.17 3 5.02L3 18.98Q3 19.83 3.59 20.41Q4.17 21 5.02 21L18.98 21Q19.83 21 20.41 20.41Q21 19.83 21 18.98L21 5.02Q21 4.17 20.41 3.59Q19.83 3 18.98 3ZM12 3Q12.42 3 12.7 3.28Q12.98 3.56 12.98 3.98Q12.98 4.41 12.7 4.71Q12.42 5.02 12 5.02Q11.58 5.02 11.3 4.71Q11.02 4.41 11.02 3.98Q11.02 3.56 11.3 3.28Q11.58 3 12 3ZM6.98 6.98L17.02 6.98L17.02 5.02L18.98 5.02L18.98 18.98L5.02 18.98L5.02 5.02L6.98 5.02L6.98 6.98ZM17.02 11.02L6.98 11.02L6.98 9L17.02 9L17.02 11.02ZM15 15L6.98 15L6.98 12.98L15 12.98L15 15Z',
  driver: 'M12.98 19.92Q15.7 19.59 17.65 17.65Q19.59 15.7 19.92 12.98L16.92 12.98Q16.59 14.48 15.54 15.54Q14.48 16.59 12.98 16.92L12.98 19.92ZM9.98 8.02L14.02 8.02L17.02 11.02L19.92 11.02Q19.55 8.06 17.27 6.02Q15 3.98 12 3.98Q9 3.98 6.73 6.02Q4.45 8.06 4.08 11.02L6.98 11.02L9.98 8.02ZM11.02 19.92L11.02 16.92Q9.52 16.59 8.46 15.54Q7.41 14.48 7.08 12.98L4.08 12.98Q4.41 15.66 6.35 17.6Q8.3 19.55 11.02 19.92ZM12 2.02Q16.08 2.02 19.03 4.97Q21.98 7.92 21.98 12Q21.98 16.08 19.03 19.03Q16.08 21.98 12 21.98Q7.92 21.98 4.97 19.03Q2.02 16.08 2.02 12Q2.02 7.92 4.97 4.97Q7.92 2.02 12 2.02Z',
  trades: 'M21 9L17.02 5.02L17.02 8.02L9.98 8.02L9.98 9.98L17.02 9.98L17.02 12.98L21 9ZM6.98 11.02L3 15L6.98 18.98L6.98 15.98L14.02 15.98L14.02 14.02L6.98 14.02L6.98 11.02Z',
  ambulance: 'M18 18.52Q18.61 18.52 19.05 18.07Q19.5 17.63 19.5 16.99Q19.5 16.36 19.05 15.94Q18.61 15.52 18 15.52Q17.39 15.52 16.95 15.94Q16.5 16.36 16.5 16.99Q16.5 17.63 16.95 18.07Q17.39 18.52 18 18.52ZM19.5 9.52L17.02 9.52L17.02 12L21.47 12L19.5 9.52ZM6 18.52Q6.61 18.52 7.05 18.07Q7.5 17.63 7.5 16.99Q7.5 16.36 7.05 15.94Q6.61 15.52 6 15.52Q5.39 15.52 4.95 15.94Q4.5 16.36 4.5 16.99Q4.5 17.63 4.95 18.07Q5.39 18.52 6 18.52ZM20.02 8.02L23.02 12L23.02 17.02L21 17.02Q21 18.23 20.13 19.13Q19.27 20.02 18 20.02Q16.73 20.02 15.87 19.13Q15 18.23 15 17.02L9 17.02Q9 18.23 8.13 19.13Q7.27 20.02 6 20.02Q4.73 20.02 3.87 19.13Q3 18.23 3 17.02L0.98 17.02L0.98 6Q0.98 5.16 1.57 4.57Q2.16 3.98 3 3.98L17.02 3.98L17.02 8.02L20.02 8.02ZM8.02 6L8.02 9L5.02 9L5.02 11.02L8.02 11.02L8.02 14.02L9.98 14.02L9.98 11.02L12.98 11.02L12.98 9L9.98 9L9.98 6L8.02 6Z',
  data: 'M12 3Q9.84 3 7.99 3.54Q6.14 4.08 5.06 4.99Q3.98 5.91 3.98 6.98L3.98 17.02Q3.98 18.09 5.06 19.01Q6.14 19.92 7.99 20.46Q9.84 21 12 21Q14.16 21 16.01 20.46Q17.86 19.92 18.94 19.01Q20.02 18.09 20.02 17.02L20.02 6.98Q20.02 5.91 18.94 4.99Q17.86 4.08 16.01 3.54Q14.16 3 12 3ZM18 17.02Q18 17.3 17.3 17.72Q16.5 18.28 15.28 18.61Q13.78 18.98 12 18.98Q10.22 18.98 8.72 18.61Q7.5 18.28 6.7 17.72Q6 17.3 6 17.02L6 14.77Q8.53 15.98 12 15.98Q15.47 15.98 18 14.77L18 17.02ZM18 12.47Q17.02 13.17 15.42 13.59Q13.83 14.02 12 14.02Q10.17 14.02 8.58 13.59Q6.98 13.17 6 12.47L6 9.66Q7.13 10.27 8.7 10.64Q10.27 11.02 12 11.02Q13.73 11.02 15.3 10.64Q16.88 10.27 18 9.66L18 12.47ZM12 9Q10.22 9 8.72 8.58Q7.5 8.25 6.7 7.73Q6 7.31 6 7.01Q6 6.7 6.7 6.28Q7.5 5.72 8.72 5.39Q10.22 5.02 12 5.02Q13.78 5.02 15.28 5.39Q16.5 5.72 17.3 6.28Q18 6.7 18 7.01Q18 7.31 17.3 7.73Q16.5 8.25 15.28 8.58Q13.78 9 12 9Z',
  offline: 'M2.3 3L0.98 4.27L2.48 5.72Q1.83 6.14 1.22 6.61L3 9Q3.75 8.44 4.64 7.92L6.89 10.17Q5.72 10.69 4.78 11.39L6.61 13.78Q7.78 12.94 9.19 12.47L11.77 15Q9.89 15.09 8.39 16.22L12 21L14.44 17.72L17.72 21L18.98 19.73L2.3 3ZM12 3Q8.86 3 5.91 4.08L8.3 6.47Q10.13 6 12 6Q14.48 6 16.78 6.77Q19.08 7.55 21 9L22.78 6.61Q20.48 4.88 17.74 3.94Q15 3 12 3ZM12 9Q11.25 9 10.88 9.05L14.06 12.23Q15.89 12.66 17.39 13.78L19.22 11.39Q17.67 10.27 15.84 9.63Q14.02 9 12 9Z',
  private: 'M12 17.02Q11.16 17.02 10.57 16.43Q9.98 15.84 9.98 15Q9.98 14.16 10.57 13.57Q11.16 12.98 12 12.98Q12.84 12.98 13.43 13.57Q14.02 14.16 14.02 15Q14.02 15.84 13.43 16.43Q12.84 17.02 12 17.02ZM18 20.02L18 9.98L6 9.98L6 20.02L18 20.02ZM18 8.02Q18.84 8.02 19.43 8.6Q20.02 9.19 20.02 9.98L20.02 20.02Q20.02 20.81 19.43 21.4Q18.84 21.98 18 21.98L6 21.98Q5.16 21.98 4.57 21.4Q3.98 20.81 3.98 20.02L3.98 9.98Q3.98 9.19 4.57 8.6Q5.16 8.02 6 8.02L6.98 8.02L6.98 6Q6.98 4.64 7.66 3.49Q8.34 2.34 9.49 1.66Q10.64 0.98 12 0.98Q13.36 0.98 14.51 1.66Q15.66 2.34 16.34 3.49Q17.02 4.64 17.02 6L17.02 8.02L18 8.02ZM12 3Q10.73 3 9.87 3.87Q9 4.73 9 6L9 8.02L15 8.02L15 6Q15 4.73 14.13 3.87Q13.27 3 12 3Z',
  info: 'M11.02 9L12.98 9L12.98 6.98L11.02 6.98L11.02 9ZM12 20.02Q9.84 20.02 7.99 18.94Q6.14 17.86 5.06 16.01Q3.98 14.16 3.98 12Q3.98 9.84 5.06 7.99Q6.14 6.14 7.99 5.06Q9.84 3.98 12 3.98Q14.16 3.98 16.01 5.06Q17.86 6.14 18.94 7.99Q20.02 9.84 20.02 12Q20.02 14.16 18.94 16.01Q17.86 17.86 16.01 18.94Q14.16 20.02 12 20.02ZM12 2.02Q10.03 2.02 8.18 2.77Q6.33 3.52 4.92 4.92Q3.52 6.33 2.77 8.18Q2.02 10.03 2.02 12Q2.02 13.97 2.77 15.82Q3.52 17.67 4.92 19.08Q6.33 20.48 8.18 21.23Q10.03 21.98 12 21.98Q13.97 21.98 15.82 21.23Q17.67 20.48 19.08 19.08Q20.48 17.67 21.23 15.82Q21.98 13.97 21.98 12Q21.98 10.03 21.23 8.18Q20.48 6.33 19.08 4.92Q17.67 3.52 15.82 2.77Q13.97 2.02 12 2.02ZM11.02 17.02L12.98 17.02L12.98 11.02L11.02 11.02L11.02 17.02Z',
};

// ---------- helpers ----------

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Plain text from the small bits of HTML in cities.mjs, for <meta> descriptions.
const plain = html => html
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&middot;/g, '·')
  .replace(/&rsquo;/g, '’').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();

// mailto: links. analytics.js counts a tap as a lead by the subject alone, so the subjects match its
// LEAD_SUBJECTS (and the home page) exactly; only the prefilled body names the city.
const mailto = (subject, body) =>
  esc(`mailto:support@streetdrill.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
const notifyLink = c => mailto('Notify me when StreetDrill launches', `Name: \nCity or department: ${c.city}, ${c.state}\niPhone or Android: `);
const cityLink = c => mailto('StreetDrill for my city', `City: ${c.city}, ${c.state}\nDepartment: ${c.dept}\nStation list, or a link to it: `);

const tile = name => {
  if (!ICONS[name]) throw new Error(`No icon called ${name}`);
  return `<span class="tile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg></span>`;
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- shared page parts (the same as the home page's) ----------

const NOTIFY_HOME = 'mailto:support@streetdrill.app?subject=Notify%20me%20when%20StreetDrill%20launches&amp;body=Name%3A%20%0ACity%20or%20department%3A%20%0AiPhone%20or%20Android%3A%20';

const head = ({ title, description, path, ogTitle }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${path}">
<meta name="theme-color" content="#0B0F14">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/images/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/png" href="/icon.png">
<link rel="apple-touch-icon" href="/icon.png">
<link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<!-- Made by scripts/city-pages/build.mjs from scripts/city-pages/cities.mjs: edit those, not this file. -->`;

const topbar = notify => `<header class="topbar">
  <div class="wrap">
    <a class="brand" href="/"><img src="/icon.png" alt="" width="34" height="34">StreetDrill</a>
    <nav aria-label="Main">
      <a class="page-link" href="/#how">How it works</a>
      <a class="page-link" href="/#games">Games</a>
      <a class="page-link" href="/#price">Price</a>
      <a href="/support/">Support</a>
    </nav>
    <details class="menu"><summary>Menu</summary><nav aria-label="Menu"><a href="/#how">How it works</a><a href="/#games">Games</a><a href="/#price">Price</a><a href="/support/">Support</a><a href="/sources/">Data sources</a><a href="${notify}">Get notified at launch</a></nav></details>
    <a class="btn" href="${notify}">Get notified</a>
  </div>
</header>`;

const footer = `<footer class="footer">
  <div class="wrap">
    <p>&copy; <span data-year>2026</span> Hantis USA, LLC. StreetDrill is an independent study aid, not affiliated with or endorsed by any city or fire department. Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.</p>
    <nav aria-label="Footer">
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
      <a href="/sources/">Data sources</a>
      <a href="/cities/">Cities</a>
      <a href="/support/">Support</a>
      <a href="https://www.youtube.com/channel/UCNtybNOqndy-CiiGpY3CRfg">YouTube</a>
    </nav>
  </div>
</footer>
<script src="/analytics.js" defer></script>
<script src="/site.js" defer></script>
</body>
</html>
`;

// ---------- a city page ----------

function cityPage(c) {
  const notify = notifyLink(c);
  const sendList = cityLink(c);
  const where = `${c.city}, ${c.state}`;
  const theDept = c.theDept || `the ${c.dept}`;
  const path = `/cities/${c.slug}/`;

  const drillCards = c.drill.map(d => `        <div class="card game">
          ${tile(d.icon)}
          <h3>${d.title}</h3>
          <p>${d.body}</p>
          <p class="meta">${d.games.join(' &middot; ')}</p>
        </div>`).join('\n');

  const faq = [
    {
      q: `Does StreetDrill work in ${c.city}?`,
      a: `<p>Yes. If ${c.city} is already on StreetDrill's list, it downloads right away. If it isn't, type <strong>${where}</strong> during setup or in <strong>Profile</strong> under <strong>City</strong>: StreetDrill builds it from open map data in 10 to 30 minutes and adds it to the list for everyone. Then pick your station and study its first-due area, a radius around it, or the whole city.</p>`,
    },
    {
      q: `Are ${c.possessive || `${c.city}'s`} fire stations in it?`,
      a: `<p>Yes, as estimates to start. ${c.stationsFaq ? `${c.stationsFaq} ` : ''}In a city built from open data, stations are drafted from OpenStreetMap and marked as estimates until we have the department's own list. First-due areas are estimated by drive time from each station. <a href="${sendList}">Send us ${theDept}'s station list</a> and we'll make them exact.</p>`,
    },
    ...c.faq,
    {
      q: `Is StreetDrill made by ${theDept}?`,
      a: `<p>No. StreetDrill is an independent study aid made by Hantis USA, LLC. It isn't affiliated with or endorsed by ${theDept}${c.notCity ? `, ${c.notCity}` : `, the City of ${c.city}`} or any other agency. ${cap(theDept)}'s maps, CAD and SOGs come first, so verify routes before relying on them.</p>`,
    },
    {
      q: 'Can I study another city too?',
      a: `<p>Yes. Working a trade or overtime, or testing somewhere new? Switch cities in <strong>Profile</strong> under <strong>City</strong>. ${c.neighborsLine} Each city keeps its own progress and home base, so switching back to ${c.city} picks up where you left off.</p>`,
    },
    {
      q: 'Does it need a signal?',
      a: `<p>Only to download ${c.city}. After that, its streets, addresses, stations and target hazards are on your phone, so every game works offline, in quarters or on the rig.</p>`,
    },
    {
      q: 'What does it cost?',
      a: '<p>$9.99, once. StreetDrill is free to download and setup is free; a one-time purchase in the app unlocks every game and every city for life, with every future update. No subscription and no ads. The first 100 people to sign in with Apple or Google in the app get lifetime access free.</p>',
    },
  ];

  const faqHtml = faq.map((f, i) => `        <details${i === 0 ? ' open' : ''}>
          <summary>${f.q}</summary>
          <div class="answer">${f.a}</div>
        </details>`).join('\n');

  return `${head({
    title: `StreetDrill ${where}: street study for firefighters`,
    ogTitle: `StreetDrill: know ${c.city} before the tones drop`,
    description: c.description,
    path,
  })}
${topbar(notify)}

<main>
  <section class="hero">
    <div class="wrap">
      <div>
        <p class="eyebrow">Street study for ${c.city} firefighters</p>
        <h1>Know ${c.city} before the tones drop.</h1>
        <p class="lede">${c.lede}</p>
        <div class="cta-row">
          <a class="btn big" href="${notify}">Get notified at launch</a>
          <span class="soon">Coming soon to iPhone and Android</span>
        </div>
        <p class="offer-line">The first 100 people to sign in with Apple or Google in the app get lifetime access free.</p>
        <ul class="ticks row">
          <li>17 study games</li>
          <li>Real ${c.city} addresses</li>
          <li>Works offline</li>
          <li>iPhone and Android</li>
        </ul>
      </div>
      <div class="hero-phones">
        <img class="phone back" src="/images/phone-districts.webp" width="640" height="1348" alt="StreetDrill's map with first-due districts, shown here for Richardson, TX: each fire station's area in its own color.">
        <img class="phone front" src="/images/phone-call.webp" width="640" height="1348" alt="A new call in StreetDrill's Response Run, shown here for Richardson, TX: the call type, the address and its cross streets, and the units responding from the station.">
      </div>
    </div>
  </section>

  <section class="section band" id="city">
    <div class="wrap split">
      <div>
        <p class="eyebrow">${c.city} in StreetDrill</p>
        <h2>Pick ${c.city}. Set your quarters.</h2>
        <p class="lede">Choose ${c.city} when StreetDrill asks where you work, then your station. If it isn't on the list yet, type in <strong>${where}</strong>: it's built from open map data in 10 to 30 minutes, and stays on the list for everyone after that.</p>
        <p class="lede">${c.deptLine}</p>
        <p class="fine">App screens on this page are from Richardson, TX, where StreetDrill started.</p>
      </div>
      <div class="price-card">
        <h3>What's in ${c.possessive || `${c.city}'s`} map</h3>
        <ul class="ticks">
          <li><strong>Every street</strong> from OpenStreetMap, with the one-ways, signals and turn costs that routes follow.</li>
          <li><strong>Real addresses</strong> from the National Address Database or OpenAddresses where they cover ${c.county}, and the Census Bureau's address ranges everywhere else.</li>
          <li><strong>Fire stations</strong> from OpenStreetMap, marked as estimates until we have ${theDept}'s list.</li>
          <li><strong>First-due areas</strong> estimated by drive time from each station.</li>
          <li><strong>Target hazards</strong> from OpenStreetMap: hospitals, schools, senior living, big complexes and venues.</li>
        </ul>
        <a class="btn block" href="${sendList}">Send us the station list</a>
        <p class="fine">We'll make ${c.possessive || `${c.city}'s`} stations exact. <a href="/sources/">See every source</a>.</p>
      </div>
    </div>
  </section>

  <section class="section" id="drill">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">What you'll drill</p>
        <h2>${c.drillHeading}</h2>
        <p class="lede">${c.drillLede}</p>
      </div>
      <div class="cards games">
${drillCards}
      </div>
    </div>
  </section>

  <section class="section feature flip">
    <div class="wrap">
      <div>
        <p class="eyebrow">Response Run</p>
        <h2>Run real ${c.city} calls from quarters</h2>
        <p class="lede">Tap Generate Random Call and a real ${c.city} address comes in like a dispatch. Then make every move: which way out of the bay, every turn, and which side the address is on.</p>
        <ul class="ticks">
          <li><strong>Real addresses.</strong> Address points across ${c.city}, in your first due or anywhere in the city.</li>
          <li><strong>Good alternates count.</strong> A near-equal route is right, the way it is on a real run.</li>
          <li><strong>Hospital and target hazard runs.</strong> ${c.hospitalRun}</li>
        </ul>
      </div>
      <div class="shot">
        <img class="phone" src="/images/phone-route.webp" width="640" height="1348" loading="lazy" alt="Response Run's first move, shown here for Richardson, TX: the station and the call on a blank map, and the question of which way to turn out of the station.">
      </div>
    </div>
  </section>

  <section class="section feature">
    <div class="wrap">
      <div>
        <p class="eyebrow">Test prep</p>
        <h2>Walk into the map test ready</h2>
        <p class="lede">Testing for driver/engineer, or just new to the shift? The Practice Map Test is a timed practice map test, scored by category, and Progress shows what you know and what still needs work.</p>
        <ul class="ticks">
          <li><strong>Practice Map Test.</strong> Routes from quarters, hundred blocks, cross streets, target hazards and first-due areas, with a pass/fail report.</li>
          <li><strong>Shift Drill.</strong> Ten mixed questions a day that lean on your weak spots. Days off on a <span class="nw">48/96</span> don't break your streak.</li>
          <li><strong>Review Misses.</strong> Re-drill only the ${c.city} streets you got wrong.</li>
        </ul>
      </div>
      <div class="shot">
        <img class="phone" src="/images/phone-progress.webp" width="640" height="1348" loading="lazy" alt="StreetDrill's Progress tab: level and XP, sessions, accuracy and streak, then accuracy for each game.">
      </div>
    </div>
  </section>

  <section class="section band">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Why trust it</p>
        <h2>Open data, on your phone</h2>
        <p class="lede">Seventeen games train the same ${c.city} streets: by sight, by ear, by hand, or against the clock. <a class="more" href="/#games">See all 17 games &rarr;</a></p>
      </div>
      <div class="cards four">
        <div class="card">
          ${icon('data')}
          <h3>Open, official data</h3>
          <p>OpenStreetMap, the National Address Database, OpenAddresses and Census address ranges. <a href="/sources/">See every source</a>.</p>
        </div>
        <div class="card">
          ${icon('offline')}
          <h3>Works offline</h3>
          <p>${c.city} downloads once, then lives on your phone. No signal needed, in quarters or anywhere else.</p>
        </div>
        <div class="card">
          ${icon('private')}
          <h3>Private by design</h3>
          <p>No ads and no tracking, and your location only when you ask for it. Your progress stays on your phone.</p>
        </div>
        <div class="card">
          ${icon('info')}
          <h3>Not a department app</h3>
          <p>An independent study aid, not affiliated with ${theDept}. Your SOGs come first.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="price">
    <div class="wrap split">
      <div>
        <p class="eyebrow">Price</p>
        <h2>Pay once. Keep it for life.</h2>
        <p class="lede">StreetDrill is free to download, and setup is free: pick ${c.city} and your station and see how it works. One purchase unlocks every game and every city, with every future update. No subscription, no ads.</p>
      </div>
      <div class="price-card">
        <p class="price">$9.99<span>one time. No subscription.</span></p>
        <ul class="ticks">
          <li><strong>All 17 games</strong></li>
          <li><strong>${c.city}</strong>, and any other US city, offline</li>
          <li><strong>Every future update</strong> included</li>
          <li><strong>Your progress</strong> stays on your phone</li>
        </ul>
        <p class="offer"><strong>Launch offer</strong>The first 100 people to sign in with Apple or Google in the app get lifetime access free.</p>
        <a class="btn block" href="${notify}">Get notified at launch</a>
        <p class="fine">Coming soon to iPhone and Android. Email <a href="${notify}">support@streetdrill.app</a> and we'll tell you the day it's out.</p>
      </div>
    </div>
  </section>

  <section class="section band" id="questions">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Questions</p>
        <h2>StreetDrill in ${c.city}</h2>
      </div>
      <div class="faq">
${faqHtml}
      </div>
      <p class="fine">More answers on the <a href="/support/">support page</a>. Other cities: <a href="/cities/">StreetDrill by city</a>.</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="cta-card">
        <div>
          <h2>Know ${c.city} before the call</h2>
          <p>Street study for ${c.city} firefighters, on iPhone and Android.</p>
        </div>
        <div class="get">
          <a class="btn big" href="${notify}">Get notified at launch</a>
          <span class="soon">Coming soon to iPhone and Android</span>
        </div>
      </div>
    </div>
  </section>
</main>

${footer}`;
}

// ---------- the /cities/ hub ----------

function hubPage(cities) {
  const byName = [...cities].sort((a, b) => a.city.localeCompare(b.city));
  const rows = byName.map(c => `        <tr><td><a href="/cities/${c.slug}/">${c.city}, ${c.state}</a></td><td>${c.hubDept || c.dept}</td></tr>`).join('\n');
  const description = `StreetDrill in your city: street study for firefighters in ${byName.slice(0, 4).map(c => c.city).join(', ')} and more, and in any other US city.`;
  return `${head({ title: 'StreetDrill by City', description, path: '/cities/' })}
${topbar(NOTIFY_HOME)}

<main class="doc">
  <header>
    <h1>StreetDrill by city</h1>
    <p class="lede">StreetDrill works in any US city. Pick yours in the app and it's built from open map data: every street, real addresses, the fire stations and their first-due areas, and the target hazards. Here's what it drills in some of them.</p>
  </header>

  <section>
    <div class="table-wrap">
      <table>
        <thead><tr><th scope="col">City</th><th scope="col">Fire department</th></tr></thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>
    <p>Richardson, Garland and Plano are already on the list in the app. <a href="/#where">More about them</a>.</p>
  </section>

  <section>
    <div class="callout">
      <h2>Don't see your city?</h2>
      <p>It works there too. Type it in during setup, as city and state, and StreetDrill builds it in 10 to 30 minutes. Have your department's station list? <a href="mailto:support@streetdrill.app?subject=StreetDrill%20for%20my%20city">Send it to us</a> and we'll make your city's stations exact.</p>
    </div>
    <p>StreetDrill is an independent study aid, not affiliated with or endorsed by any city or fire department listed here. <a href="/sources/">See every data source</a>.</p>
  </section>
</main>

${footer}`;
}

// ---------- write ----------

const seen = new Set();
for (const c of CITIES) {
  if (!/^[a-z]+(-[a-z]+)*-[a-z]{2}$/.test(c.slug)) throw new Error(`Bad slug: ${c.slug}`);
  if (seen.has(c.slug)) throw new Error(`Duplicate slug: ${c.slug}`);
  seen.add(c.slug);
  if (c.description.length > 170) console.warn(`${c.slug}: description is ${c.description.length} characters; search results show about 155.`);
  const dir = join(ROOT, 'cities', c.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), cityPage(c));
}
writeFileSync(join(ROOT, 'cities', 'index.html'), hubPage(CITIES));

// sitemap.xml: drop any /cities/ lines, then add the hub and every city after the other pages.
const sitemapPath = join(ROOT, 'sitemap.xml');
const keep = readFileSync(sitemapPath, 'utf8').split('\n').filter(line => !line.includes(`${SITE}/cities/`));
const end = keep.findIndex(line => line.trim() === '</urlset>');
if (end < 0) throw new Error('sitemap.xml has no </urlset>');
const urls = ['/cities/', ...CITIES.map(c => `/cities/${c.slug}/`)].map(p => `  <url><loc>${SITE}${p}</loc></url>`);
keep.splice(end, 0, ...urls);
writeFileSync(sitemapPath, keep.join('\n'));

console.log(`Wrote ${CITIES.length} city pages, /cities/, and ${urls.length} sitemap entries.`);
