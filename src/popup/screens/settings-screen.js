export class SettingsScreen {
  constructor(containerElement) {
    this.container = containerElement;
    // Make this instance accessible globally for onclick handlers
    window.settingsScreen = this;
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
            <button class="test-btn seed-pokemon-btn" id="seedPokemonBtn" onclick="window.settingsScreen.seedPokemon()">Add Test Pokemon</button>
            <div id="seedResult" class="seed-result"></div>
          </div>

          <div class="settings-section battle-test-section">
            <h3 class="section-title">Battle Simulator Testing</h3>
            <p class="section-desc">Test different battle scenarios to verify EVs, IVs, speed, and damage calculations</p>
            
            <div class="test-category">
              <h4 class="test-category-title">EV Testing</h4>
              <div class="test-buttons">
                <button class="test-btn" data-test="ev_comparison" onclick="window.settingsScreen.startTestBattle('ev_comparison')">
                  <span class="test-name">EV Comparison</span>
                  <span class="test-desc">2x Pikachu Lv50 - One with 252 Atk/252 Spe EVs vs No EVs (same IVs)</span>
                </button>
                <button class="test-btn" data-test="ev_hp_defense" onclick="window.settingsScreen.startTestBattle('ev_hp_defense')">
                  <span class="test-name">Defensive EVs</span>
                  <span class="test-desc">2x Pikachu Lv50 - One with 252 HP/252 Def EVs vs No EVs</span>
                </button>
                <button class="test-btn" data-test="ev_special" onclick="window.settingsScreen.startTestBattle('ev_special')">
                  <span class="test-name">Special Attack EVs</span>
                  <span class="test-desc">2x Pikachu Lv50 - One with 252 SpAtk EVs vs No EVs</span>
                </button>
              </div>
            </div>

            <div class="test-category">
              <h4 class="test-category-title">IV Testing</h4>
              <div class="test-buttons">
                <button class="test-btn" data-test="iv_comparison" onclick="window.settingsScreen.startTestBattle('iv_comparison')">
                  <span class="test-name">IV Comparison</span>
                  <span class="test-desc">2x Pikachu Lv50 - Perfect 31 IVs vs 0 IVs (same EVs)</span>
                </button>
                <button class="test-btn" data-test="iv_speed" onclick="window.settingsScreen.startTestBattle('iv_speed')">
                  <span class="test-name">Speed IV Test</span>
                  <span class="test-desc">2x Pikachu Lv50 - 31 Speed IV vs 0 Speed IV (who goes first?)</span>
                </button>
              </div>
            </div>

            <div class="test-category">
              <h4 class="test-category-title">Nature Testing</h4>
              <div class="test-buttons">
                <button class="test-btn" data-test="nature_attack" onclick="window.settingsScreen.startTestBattle('nature_attack')">
                  <span class="test-name">Adamant vs Modest</span>
                  <span class="test-desc">2x Pikachu Lv50 - Adamant (+Atk) vs Modest (+SpAtk)</span>
                </button>
                <button class="test-btn" data-test="nature_speed" onclick="window.settingsScreen.startTestBattle('nature_speed')">
                  <span class="test-name">Jolly vs Brave</span>
                  <span class="test-desc">2x Pikachu Lv50 - Jolly (+Spe) vs Brave (-Spe) - Speed difference</span>
                </button>
              </div>
            </div>

            <div class="test-category">
              <h4 class="test-category-title">Level Testing</h4>
              <div class="test-buttons">
                <button class="test-btn" data-test="level_difference" onclick="window.settingsScreen.startTestBattle('level_difference')">
                  <span class="test-name">Level Gap</span>
                  <span class="test-desc">Pikachu Lv100 vs Pikachu Lv50 - Damage difference</span>
                </button>
                <button class="test-btn" data-test="level_low" onclick="window.settingsScreen.startTestBattle('level_low')">
                  <span class="test-name">Low Level Battle</span>
                  <span class="test-desc">2x Pikachu Lv5 - Early game simulation</span>
                </button>
              </div>
            </div>

            <div class="test-category">
              <h4 class="test-category-title">Type Effectiveness</h4>
              <div class="test-buttons">
                <button class="test-btn" data-test="type_super_effective" onclick="window.settingsScreen.startTestBattle('type_super_effective')">
                  <span class="test-name">Super Effective</span>
                  <span class="test-desc">Pikachu (Electric) vs Squirtle (Water) Lv50</span>
                </button>
                <button class="test-btn" data-test="type_not_effective" onclick="window.settingsScreen.startTestBattle('type_not_effective')">
                  <span class="test-name">Not Very Effective</span>
                  <span class="test-desc">Pikachu (Electric) vs Bulbasaur (Grass) Lv50</span>
                </button>
                <button class="test-btn" data-test="type_immune" onclick="window.settingsScreen.startTestBattle('type_immune')">
                  <span class="test-name">Immune Type</span>
                  <span class="test-desc">Pikachu (Electric) vs Sandshrew (Ground) Lv50</span>
                </button>
              </div>
            </div>

            <div class="test-category">
              <h4 class="test-category-title">Speed Priority</h4>
              <div class="test-buttons">
                <button class="test-btn" data-test="speed_equal" onclick="window.settingsScreen.startTestBattle('speed_equal')">
                  <span class="test-name">Equal Speed</span>
                  <span class="test-desc">2x Pikachu Lv50 - Identical stats, random first move</span>
                </button>
                <button class="test-btn" data-test="speed_faster" onclick="window.settingsScreen.startTestBattle('speed_faster')">
                  <span class="test-name">Faster Pokemon</span>
                  <span class="test-desc">Jolteon (130 Spe) vs Pikachu (90 Spe) Lv50</span>
                </button>
                <button class="test-btn" data-test="speed_slower" onclick="window.settingsScreen.startTestBattle('speed_slower')">
                  <span class="test-name">Slower Pokemon</span>
                  <span class="test-desc">Snorlax (30 Spe) vs Pikachu (90 Spe) Lv50</span>
                </button>
              </div>
            </div>

            <div class="test-category">
              <h4 class="test-category-title">Combined Stats</h4>
              <div class="test-buttons">
                <button class="test-btn" data-test="fully_trained" onclick="window.settingsScreen.startTestBattle('fully_trained')">
                  <span class="test-name">Fully Trained</span>
                  <span class="test-desc">Pikachu Lv100 with 252 Atk/252 Spe EVs, 31 IVs, Jolly vs Untrained</span>
                </button>
                <button class="test-btn" data-test="tank_vs_sweeper" onclick="window.settingsScreen.startTestBattle('tank_vs_sweeper')">
                  <span class="test-name">Tank vs Sweeper</span>
                  <span class="test-desc">Pikachu (Def/SpDef EVs, Bold) vs Pikachu (Atk/Spe EVs, Jolly)</span>
                </button>
              </div>
            </div>

            <div class="test-category batch-test-section">
              <h4 class="test-category-title">Batch Testing</h4>
              <p class="section-desc">Run all tests in background with same ability for both Pokemon</p>
              <div class="test-buttons">
                <button class="test-btn batch-test-btn" id="runAllTests10x" onclick="window.settingsScreen.runAllTests(10)">
                  <span class="test-name">Run All Tests 10x</span>
                  <span class="test-desc">Run all battle tests 10 times, both Pokemon use Static ability</span>
                </button>
                <button class="test-btn batch-test-btn" id="runAllTests1x" onclick="window.settingsScreen.runAllTests(1)">
                  <span class="test-name">Run All Tests 1x</span>
                  <span class="test-desc">Run all battle tests once, generates results file</span>
                </button>
              </div>
              <div id="batchTestResult" class="batch-test-result"></div>
              <div id="testResultsList" class="test-results-list"></div>
            </div>

            <div id="battleTestResult" class="battle-test-result"></div>
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
        console.log('[SettingsScreen] Seed button clicked');
        await this.seedPokemon();
      });
    }

    const testBtns = this.container.querySelectorAll('.test-btn');
    console.log('[SettingsScreen] Found test buttons:', testBtns.length);
    testBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const button = e.currentTarget;
        const testType = button.dataset.test;
        console.log('[SettingsScreen] Test button clicked:', testType);
        await this.startTestBattle(testType);
      });
    });
  }

  async startTestBattle(testType) {
    const resultDiv = this.container.querySelector('#battleTestResult');
    const btn = this.container.querySelector(`[data-test="${testType}"]`);
    
    try {
      btn.disabled = true;
      resultDiv.innerHTML = '<span class="loading-msg">Setting up test battle...</span>';
      resultDiv.className = 'battle-test-result loading';
      
      const res = await fetch('/api/test-battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testType })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('pendingTestBattle', JSON.stringify({
          companion: data.companion,
          encounter: data.encounter,
          description: data.description
        }));
        
        resultDiv.innerHTML = `
          <div class="test-setup-info">
            <span class="success-msg">Test battle ready!</span>
            <div class="battle-info">
              <div class="pokemon-info">
                <strong>Your Pokemon:</strong> ${data.companion.name} Lv${data.companion.level}
                <br><small>Nature: ${data.companion.nature} | EVs: ${this.formatEVs(data.companion.evs)} | IVs: ${this.formatIVs(data.companion.ivs)}</small>
                <br><small>Stats - HP:${data.companion.stats.hp} Atk:${data.companion.stats.attack} Def:${data.companion.stats.defense} SpA:${data.companion.stats.spAttack} SpD:${data.companion.stats.spDefense} Spe:${data.companion.stats.speed}</small>
              </div>
              <div class="vs-text">VS</div>
              <div class="pokemon-info">
                <strong>Wild Pokemon:</strong> ${data.encounter.pokemon.name} Lv${data.encounter.level}
                <br><small>Nature: ${data.encounter.nature} | EVs: ${this.formatEVs(data.encounter.evs)} | IVs: ${this.formatIVs(data.encounter.ivs)}</small>
                <br><small>Stats - HP:${data.encounter.stats.hp} Atk:${data.encounter.stats.attack} Def:${data.encounter.stats.defense} SpA:${data.encounter.stats.spAttack} SpD:${data.encounter.stats.spDefense} Spe:${data.encounter.stats.speed}</small>
              </div>
            </div>
            <p class="instruction">Go to the Search tab to start the battle!</p>
          </div>
        `;
        resultDiv.className = 'battle-test-result success';
      } else {
        resultDiv.innerHTML = `<span class="error-msg">${data.error || 'Failed to set up test battle'}</span>`;
        resultDiv.className = 'battle-test-result error';
      }
    } catch (error) {
      console.error('[SettingsScreen] Error setting up test battle:', error);
      resultDiv.innerHTML = `<span class="error-msg">Error: ${error.message}</span>`;
      resultDiv.className = 'battle-test-result error';
    } finally {
      btn.disabled = false;
    }
  }

  formatEVs(evs) {
    if (!evs) return 'None';
    const parts = [];
    if (evs.hp > 0) parts.push(`HP:${evs.hp}`);
    if (evs.attack > 0) parts.push(`Atk:${evs.attack}`);
    if (evs.defense > 0) parts.push(`Def:${evs.defense}`);
    if (evs.spAttack > 0) parts.push(`SpA:${evs.spAttack}`);
    if (evs.spDefense > 0) parts.push(`SpD:${evs.spDefense}`);
    if (evs.speed > 0) parts.push(`Spe:${evs.speed}`);
    return parts.length > 0 ? parts.join(', ') : 'None';
  }

  formatIVs(ivs) {
    if (!ivs) return 'Default';
    const allSame = Object.values(ivs).every(v => v === ivs.hp);
    if (allSame) return `All ${ivs.hp}`;
    const parts = [];
    parts.push(`HP:${ivs.hp}`);
    parts.push(`Atk:${ivs.attack}`);
    parts.push(`Def:${ivs.defense}`);
    parts.push(`SpA:${ivs.spAttack}`);
    parts.push(`SpD:${ivs.spDefense}`);
    parts.push(`Spe:${ivs.speed}`);
    return parts.join(', ');
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

  async runAllTests(iterations = 10) {
    const resultDiv = this.container.querySelector('#batchTestResult');
    const btn10x = this.container.querySelector('#runAllTests10x');
    const btn1x = this.container.querySelector('#runAllTests1x');
    
    try {
      if (btn10x) btn10x.disabled = true;
      if (btn1x) btn1x.disabled = true;
      resultDiv.innerHTML = `<span class="loading-msg">Running ${iterations}x batch tests in background...</span>`;
      resultDiv.className = 'batch-test-result loading';
      
      const res = await fetch('/api/run-all-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iterations, ability: 'Static' })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        resultDiv.innerHTML = `
          <div class="batch-success">
            <span class="success-msg">Batch tests completed!</span>
            <div class="batch-summary">
              <p>Total Iterations: ${data.summary.totalIterations}</p>
              <p>Tests per Iteration: ${data.summary.testsPerIteration}</p>
              <p>Total Tests: ${data.summary.totalTests}</p>
              <p>Ability Used: ${data.summary.ability}</p>
            </div>
            <a href="${data.resultsFile}" target="_blank" class="results-link">Download Results File</a>
          </div>
        `;
        resultDiv.className = 'batch-test-result success';
        
        this.loadTestResults();
      } else {
        resultDiv.innerHTML = `<span class="error-msg">${data.error || 'Failed to run batch tests'}</span>`;
        resultDiv.className = 'batch-test-result error';
      }
    } catch (error) {
      console.error('[SettingsScreen] Error running batch tests:', error);
      resultDiv.innerHTML = `<span class="error-msg">Error: ${error.message}</span>`;
      resultDiv.className = 'batch-test-result error';
    } finally {
      if (btn10x) btn10x.disabled = false;
      if (btn1x) btn1x.disabled = false;
    }
  }

  async loadTestResults() {
    const listDiv = this.container.querySelector('#testResultsList');
    if (!listDiv) return;
    
    try {
      const res = await fetch('/api/test-results');
      const data = await res.json();
      
      if (res.ok && data.files && data.files.length > 0) {
        listDiv.innerHTML = `
          <h5 class="results-title">Previous Test Results:</h5>
          <ul class="results-files">
            ${data.files.slice(0, 5).map(f => `
              <li><a href="${f.url}" target="_blank">${f.filename}</a> <small>(${(f.size / 1024).toFixed(1)} KB)</small></li>
            `).join('')}
          </ul>
        `;
      }
    } catch (error) {
      console.error('[SettingsScreen] Error loading test results:', error);
    }
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
