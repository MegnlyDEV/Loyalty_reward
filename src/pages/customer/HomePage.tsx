import { CURRENT_USER, products, tierConfig, type Tier } from '../../data/mockData';
import { TierBadge } from '../../components/TierBadge';

interface Props {
  onNav: (p: string) => void;
  onAddToCart: (productId: string) => void;
}

export function HomePage({ onNav, onAddToCart }: Props) {
  const tier = CURRENT_USER.tier;
  const config = tierConfig[tier];
  const nextTier = tier === 'Silver' ? 'Gold' : tier === 'Gold' ? 'Platinum' : null;
  const nextConfig = nextTier ? tierConfig[nextTier as Tier] : null;
  const progress = nextConfig ? Math.min(100, ((CURRENT_USER.points - config.min) / (nextConfig.min - config.min)) * 100) : 100;
  const ptsToNext = nextConfig ? nextConfig.min - CURRENT_USER.points : 0;

  const featured = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--primary)]">Member dashboard</p>
          <h1 className="font-display mt-1 text-2xl font-bold text-slate-900">Good to see you, {CURRENT_USER.name.split(' ')[0]}.</h1>
        </div>
        <button onClick={() => onNav('products')} className="hidden sm:block text-sm font-semibold text-[var(--primary)] hover:underline">Browse products</button>
      </div>
      {/* Hero loyalty card */}
      <div className="rounded-xl p-5 md:p-7 soft-panel">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-[rgba(79,70,229,0.18)] shadow-md" />
            <div>
              <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Loyalty member</div>
              <div className="font-display text-xl font-bold text-slate-900">{CURRENT_USER.name}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{CURRENT_USER.nameKh}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8">
            <div className="text-center">
              <div className="font-mono-data text-2xl font-semibold text-slate-900 mini-metric">{CURRENT_USER.points.toLocaleString()}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Points Balance</div>
            </div>
            <div className="text-center">
              <TierBadge tier={CURRENT_USER.tier} size="lg" />
              <div className="text-xs text-[var(--muted-foreground)] mt-1">Current Tier</div>
            </div>
            <div className="text-center">
              <div className="font-mono-data text-2xl font-semibold text-slate-900 mini-metric">{CURRENT_USER.ordersCount}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Orders</div>
            </div>
          </div>
        </div>

        {nextTier && (
          <div className="mt-6 border-t border-[var(--border)] pt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-[var(--muted-foreground)]">Progress to {nextTier}</span>
              <span className="text-xs font-semibold text-[var(--primary)]">{ptsToNext.toLocaleString()} pts to go</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Points Balance', value: CURRENT_USER.points.toLocaleString(), icon: '●', sub: 'available to redeem', tone: '', onClick: () => onNav('points') },
          { label: 'Rewards Available', value: '6', icon: '✦', sub: 'based on your tier', tone: '', onClick: () => onNav('rewards') },
          { label: 'Badges Earned', value: CURRENT_USER.badges.length.toString(), icon: '◇', sub: 'keep collecting', tone: '', onClick: () => onNav('badges') },
          { label: 'Referral Bonus', value: '100 pts', icon: '↗', sub: 'per successful referral', tone: '', onClick: () => onNav('referrals') },
        ].map(stat => (
          <button key={stat.label} onClick={stat.onClick} className="text-left p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] card-glow">
            <div className={`icon-bubble mb-3 ${stat.tone}`}>{stat.icon}</div>
            <div className="font-mono-data text-lg font-semibold text-slate-900 mini-metric">{stat.value}</div>
            <div className="text-xs font-medium mt-0.5 text-slate-700">{stat.label}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.sub}</div>
          </button>
        ))}
      </div>

      {/* Featured products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Featured Products</h2>
          <button onClick={() => onNav('products')} className="text-sm font-semibold text-[var(--primary)] hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.map(p => (
            <div key={p.id} className="bg-[var(--card)] rounded-xl overflow-hidden border border-[var(--border)] card-glow group">
              <div className="relative overflow-hidden bg-[var(--secondary)] h-36">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.bonusMultiplier > 1 && (
                  <span className="absolute top-2 right-2 text-xs bg-slate-900 text-white font-bold px-1.5 py-0.5 rounded-md">{p.bonusMultiplier}× pts</span>
                )}
              </div>
              <div className="p-3">
                <div className="text-sm font-medium leading-snug">{p.name}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{p.nameKh}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-slate-900">${p.price}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">+{p.normalPoints} pts</span>
                </div>
                <button onClick={() => onAddToCart(p.id)} className="w-full mt-3 py-2 rounded-md bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[#1d49b9] transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier benefits banner */}
      <div className="rounded-xl p-5 bg-[var(--card)] border border-[var(--border)]">
        <h3 className="font-display text-base font-semibold mb-3">Your {tier} Benefits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {tier === 'Silver' && [
            { icon: '⭐', text: '1× points on all purchases' },
            { icon: '🎁', text: 'Basic reward catalog access' },
            { icon: '🛒', text: 'Standard checkout perks' },
          ].map(b => <div key={b.text} className="flex items-center gap-2 text-[var(--muted-foreground)]"><span>{b.icon}</span>{b.text}</div>)}
          {tier === 'Gold' && [
            { icon: '⭐', text: '1.5× points on all purchases' },
            { icon: '🎁', text: 'Gold reward catalog access' },
            { icon: '🏷', text: 'Gold-exclusive promotions' },
          ].map(b => <div key={b.text} className="flex items-center gap-2 text-[var(--muted-foreground)]"><span>{b.icon}</span>{b.text}</div>)}
          {tier === 'Platinum' && [
            { icon: '⭐', text: '2× points on all purchases' },
            { icon: '💎', text: 'Platinum-exclusive rewards' },
            { icon: '🚀', text: 'Priority support & promotions' },
          ].map(b => <div key={b.text} className="flex items-center gap-2 text-[var(--muted-foreground)]"><span>{b.icon}</span>{b.text}</div>)}
        </div>
      </div>
    </div>
  );
}
