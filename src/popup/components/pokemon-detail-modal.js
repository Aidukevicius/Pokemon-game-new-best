import { SpriteService } from '../../shared/services/SpriteService.js';
import { getPokemonById } from '../../shared/data/pokemon-database.js';
import { calculateAllStats, getNatureDescription, STAT_NAMES, STAT_COLORS, getTotalEVs, getStatTotal, getTotalIVs, getIVRating } from '../../shared/utils/stats.js';

const ITEM_SPRITES = {
  'Leftovers': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leftovers.png',
  'Choice Band': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-band.png',
  'Choice Specs': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-specs.png',
  'Choice Scarf': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-scarf.png',
  'Life Orb': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/life-orb.png',
  'Focus Sash': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-sash.png',
  'Rocky Helmet': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rocky-helmet.png',
  'Assault Vest': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/assault-vest.png',
  'Eviolite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/eviolite.png',
  'Black Sludge': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/black-sludge.png',
  'Sitrus Berry': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',
  'Lum Berry': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lum-berry.png',
  'Oran Berry': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',
  'Exp. Share': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png',
  'Lucky Egg': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucky-egg.png',
  'Soothe Bell': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soothe-bell.png',
  'Macho Brace': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/macho-brace.png',
  'Power Bracer': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-bracer.png',
  'Power Belt': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-belt.png',
  'Power Lens': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-lens.png',
  'Power Band': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-band.png',
  'Power Anklet': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-anklet.png',
  'Power Weight': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-weight.png',
  'Miracle Seed': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/miracle-seed.png',
  'Charcoal': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charcoal.png',
  'Mystic Water': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystic-water.png',
  'Light Ball': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/light-ball.png',
  'Everstone': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/everstone.png',
  'Dragon Fang': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-fang.png',
  'Spell Tag': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/spell-tag.png',
  'Dragon Scale': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-scale.png',
  'Twisted Spoon': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/twisted-spoon.png'
};

function getItemSprite(itemName) {
  return ITEM_SPRITES[itemName] || null;
}

export class PokemonDetailModal {
  constructor() {
    this.spriteService = new SpriteService();
    this.overlay = null;
    this.currentPokemon = null;
    this.availableItems = [];
    this.showItemSelector = false;
    this.onEquipCallback = null;
  }

  async show(pokemon, onEquipCallback = null) {
    this.currentPokemon = pokemon;
    this.onEquipCallback = onEquipCallback;
    this.showItemSelector = false;
    await this.loadItems();
    this.createModal();
  }

  async loadItems() {
    try {
      const res = await fetch('/api/items');
      this.availableItems = await res.json();
    } catch (error) {
      console.error('[DetailModal] Error loading items:', error);
      this.availableItems = [];
    }
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
    const totalIVs = getTotalIVs(pokemon.ivs);
    const ivRating = getIVRating(totalIVs);
    
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
        
        <div class="detail-section item-section">
          <div class="section-header">
            <span class="section-icon">◆</span>
            <span class="section-title">Held Item</span>
          </div>
          <div class="item-equip-area" id="itemEquipArea">
            ${this.renderItemArea()}
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
            <span class="section-title">Stats</span>
          </div>
          <div class="stats-grid compact">
            ${this.renderStatBarsCompact(stats, pokemon.nature)}
          </div>
        </div>
        
        <div class="detail-section ivs-section compact">
          <div class="section-header">
            <span class="section-icon">★</span>
            <span class="section-title">IVs</span>
            <span class="iv-rating" style="color: ${ivRating.color}">${ivRating.label} (${totalIVs}/186)</span>
          </div>
        </div>
        
        <div class="detail-footer">
          <span class="rarity-badge rarity-${baseData.rarity}">${baseData.rarity}</span>
          ${pokemon.caught_at ? `<span class="caught-date">Caught: ${new Date(pokemon.caught_at).toLocaleDateString()}</span>` : ''}
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    this.attachEventListeners();
  }

  renderItemArea() {
    const pokemon = this.currentPokemon;
    
    if (this.showItemSelector) {
      return this.renderItemSelector();
    }
    
    return `
      <div class="current-item-display">
        ${pokemon.item ? `
          <div class="equipped-item">
            ${getItemSprite(pokemon.item) ? 
              `<img src="${getItemSprite(pokemon.item)}" alt="${pokemon.item}" class="equipped-item-sprite">` :
              `<span class="item-icon">⬟</span>`
            }
            <span class="equipped-item-name">${pokemon.item}</span>
            <button class="change-item-btn" data-action="show-items">Change</button>
          </div>
        ` : `
          <div class="no-item">
            <span class="no-item-text">No item equipped</span>
            <button class="equip-item-btn" data-action="show-items">Equip Item</button>
          </div>
        `}
      </div>
    `;
  }

