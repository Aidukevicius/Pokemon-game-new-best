import { SpriteService } from '../../shared/services/SpriteService.js';
import { showPokemonDetail } from '../components/pokemon-detail-modal.js';

export class StorageScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.spriteService = new SpriteService();
    this.items = [];
    this.pokemon = [];
    this.selectedItem = null;
    this.selectedPokemon = null;
    this.mode = 'inventory';
  }

  async initialize() {
    console.log('[StorageScreen] Initializing...');
    await this.loadData();
    this.render();
  }

  async loadData() {
    try {
      const [itemsRes, pokemonRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/pokemon')
      ]);
      this.items = await itemsRes.json();
      this.pokemon = await pokemonRes.json();
      console.log('[StorageScreen] Loaded items:', this.items.length, 'Pokemon:', this.pokemon.length);
    } catch (error) {
      console.error('[StorageScreen] Error loading data:', error);
      this.items = [];
      this.pokemon = [];
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="storage-screen">
        <div class="snes-container storage-header">
          <h2 class="storage-title">Item Bag</h2>
          <div class="storage-tabs">
            <button class="storage-tab-btn ${this.mode === 'inventory' ? 'active' : ''}" data-mode="inventory">Inventory</button>
            <button class="storage-tab-btn ${this.mode === 'equip' ? 'active' : ''}" data-mode="equip">Equip</button>
          </div>
        </div>

        <div class="storage-content">
          ${this.mode === 'inventory' ? this.renderInventory() : this.renderEquipMode()}
        </div>

        ${this.selectedItem ? this.renderItemDetail() : ''}
      </div>
    `;

    this.attachEventListeners();
  }

  renderInventory() {
    if (this.items.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">🎒</div>
          <h3 class="empty-title">Your Bag is Empty</h3>
          <p class="empty-text">Collect items to fill your bag!</p>
          <button class="snes-btn seed-items-btn" id="seedItemsBtn">Add Starter Items</button>
        </div>
      `;
    }

    const categories = this.groupByCategory();
    
    return `
      <div class="items-list">
        ${Object.entries(categories).map(([category, items]) => `
          <div class="item-category">
            <h3 class="category-title">${this.getCategoryName(category)}</h3>
            <div class="items-grid">
              ${items.map(item => this.renderItemCard(item)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderItemCard(item) {
    const isSelected = this.selectedItem?.itemId === item.itemId;
    return `
      <div class="item-card ${isSelected ? 'selected' : ''}" data-item-id="${item.itemId}">
        <img src="${item.sprite}" alt="${item.name}" class="item-sprite" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 30 30%22><text y=%2220%22 font-size=%2216%22>📦</text></svg>'">
        <span class="item-name">${item.name}</span>
        <span class="item-quantity">x${item.quantity}</span>
      </div>
    `;
  }

  renderItemDetail() {
    const item = this.selectedItem;
    return `
      <div class="item-detail-panel snes-container">
        <div class="item-detail-header">
          <img src="${item.sprite}" alt="${item.name}" class="item-detail-sprite">
          <div class="item-detail-info">
            <h3 class="item-detail-name">${item.name}</h3>
            <span class="item-detail-quantity">Owned: ${item.quantity}</span>
          </div>
        </div>
        <p class="item-detail-description">${item.description}</p>
        <div class="item-detail-actions">
          <button class="snes-btn equip-btn" data-action="equip-item">Equip to Pokemon</button>
        </div>
      </div>
    `;
  }

  renderEquipMode() {
    return `
      <div class="equip-mode">
        <div class="equip-section">
          <h3 class="section-title">Select Item</h3>
          <div class="items-mini-grid">
            ${this.items.map(item => `
              <div class="item-mini-card ${this.selectedItem?.itemId === item.itemId ? 'selected' : ''}" 
                   data-item-id="${item.itemId}" data-mode="select-item">
                <img src="${item.sprite}" alt="${item.name}" class="item-mini-sprite">
                <span class="item-mini-qty">x${item.quantity}</span>
              </div>
            `).join('')}
            <div class="item-mini-card unequip-card ${this.selectedItem === 'unequip' ? 'selected' : ''}" 
                 data-item-id="unequip" data-mode="select-item">
              <span class="unequip-icon">✕</span>
              <span class="item-mini-name">Unequip</span>
            </div>
          </div>
        </div>

        <div class="equip-section">
          <h3 class="section-title">Select Pokemon</h3>
          <div class="pokemon-equip-grid">
            ${this.pokemon.map(p => {
              const spriteUrl = this.spriteService.getDefaultSpriteUrl(p.id);
              const itemId = p.item ? this.getItemIdByName(p.item) : null;
              const itemSprite = itemId ? this.getItemSprite(itemId) : null;
              
              return `
                <div class="pokemon-equip-card ${this.selectedPokemon?.db_id === p.db_id ? 'selected' : ''}" 
                     data-pokemon-db-id="${p.db_id}">
                  <img src="${spriteUrl}" alt="${p.name}" class="pokemon-equip-sprite">
                  <span class="pokemon-equip-name">${p.name}</span>
                  <div class="pokemon-held-item">
                    ${itemSprite ? `<img src="${itemSprite}" class="held-item-icon" alt="${p.item}">` : '<span class="no-item">-</span>'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        ${this.selectedItem && this.selectedPokemon ? `
          <div class="equip-confirm">
            <button class="snes-btn confirm-equip-btn" id="confirmEquipBtn">
              ${this.selectedItem === 'unequip' ? `Remove item from ${this.selectedPokemon.name}` : `Give ${this.selectedItem.name} to ${this.selectedPokemon.name}`}
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  groupByCategory() {
    const groups = {};
    for (const item of this.items) {
      const cat = item.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    return groups;
  }

  getCategoryName(category) {
    const names = {
      'hold': 'Hold Items',
      'berry': 'Berries',
      'training': 'Training Items',
      'other': 'Other'
    };
    return names[category] || category;
  }

  getItemIdByName(name) {
    for (const item of this.items) {
      if (item.name === name) return item.itemId;
    }
    return null;
  }

  getItemSprite(itemId) {
    const item = this.items.find(i => i.itemId === itemId);
    return item?.sprite || null;
  }

  attachEventListeners() {
    const modeTabs = this.container.querySelectorAll('.storage-tab-btn');
    modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.mode = tab.dataset.mode;
        this.selectedItem = null;
        this.selectedPokemon = null;
        this.render();
      });
    });

    const seedBtn = this.container.querySelector('#seedItemsBtn');
    if (seedBtn) {
      seedBtn.addEventListener('click', async () => {
        await this.seedItems();
      });
    }

    const itemCards = this.container.querySelectorAll('.item-card');
    itemCards.forEach(card => {
      card.addEventListener('click', () => {
        const itemId = card.dataset.itemId;
        this.selectedItem = this.items.find(i => i.itemId === itemId);
        this.render();
      });
    });

    const equipBtn = this.container.querySelector('[data-action="equip-item"]');
    if (equipBtn) {
      equipBtn.addEventListener('click', () => {
        this.mode = 'equip';
        this.render();
      });
    }

    const miniItemCards = this.container.querySelectorAll('[data-mode="select-item"]');
    miniItemCards.forEach(card => {
      card.addEventListener('click', () => {
        const itemId = card.dataset.itemId;
        if (itemId === 'unequip') {
          this.selectedItem = 'unequip';
        } else {
          this.selectedItem = this.items.find(i => i.itemId === itemId);
        }
        this.render();
      });
    });

    const pokemonCards = this.container.querySelectorAll('.pokemon-equip-card');
    pokemonCards.forEach(card => {
      card.addEventListener('click', () => {
        const dbId = parseInt(card.dataset.pokemonDbId);
        this.selectedPokemon = this.pokemon.find(p => p.db_id === dbId);
        this.render();
      });
    });

    const confirmBtn = this.container.querySelector('#confirmEquipBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async () => {
        await this.equipItem();
      });
    }
  }

  async seedItems() {
    try {
      const res = await fetch('/api/items/seed', { method: 'POST' });
      if (res.ok) {
        await this.loadData();
        this.render();
      }
    } catch (error) {
      console.error('[StorageScreen] Error seeding items:', error);
    }
  }

  async equipItem() {
    if (!this.selectedPokemon) return;

    try {
      const itemId = this.selectedItem === 'unequip' ? null : this.selectedItem.itemId;
      
      const res = await fetch(`/api/pokemon/${this.selectedPokemon.db_id}/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });

      if (res.ok) {
        await this.loadData();
        this.selectedItem = null;
        this.selectedPokemon = null;
        this.render();
      } else {
        const error = await res.json();
        console.error('[StorageScreen] Equip error:', error);
        alert(error.error || 'Failed to equip item');
      }
    } catch (error) {
      console.error('[StorageScreen] Error equipping item:', error);
    }
  }

  show() {
    this.container.style.display = 'block';
    this.loadData().then(() => this.render());
  }

  hide() {
    this.container.style.display = 'none';
  }
}
