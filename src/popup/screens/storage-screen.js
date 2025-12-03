import { SpriteService } from '../../shared/services/SpriteService.js';

export class StorageScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.spriteService = new SpriteService();
    this.items = [];
  }

  async initialize() {
    console.log('[StorageScreen] Initializing...');
    await this.loadData();
    this.render();
  }

  async loadData() {
    try {
      const itemsRes = await fetch('/api/items');
      this.items = await itemsRes.json();
      console.log('[StorageScreen] Loaded items:', this.items.length);
    } catch (error) {
      console.error('[StorageScreen] Error loading data:', error);
      this.items = [];
    }
  }

  render() {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    
    this.container.innerHTML = `
      <div class="storage-screen">
        <div class="snes-container storage-header">
          <h2 class="storage-title">Item Bag</h2>
          <span class="item-count">${totalItems} items</span>
        </div>

        <div class="storage-content">
          ${this.items.length === 0 ? this.renderEmptyState() : this.renderInventory()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-icon">🎒</div>
        <h3 class="empty-title">Your Bag is Empty</h3>
        <p class="empty-text">Collect items while catching Pokemon!</p>
        <button class="snes-btn seed-items-btn" id="seedItemsBtn">Add Starter Items</button>
      </div>
    `;
  }

  renderInventory() {
    const categories = this.groupByCategory();
    
    return `
      <div class="items-overview">
        ${Object.entries(categories).map(([category, items]) => `
          <div class="item-category-row">
            <span class="category-label">${this.getCategoryName(category)}</span>
            <div class="category-items">
              ${items.map(item => this.renderItemBadge(item)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="items-hint">
        <span class="hint-icon">💡</span>
        <span class="hint-text">Equip items from Pokemon detail cards in the Pokédex tab</span>
      </div>
    `;
  }

  renderItemBadge(item) {
    return `
      <div class="item-badge" title="${item.name}: ${item.description}">
        <img src="${item.sprite}" alt="${item.name}" class="item-badge-sprite" 
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><text y=%2218%22 font-size=%2214%22>📦</text></svg>'">
        <span class="item-badge-qty">×${item.quantity}</span>
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
      'training': 'Training',
      'other': 'Other'
    };
    return names[category] || category;
  }

  attachEventListeners() {
    const seedBtn = this.container.querySelector('#seedItemsBtn');
    if (seedBtn) {
      seedBtn.addEventListener('click', async () => {
        await this.seedItems();
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

  show() {
    this.container.style.display = 'block';
    this.loadData().then(() => this.render());
  }

  hide() {
    this.container.style.display = 'none';
  }
}