  renderItemSelector() {
    const pokemon = this.currentPokemon;
    const itemsWithQty = this.availableItems.filter(i => i.quantity > 0);
    
    return `
      <div class="item-selector">
        <div class="item-selector-header">
          <span class="selector-title">Select Item:</span>
          <button class="cancel-select-btn" data-action="cancel-select">Cancel</button>
        </div>
        <div class="item-selector-grid">
          ${pokemon.item ? `
            <div class="item-option unequip-option" data-action="unequip">
              <span class="unequip-x">✕</span>
              <span class="item-option-name">Remove</span>
            </div>
          ` : ''}
          ${itemsWithQty.length > 0 ? itemsWithQty.map(item => `
            <div class="item-option" data-action="equip" data-item-id="${item.itemId}">
              <img src="${item.sprite}" alt="${item.name}" class="item-option-sprite"
                   onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><text y=%2218%22 font-size=%2214%22>📦</text></svg>'">
              <span class="item-option-name">${item.name}</span>
              <span class="item-option-qty">×${item.quantity}</span>
            </div>
          `).join('') : '<div class="no-items-msg">No items in bag</div>'}
        </div>
      </div>
    `;
  }

  renderStatBarsCompact(stats, nature) {
    const statOrder = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
    const maxStat = 300;
    
    return statOrder.map(key => {
      const stat = stats[key];
      const percentage = Math.min((stat.calculated / maxStat) * 100, 100);
      const color = STAT_COLORS[key];
      const modClass = stat.modifier > 1 ? 'stat-boosted' : stat.modifier < 1 ? 'stat-lowered' : '';
      
      return `
        <div class="stat-row-compact ${modClass}">
          <span class="stat-name-short">${STAT_NAMES[key].substring(0, 3)}</span>
          <div class="stat-bar-mini">
            <div class="stat-bar-fill" style="width: ${percentage}%; background: ${color}"></div>
          </div>
          <span class="stat-value-mini">${stat.calculated}</span>
        </div>
      `;
    }).join('');
  }

  updateItemArea() {
    const itemArea = this.overlay.querySelector('#itemEquipArea');
    if (itemArea) {
      itemArea.innerHTML = this.renderItemArea();
      this.attachItemListeners();
    }
  }

  attachEventListeners() {
    const closeBtn = this.overlay.querySelector('[data-action="close"]');
    closeBtn?.addEventListener('click', () => this.close());
    
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    this.attachItemListeners();
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  attachItemListeners() {
    const showItemsBtn = this.overlay.querySelector('[data-action="show-items"]');
    if (showItemsBtn) {
      showItemsBtn.addEventListener('click', () => {
        this.showItemSelector = true;
        this.updateItemArea();
      });
    }

    const cancelBtn = this.overlay.querySelector('[data-action="cancel-select"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.showItemSelector = false;
        this.updateItemArea();
      });
    }

    const unequipBtn = this.overlay.querySelector('[data-action="unequip"]');
    if (unequipBtn) {
      unequipBtn.addEventListener('click', () => this.equipItem(null));
    }

    const equipBtns = this.overlay.querySelectorAll('[data-action="equip"]');
    equipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.itemId;
        this.equipItem(itemId);
      });
    });
  }

  async equipItem(itemId) {
    const pokemon = this.currentPokemon;
    
    try {
      const res = await fetch(`/api/pokemon/${pokemon.db_id}/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });

      if (res.ok) {
        const updated = await res.json();
        this.currentPokemon.item = updated.item;
        this.showItemSelector = false;
        await this.loadItems();
        this.updateItemArea();
        
        if (this.onEquipCallback) {
          this.onEquipCallback(updated);
        }
      } else {
        const error = await res.json();
        console.error('[DetailModal] Equip error:', error);
        alert(error.error || 'Failed to equip item');
      }
    } catch (error) {
      console.error('[DetailModal] Error equipping item:', error);
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      if (this.showItemSelector) {
        this.showItemSelector = false;
        this.updateItemArea();
      } else {
        this.close();
      }
    }
  }

  close() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.currentPokemon = null;
    this.showItemSelector = false;
  }
}

let modalInstance = null;

export function showPokemonDetail(pokemon, onEquipCallback = null) {
  if (!modalInstance) {
    modalInstance = new PokemonDetailModal();
  }
  modalInstance.show(pokemon, onEquipCallback);
}

export function closePokemonDetail() {
  if (modalInstance) {
    modalInstance.close();
  }
}
