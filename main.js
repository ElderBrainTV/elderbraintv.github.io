var toolDisplay = document.getElementById('tool-display');
var combatTracker;
var combatants = JSON.parse(localStorage.getItem('combatants')) || [];
var activeTool = null;

document.getElementById('combat-tracker-link').addEventListener('click', function(e) {
    e.preventDefault();

    if (activeTool === 'combat-tracker') {
        combatTracker.style.display = 'none';
        activeTool = null;
    } else {
        var tools = document.getElementsByClassName('tool');
        for (var i = 0; i < tools.length; i++) {
            tools[i].style.display = 'none';
        }

        combatTracker.style.display = 'block';
        activeTool = 'combat-tracker';
    }
});

window.addEventListener('unload', function() {
    localStorage.setItem('combatants', JSON.stringify(combatants));
});

window.onload = function() {
    setupCombatTracker();
}

function setupCombatTracker() {
    var toolDisplay = document.getElementById('tool-display');

    while (toolDisplay.firstChild) {
        toolDisplay.firstChild.remove();
    }

    combatTracker = createCombatTracker();
    toolDisplay.appendChild(combatTracker);
    combatTracker.style.display = 'none';

    // Update the combatants list
    updateCombatantsList();
}


function createCombatTracker() {
  var combatTracker = document.createElement('div');
  combatTracker.id = 'combat-tracker';
  combatTracker.className = 'tool';

    var h2 = document.createElement('h2');
    h2.textContent = 'Combat Tracker';
    combatTracker.appendChild(h2);

    var form = document.createElement('form');
    form.id = 'add-combatant-form';
    combatTracker.appendChild(form);

    // Fields for Name, Initiative, and NPC status remain unchanged, so we skip to the new Health field
    var healthInput = document.createElement('input');
    healthInput.type = 'number';
    healthInput.id = 'combatant-health';
    healthInput.placeholder = 'Health';
    healthInput.required = true;
    form.appendChild(healthInput);

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'combatant-name';
    nameInput.placeholder = 'Name';
    nameInput.required = true;
    form.appendChild(nameInput);

    var initiativeInput = document.createElement('input');
    initiativeInput.type = 'number';
    initiativeInput.id = 'combatant-initiative';
    initiativeInput.placeholder = 'Initiative';
    initiativeInput.required = true;
    form.appendChild(initiativeInput);

    var rollButton = document.createElement('button');
    rollButton.type = 'button';
    rollButton.id = 'roll-initiative';
    rollButton.textContent = 'Roll Initiative';
    rollButton.disabled = false;
    form.appendChild(rollButton);

    var addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.textContent = 'Add Combatant';
    form.appendChild(addButton);

    var list = document.createElement('ul');
    list.id = 'combatants-list';
    combatTracker.appendChild(list);


    rollButton.addEventListener('click', function(e) {
        var roll = Math.floor(Math.random() * 20) + 1;
        initiativeInput.value = roll;
    });

    // Character Type dropdown
    var characterTypeInput = document.createElement('select');
    characterTypeInput.id = 'combatant-character-type';

    var pcOption = document.createElement('option');
    pcOption.value = 'PC';
    pcOption.text = 'Player Character';
    characterTypeInput.appendChild(pcOption);

    var npcOption = document.createElement('option');
    npcOption.value = 'NPC';
    npcOption.text = 'Non-Player Character';
    characterTypeInput.appendChild(npcOption);

    var enemyOption = document.createElement('option');
    enemyOption.value = 'Enemy';
    enemyOption.text = 'Enemy';
    characterTypeInput.appendChild(enemyOption);

    form.appendChild(characterTypeInput);

        // Status Effects dropdown
    var statusEffectInput = document.createElement('select');
    statusEffectInput.id = 'combatant-status-effect';

    var statusEffects = ['None', 'Blinded', 'Charmed', 'Deafened', 'Exhausted', 'Frightning', 'Grappled', 'Incapacitated', 'Invisible', 'Paralysed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious']; // replace with your actual status effects
    statusEffects.forEach(function(statusEffect) {
        var option = document.createElement('option');
        option.value = statusEffect;
        option.text = statusEffect;
        statusEffectInput.appendChild(option);
    });

        // Add radio buttons for health type
    var healthTypeFixed = document.createElement('input');
    healthTypeFixed.type = 'radio';
    healthTypeFixed.id = 'health-type-fixed';
    healthTypeFixed.name = 'health-type';
    healthTypeFixed.checked = true;
    healthTypeFixed.value = 'fixed';
    form.appendChild(healthTypeFixed);

    var healthTypeFixedLabel = document.createElement('label');
    healthTypeFixedLabel.for = 'health-type-fixed';
    healthTypeFixedLabel.textContent = 'Fixed Health';
    form.appendChild(healthTypeFixedLabel);

    var healthTypeRoll = document.createElement('input');
    healthTypeRoll.type = 'radio';
    healthTypeRoll.id = 'health-type-roll';
    healthTypeRoll.name = 'health-type';
    healthTypeRoll.value = 'roll';
    form.appendChild(healthTypeRoll);

    var healthTypeRollLabel = document.createElement('label');
    healthTypeRollLabel.for = 'health-type-roll';
    healthTypeRollLabel.textContent = 'Roll for Health';
    form.appendChild(healthTypeRollLabel);

        // Create a field for the number of hit dice
    var hitDiceCountInput = document.createElement('input');
    hitDiceCountInput.type = 'number';
    hitDiceCountInput.id = 'combatant-hit-dice-count';
    hitDiceCountInput.placeholder = 'Number of Hit Dice';
    hitDiceCountInput.required = false; // Not required because health might be fixed
    form.appendChild(hitDiceCountInput);

    // Create a field for the number of sides per hit dice
    var hitDiceSidesInput = document.createElement('input');
    hitDiceSidesInput.type = 'number';
    hitDiceSidesInput.id = 'combatant-hit-dice-sides';
    hitDiceSidesInput.placeholder = 'Number of Sides per Dice';
    hitDiceSidesInput.required = false; // Not required because health might be fixed
    form.appendChild(hitDiceSidesInput);


    form.addEventListener('submit', function(e) {
        e.preventDefault();
    
        var name = nameInput.value;
        var initiative = initiativeInput.value;
        var healthType = document.querySelector('input[name="health-type"]:checked').value;
        var health;
        var totalHitDice;
        if (healthType === 'roll') {
            totalHitDice = hitDiceCountInput.value;
            var hitDiceSides = hitDiceSidesInput.value;
            health = 0;
            for (var i = 0; i < totalHitDice; i++) {
                health += Math.floor(Math.random() * hitDiceSides) + 1;
            }
        } else {
            health = healthInput.value;
        }
        var characterType = characterTypeInput.value;
    
        combatants.push({
            name: name,
            initiative: initiative,
            health: health,
            totalHitDice: totalHitDice,
            characterType: characterType,
            statusEffects: [] // Add statusEffects array to the combatant object
        });
    
        combatants.sort(function(a, b) {
            return b.initiative - a.initiative;
        });
    
        nameInput.value = '';
        initiativeInput.value = '';
        healthInput.value = '';
        hitDiceCountInput.value = '';
        hitDiceSidesInput.value = '';
    
        // Call the updateCombatantsList function here
        updateCombatantsList();
    });
    
    
    

    var clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Clear All Combatants';
    clearButton.addEventListener('click', function() {
      var confirmation = confirm('Are you sure you want to remove all combatants?');
      if (confirmation) {
        combatants = [];
        updateCombatantsList();
      }
    });

    combatTracker.appendChild(clearButton);

    return combatTracker;
}

