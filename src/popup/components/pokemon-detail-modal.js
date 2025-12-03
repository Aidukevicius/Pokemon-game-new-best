import { SpriteService } from '../../shared/services/SpriteService.js';
import { getPokemonById } from '../../shared/data/pokemon-database.js';
import { calculateAllStats, getNatureDescription, STAT_NAMES, STAT_COLORS, getTotalEVs, getStatTotal, getTotalIVs, getIVRating } from '../../shared/utils/stats.js';

export class PokemonDetailModal {
  constructor() {
    this.spriteService = new SpriteService();
    this.overlay = null;
    this.currentPokemon = null;
  }

  show(pokemon) {
    this.currentPokemon = pokemon;
    this.createModal();
  }

  createModal() {
    const pokemon = this.currentPokemon;
    const baseData = getPokemonById(pokemon.id);
    const stats = calculateAllStats(pokemon);
    
    if (!baseData || !stats) {
      console.error('[DetailModal] Could not load Pokemon data');
      return;
    }

    this.overlay = document.createElement('div');
    this.overlay.className = 'detail-overlay';
    
    const typesBadges = baseData.types.map(type => 
      `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
    ).join('');
    
    const spriteUrl = this.spriteService.getDefaultSpriteUrl(pokemon.id);
    const natureDesc = getNatureDescription(pokemon.nature);
    const totalEVs = getTotalEVs(pokemon.evs);
    const totalIVs = getTotalIVs(pokemon.ivs);
    const ivRating = getIVRating(totalIVs);
    const statTotal = getStatTotal(stats);
    
    this.overlay.innerHTML = `
      <div class="detail-modal snes-container">
        <button class="close-detail-modal" data-action="close">×</button>
        
        <div class="detail-header">
          <div class="detail-sprite-container">
            <img src="${spriteUrl}" alt="${pokemon.name}" class="detail-sprite" />
          </div>
          <div class="detail-info">
            <span class="pokemon-number">#${String(pokemon.id).padStart(3, '0')}</span>
            <h2 class="detail-name">${pokemon.name}</h2>
            <div class="detail-types">${typesBadges}</div>
            <span class="detail-level">Level ${pokemon.level}</span>
          </div>
        </div>
        
        <div class="detail-section nature-section">
          <div class="section-header">
            <span class="section-icon">★</span>
            <span class="section-title">Nature</span>
          </div>
          <div class="nature-info">
            <span class="nature-name">${pokemon.nature || 'Hardy'}</span>
            <span class="nature-effect">${natureDesc}</span>
          </div>
        </div>
        
        <div class="detail-section stats-section">
          <div class="section-header">
            <span class="section-icon">⚔</span>
            <span class="section-title">Actual Stats (Base+IV+EV)</span>
          </div>
          <div class="stats-grid">
            ${this.renderStatBars(stats, pokemon.nature)}
          </div>
        </div>
        
        <div class="detail-section evs-section">
          <div class="section-header">
            <span class="section-icon">↑</span>
            <span class="section-title">EVs</span>
            <span class="ev-total">${totalEVs}/510</span>
          </div>
          <div class="evs-grid">
            ${this.renderEVBars(pokemon.evs)}
          </div>
        </div>
        
        <div class="detail-section ivs-section">
          <div class="section-header">
            <span class="section-icon">★</span>
            <span class="section-title">IVs</span>
            <span class="iv-rating" style="color: ${ivRating.color}">${ivRating.label}</span>
          </div>
          <div class="ivs-grid">
            ${this.renderIVBars(pokemon.ivs)}
          </div>
          <div class="iv-total-display">
            <span class="iv-total-label">Total IVs:</span>
            <span class="iv-total-value">${totalIVs}/186</span>
          </div>
        </div>
        
        <div class="detail-section item-section">
          <div class="section-header">
            <span class="section-icon">◆</span>
            <span class="section-title">Held Item</span>
          </div>
          <div class="item-slot ${pokemon.item ? 'has-item' : 'empty'}">
            ${pokemon.item ? `
              <span class="item-icon">⬟</span>
              <span class="item-name">${pokemon.item}</span>
            ` : `
              <span class="empty-slot-text">No item equipped</span>
            `}
          </div>
        </div>
        
        <div class="detail-footer">
          <span class="rarity-badge rarity-${baseData.rarity}">${baseData.rarity}</span>
          ${pokemon.caught_at ? `<span class="caught-date">Caught: ${new Date(pokemon.caught_at).toLocaleDateString()}</span>` : ''}
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    this.fitTextToContainer();
    this.attachEventListeners();
  }

  fitTextToContainer() {
    const nameElement = this.overlay.querySelector('.detail-name');
    const container = this.overlay.querySelector('.detail-info');
    
    if (!nameElement || !container) return;
    
    const containerWidth = container.offsetWidth - 20; // padding
    let fontSize = 13;
    
    nameElement.style.fontSize = fontSize + 'px';
    
    while (nameElement.scrollWidth > containerWidth && fontSize > 7) {
      fontSize -= 0.5;
      nameElement.style.fontSize = fontSize + 'px';
    }
    
    // Adjust letter spacing for very long names
    if (fontSize < 10) {
      nameElement.style.letterSpacing = '0px';
    } else if (fontSize < 12) {
      nameElement.style.letterSpacing = '0.1px';
    }
  }

  renderStatBars(stats, nature) {
    const statOrder = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
    const maxStat = 300;
    
    return statOrder.map(key => {
      const stat = stats[key];
      const percentage = Math.min((stat.calculated / maxStat) * 100, 100);
      const color = STAT_COLORS[key];
      const modClass = stat.modifier > 1 ? 'stat-boosted' : stat.modifier < 1 ? 'stat-lowered' : '';
      
      return `
        <div class="stat-row-detail ${modClass}">
          <span class="stat-name">${STAT_NAMES[key]}</span>
          <div class="stat-bar-container">
            <div class="stat-bar-bg">
              <div class="stat-bar-fill" style="width: ${percentage}%; background: ${color}"></div>
            </div>
          </div>
          <span class="stat-value-num">${stat.calculated}</span>
          ${stat.modifier !== 1 ? `<span class="stat-mod">${stat.modifier > 1 ? '+' : '-'}</span>` : '<span class="stat-mod"></span>'}
        </div>
      `;
    }).join('');
  }

  renderEVBars(evs) {
    const statOrder = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
    const maxEV = 252;
    
    if (!evs) {
      evs = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
    }
    
    return statOrder.map(key => {
      const ev = evs[key] || 0;
      const percentage = Math.min((ev / maxEV) * 100, 100);
      const color = STAT_COLORS[key];
      
      return `
        <div class="ev-row">
          <span class="ev-name">${STAT_NAMES[key]}</span>
          <div class="ev-bar-container">
            <div class="ev-bar-bg">
              <div class="ev-bar-fill" style="width: ${percentage}%; background: ${color}"></div>
            </div>
          </div>
          <span class="ev-value">${ev}</span>
        </div>
      `;
    }).join('');
  }

  renderIVBars(ivs) {
    const statOrder = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
    const maxIV = 31;
    const defaultIV = 15;
    
    if (!ivs) {
      ivs = { hp: defaultIV, attack: defaultIV, defense: defaultIV, spAttack: defaultIV, spDefense: defaultIV, speed: defaultIV };
    }
    
    return statOrder.map(key => {
      const iv = ivs[key] !== undefined ? ivs[key] : defaultIV;
      const percentage = Math.min((iv / maxIV) * 100, 100);
      const color = STAT_COLORS[key];
      const isPerfect = iv === 31;
      const isZero = iv === 0;
      
      return `
        <div class="iv-row ${isPerfect ? 'iv-perfect' : ''} ${isZero ? 'iv-zero' : ''}">
          <span class="iv-name">${STAT_NAMES[key]}</span>
          <div class="iv-bar-container">
            <div class="iv-bar-bg">
              <div class="iv-bar-fill" style="width: ${percentage}%; background: ${color}"></div>
            </div>
          </div>
          <span class="iv-value">${iv}</span>
        </div>
      `;
    }).join('');
  }

  attachEventListeners() {
    const closeBtn = this.overlay.querySelector('[data-action="close"]');
    closeBtn?.addEventListener('click', () => this.close());
    
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      this.close();
    }
  }

  close() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.currentPokemon = null;
  }
}

let modalInstance = null;

export function showPokemonDetail(pokemon) {
  if (!modalInstance) {
    modalInstance = new PokemonDetailModal();
  }
  modalInstance.show(pokemon);
}

export function closePokemonDetail() {
  if (modalInstance) {
    modalInstance.close();
  }
}
