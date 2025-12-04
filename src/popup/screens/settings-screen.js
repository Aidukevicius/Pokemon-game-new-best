export class SettingsScreen {
  constructor(containerElement) {
    this.container = containerElement;
  }

  async initialize() {
    console.log('[SettingsScreen] Initializing...');
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="settings-screen">
        <div class="snes-container settings-header">
          <h2 class="settings-title">Settings</h2>
        </div>

        <div class="settings-content">
          <div class="settings-section">
            <h3 class="section-title">Testing</h3>
            <p class="section-desc">Use these options for testing the app</p>
            <button class="snes-btn seed-pokemon-btn" id="seedPokemonBtn">Add Test Pokemon</button>
            <div id="seedResult" class="seed-result"></div>
          </div>

          <div class="settings-section">
            <h3 class="section-title">About</h3>
            <p class="about-text">PokéBrowse Extension v1.0.0</p>
            <p class="about-text">Catch Pokemon while browsing!</p>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const seedBtn = this.container.querySelector('#seedPokemonBtn');
    if (seedBtn) {
      seedBtn.addEventListener('click', async () => {
        await this.seedPokemon();
      });
    }
  }

  async seedPokemon() {
    const resultDiv = this.container.querySelector('#seedResult');
    const btn = this.container.querySelector('#seedPokemonBtn');
    
    try {
      btn.disabled = true;
      btn.textContent = 'Adding...';
      
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        resultDiv.innerHTML = `<span class="success-msg">Added ${data.count} test Pokemon!</span>`;
        resultDiv.className = 'seed-result success';
      } else {
        resultDiv.innerHTML = `<span class="error-msg">${data.error || 'Failed to add Pokemon'}</span>`;
        resultDiv.className = 'seed-result error';
      }
    } catch (error) {
      console.error('[SettingsScreen] Error seeding Pokemon:', error);
      resultDiv.innerHTML = `<span class="error-msg">Error: ${error.message}</span>`;
      resultDiv.className = 'seed-result error';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Add Test Pokemon';
    }
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
