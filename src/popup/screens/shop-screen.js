// SHOP/TRADING SCREEN
// Buy items and trade Pokemon

import { StorageService } from '../../shared/services/StorageService.js';

export class ShopScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.storage = new StorageService();
    this.inventory = null;
    this.playerData = null;
  }

  async initialize() {
    console.log('[ShopScreen] Initializing...');
    await this.loadData();
    this.render();
  }

  async loadData() {
    this.inventory = await this.storage.get('inventory') || {
      pokeballs: 5,
      greatballs: 0,
      ultraballs: 0
    };
    this.playerData = await this.storage.get('playerData') || {
      coins: 100
    };
  }

  render() {
    this.container.innerHTML = `
      <div class="shop-screen">
        <div class="shop-header">
          <h2>PokéMart</h2>
          <div class="balance">
            <span class="coin-icon">💰</span>
            <span class="coin-amount">${this.playerData.coins}</span>
          </div>
        </div>

        <div class="shop-items">
          <div class="shop-item" data-item="pokeball" data-price="10">
            <div class="item-icon">⚪</div>
            <div class="item-info">
              <h3>Pokéball</h3>
              <p>Standard catching ball</p>
              <div class="price">💰 10</div>
            </div>
            <button class="buy-button">Buy</button>
          </div>

          <div class="shop-item" data-item="greatball" data-price="30">
            <div class="item-icon">🔵</div>
            <div class="item-info">
              <h3>Great Ball</h3>
              <p>Better catch rate</p>
              <div class="price">💰 30</div>
            </div>
            <button class="buy-button">Buy</button>
          </div>

          <div class="shop-item" data-item="ultraball" data-price="50">
            <div class="item-icon">🟡</div>
            <div class="item-info">
              <h3>Ultra Ball</h3>
              <p>Highest catch rate</p>
              <div class="price">💰 50</div>
            </div>
            <button class="buy-button">Buy</button>
          </div>
        </div>

        <div class="shop-message" style="display: none;"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const buyButtons = this.container.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const itemCard = e.target.closest('.shop-item');
        const itemId = itemCard.dataset.item;
        const price = parseInt(itemCard.dataset.price);
        this.handlePurchase(itemId, price);
      });
    });
  }

  async handlePurchase(itemId, price) {
    if (this.playerData.coins < price) {
      this.showMessage('Not enough coins!', 'error');
      return;
    }

    // Deduct coins
    this.playerData.coins -= price;

    // Add item to inventory
    const itemKey = itemId + 's'; // pokeball -> pokeballs
    this.inventory[itemKey] = (this.inventory[itemKey] || 0) + 1;

    // Save to storage
    await this.storage.set('playerData', this.playerData);
    await this.storage.set('inventory', this.inventory);

    // Update UI
    this.updateBalance();
    this.showMessage(`Bought ${itemId}!`, 'success');
  }

  updateBalance() {
    const balanceEl = this.container.querySelector('.coin-amount');
    if (balanceEl) {
      balanceEl.textContent = this.playerData.coins;
    }
  }

  showMessage(text, type) {
    const messageEl = this.container.querySelector('.shop-message');
    messageEl.textContent = text;
    messageEl.className = `shop-message ${type}`;
    messageEl.style.display = 'block';

    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 2000);
  }

  show() {
    this.container.style.display = 'block';
    this.loadData().then(() => this.updateBalance());
  }

  hide() {
    this.container.style.display = 'none';
  }
}