function updateCombatantsList() {
    var combatantsList = document.getElementById('combatants-list');
    while (combatantsList.firstChild) {
        combatantsList.firstChild.remove();
    }

    for (var i = 0; i < combatants.length; i++) {
        (function(i) {
            var combatant = combatants[i];
    
            var combatantInfo = combatants[i].name + ' (' + combatants[i].initiative + ') ' 
            + combatants[i].characterType + ' - Health: ' + combatants[i].health;
        
            // Create a new list item
            var li = document.createElement('li');
        
            // New fields for health modification
            var damageInput = document.createElement('input');
            damageInput.type = 'number';
            damageInput.placeholder = 'Damage';

            var damageButton = document.createElement('button');
            damageButton.textContent = 'Apply Damage';
            damageButton.addEventListener('click', function() {
                combatant.health -= Number(damageInput.value);
                updateCombatantsList();
            });
        
            var healInput = document.createElement('input');
            healInput.type = 'number';
            healInput.placeholder = 'Healing';
        
            var healButton = document.createElement('button');
            healButton.textContent = 'Apply Healing';
            healButton.addEventListener('click', function() {
                combatants[i].health += Number(healInput.value); // Corrected here. Need to use combatants[i] not combatants.
                updateCombatantsList();
            });
        
            // New fields for status effects
            var statusInput = document.createElement('input');
            statusInput.type = 'text';
            statusInput.placeholder = 'Status Effect';
        
            var statusButton = document.createElement('button');
            statusButton.textContent = 'Add Status Effect';
            statusButton.addEventListener('click', function() {
                combatants[i].statusEffects.push(statusInput.value); // Corrected here. Need to use combatants[i] not combatants.
                updateCombatantsList();
            });
        
            var removeStatusButton = document.createElement('button');
            removeStatusButton.textContent = 'Remove Last Status Effect';
            removeStatusButton.addEventListener('click', function() {
                combatants[i].statusEffects.pop(); // Corrected here. Need to use combatants[i] not combatants.
                updateCombatantsList();
            });
        
            li.textContent = combatantInfo;
            li.appendChild(damageInput);
            li.appendChild(damageButton);
            li.appendChild(healInput);
            li.appendChild(healButton);
            li.appendChild(statusInput);
            li.appendChild(statusButton);
            li.appendChild(removeStatusButton);

            var removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function() {
                combatants.splice(i, 1);
                updateCombatantsList();
            });

            li.appendChild(removeButton);
            combatantsList.appendChild(li);
        })(i); // Pass i as an argument to the IIFE
    }

    localStorage.setItem('combatants', JSON.stringify(combatants));
}
