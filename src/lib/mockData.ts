export interface Market {
  id: string;
  question: string;
  category: 'crypto' | 'politics' | 'sports' | 'pop' | 'memes';
  yesPrice: number;
  noPrice: number;
  volume: number;
  traders: number;
  createdAt: Date;
  resolvesAt: Date;
  status: 'new' | 'ending' | 'resolved';
}

const categories: Market['category'][] = ['crypto', 'politics', 'sports', 'pop', 'memes'];
const questions = ["Will Bitcoin hit $150K before Feb 2025?","ETH to flip BTC market cap this cycle?","Trump wins 2028 election?","Elon buys another social platform?","Lakers win NBA Finals 2025?","Taylor Swift releases new album Q1?","Dogecoin reaches $1 this bull run?","Fed cuts rates in January?","Apple launches AR glasses 2025?","Tesla stock above $500 by March?","Will AI replace 50% of jobs by 2030?","China invades Taiwan before 2026?","Netflix reaches 300M subscribers?","SpaceX Starship reaches Mars?","Gold price exceeds $3000/oz?","Shiba Inu flips Dogecoin?","YouTube removes dislikes permanently?","New COVID variant causes lockdowns?","Meta stock doubles in 2025?","OpenAI IPO before 2026?","Solana flips Ethereum TVL?","World Cup 2026 USA wins?","TikTok banned in EU?","Disney+ surpasses Netflix?","Amazon acquires gaming company?","Bitcoin ETF hits $100B AUM?","Nvidia stock split again?","Twitter/X reaches profitability?","Google launches crypto wallet?","MrBeast hits 500M subs?","Ronaldo retires before 2026?","New iPhone has no ports?","Nuclear fusion breakthrough 2025?","Reddit IPO above $10B?","Cybertruck mass production success?","Binance relisted in US?","UFC fighter tests positive?","Kanye drops new album?","Stripe goes public 2025?","Mars sample return successful?","Anthropic reaches $50B valuation?","Apple buys OpenAI stake?","Ethereum gas below 5 gwei avg?","First AI-written Oscar nominee?","Bitcoin mining ban in EU?"];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateMarket(index: number, status: Market['status']): Market {
  const yesPrice = Math.random() * 0.8 + 0.1;
  const now = new Date();
  let createdAt: Date, resolvesAt: Date;
  if (status === 'new') {
    createdAt = randomDate(new Date(now.getTime() - 24 * 60 * 60 * 1000), now);
    resolvesAt = randomDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
  } else if (status === 'ending') {
    createdAt = randomDate(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    resolvesAt = randomDate(now, new Date(now.getTime() + 48 * 60 * 60 * 1000));
  } else {
    createdAt = randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000));
    resolvesAt = randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000));
  }
  return { id: `market-${status}-${index}`, question: questions[index % questions.length], category: categories[Math.floor(Math.random() * categories.length)], yesPrice: Number(yesPrice.toFixed(2)), noPrice: Number((1 - yesPrice).toFixed(2)), volume: Math.floor(Math.random() * 500000) + 1000, traders: Math.floor(Math.random() * 1000) + 10, createdAt, resolvesAt, status };
}

export const initialMarkets: Market[] = [
  ...Array.from({ length: 16 }, (_, i) => generateMarket(i, 'new')),
  ...Array.from({ length: 14 }, (_, i) => generateMarket(i + 16, 'ending')),
  ...Array.from({ length: 15 }, (_, i) => generateMarket(i + 30, 'resolved'))
];

export function formatVolume(vol: number): string {
  if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
  if (vol >= 1000) return `${(vol / 1000).toFixed(0)}K`;
  return `${vol}`;
}

export function formatTimeLeft(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  if (diffMs <= 0) return 'Ended';
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}
