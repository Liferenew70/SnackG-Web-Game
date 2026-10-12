let currentFile = null;
let currentFileName = '';
let currentFileExt = '';

// --- GESTION DE L'INTERFACE (VOTRE CODE ORIGINAL, INCHANGÉ) ---

function switchTab(event, tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');
    hideAlert();
}

function switchInput(event, method) {
    document.querySelectorAll('.input-method button').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    if (method === 'text') {
        document.getElementById('input-text').style.display = 'block';
        document.getElementById('file-upload').classList.remove('active');
    } else {
        document.getElementById('input-text').style.display = 'none';
        document.getElementById('file-upload').classList.add('active');
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    currentFile = file;
    currentFileName = file.name.substring(0, file.name.lastIndexOf('.'));
    currentFileExt = file.name.substring(file.name.lastIndexOf('.'));

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('input-text').value = e.target.result;
        document.getElementById('file-info').innerHTML = `
            <strong>✅ Fichier chargé:</strong> ${file.name} (${(file.size / 1024).toFixed(2)} KB)
        `;
        document.getElementById('file-info').style.display = 'block';
    };
    reader.readAsText(file);
}

// --- MOTEUR D'OBFUSCATION CORRIGÉ ---

// Fonctions de chiffrement robustes et réversibles
const btoaSafe = (str) => btoa(unescape(encodeURIComponent(str)));
const atobSafe = (str) => decodeURIComponent(escape(atob(str)));

const charSubstitution = (str) => {
    const map = {'A':'亜','B':'唖','C':'娃','D':'阿','E':'哀','F':'愛','G':'挨','H':'姶','I':'逢','J':'葵','K':'茜','L':'穐','M':'悪','N':'握','O':'渥','P':'旭','Q':'葦','R':'芦','S':'鯵','T':'梓','U':'圧','V':'斡','W':'扱','X':'宛','Y':'姐','Z':'虻'};
    return str.split('').map(c => map[c] || c).join('');
};

const reverseCharSubstitution = (str) => {
    const reverseMap = {'亜':'A','唖':'B','娃':'C','阿':'D','哀':'E','愛':'F','挨':'G','姶':'H','逢':'I','葵':'J','茜':'K','穐':'L','悪':'M','握':'N','渥':'O','旭':'P','葦':'Q','芦':'R','鯵':'S','梓':'T','圧':'U','斡':'V','扱':'W','宛':'X','姐':'Y','虻':'Z'};
    return str.split('').map(c => reverseMap[c] || c).join('');
};

const xorCipher = (str, key) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
};

// Algorithme de hashage et de mélange/démélange qui fonctionne
const hashCode = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return h >>> 0;
};

const prng = (seed) => {
    return function() {
        var t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

const shuffleString = (str, seed) => {
    let array = str.split('');
    const random = prng(hashCode(seed));
    let indices = [];
    for (let i = array.length - 1; i > 0; i--) {
        indices.push(Math.floor(random() * (i + 1)));
    }
    for (let i = 1; i < array.length; i++) {
        let j = indices[array.length - 1 - i];
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
};

const unshuffleString = (str, seed) => {
    let array = str.split('');
    const random = prng(hashCode(seed));
    let indices = [];
    for (let i = array.length - 1; i > 0; i--) {
        indices.push(Math.floor(random() * (i + 1)));
    }
    for (let i = array.length - 1; i > 0; i--) {
        let j = indices[array.length - 1 - i];
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
};


// --- FONCTIONNALITÉS PRINCIPALES (VOTRE CODE ADAPTÉ) ---

function obfuscateCode() {
    const startTime = performance.now();
    const input = document.getElementById('input-text').value;
    const key = document.getElementById('encrypt-key').value;
    
    if (!input.trim()) {
        showAlert('Veuillez entrer du code à obfusquer!', 'error');
        return;
    }
    
    if (key.length < 4) {
        showAlert('La clé doit contenir au moins 4 caractères!', 'warning');
        return;
    }

    try {
        // Application des couches d'obfuscation dans le bon ordre
        let obfuscated = xorCipher(input, key);
        obfuscated = btoaSafe(obfuscated);
        obfuscated = shuffleString(obfuscated, key);
        obfuscated = charSubstitution(obfuscated);

        const addComments = document.getElementById('add-comments').checked;
        let finalCode = '';
        
        if (addComments) {
            finalCode += '<!-- Encryption By @BJ_DEVS on Telegram -->\n';
            finalCode += '<!-- This tool encrypts your script with advanced multi-layer obfuscation -->\n\n';
        }
        
        // Génération du script final avec la logique de déchiffrement correcte
        finalCode += `<script>\nvar _0xdata = "${obfuscated}";\n`;
        finalCode += generateDeobfuscationScript(key); // Utilise la fonction corrigée
        finalCode += '\n<\/script>';

        document.getElementById('output-text').value = finalCode;
        document.getElementById('output-obfuscate').classList.add('show');
        
        const endTime = performance.now();
        document.getElementById('original-size').textContent = formatSize(input.length);
        document.getElementById('obfuscated-size').textContent = formatSize(finalCode.length);
        document.getElementById('exec-time').textContent = (endTime - startTime).toFixed(2) + 'ms';
        
        showAlert('✅ Code obfusqué avec succès!', 'success');
    } catch (error) {
        showAlert('❌ Erreur lors de l\'obfuscation: ' + error.message, 'error');
    }
}

// CORRECTION MAJEURE ICI : Le script généré utilise maintenant document.write()
function generateDeobfuscationScript(key) {
    // Ce code sera injecté dans la page finale. Il est minifié pour prendre moins de place.
    return `(function(p){function d(s,k){let r='';for(let i=0;i<s.length;i++){r+=String.fromCharCode(s.charCodeAt(i)^k.charCodeAt(i%k.length));}return r}function u(s){return decodeURIComponent(escape(atob(s)))}function s(t,d){let a=t.split(''),n=function(s){return function(){var t=s+=0x6D2B79F5;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}(function(s){let t=0;for(let a=0;a<s.length;a++)t=(t<<5)-t+s.charCodeAt(a),t|=0;return t>>>0}(d)),e=[];for(let s=a.length-1;s>0;s--)e.push(Math.floor(n()*(s+1)));for(let s=a.length-1;s>0;s--){let t=e[a.length-1-s];[a[s],a[t]]=[a[t],a[s]]}return a.join('')}function r(s){const t={"亜":"A","唖":"B","娃":"C","阿":"D","哀":"E","愛":"F","挨":"G","姶":"H","逢":"I","葵":"J","茜":"K","穐":"L","悪":"M","握":"N","渥":"O","旭":"P","葦":"Q","芦":"R","鯵":"S","梓":"T","圧":"U","斡":"V","扱":"W","宛":"X","姐":"Y","虻":"Z"};return s.split('').map(s=>t[s]||s).join('')}document.write(d(u(s(r(_0xdata),"${key}")),"${key}"));})("${key}");`;
}

function deobfuscateCode() {
    const input = document.getElementById('deobfuscate-input').value;
    const key = document.getElementById('decrypt-key').value;
    
    if (!input.trim()) {
        showAlert('Veuillez entrer du code à déobfusquer!', 'error');
        return;
    }
    
    try {
        const match = input.match(/var _0xdata = "(.+?)";/);
        if (!match) {
            showAlert('Format de code obfusqué invalide!', 'error');
            return;
        }
        
        let obfuscated = match[1];
        
        // Ordre inverse exact de l'obfuscation
        obfuscated = reverseCharSubstitution(obfuscated);
        obfuscated = unshuffleString(obfuscated, key);
        obfuscated = atobSafe(obfuscated);
        const decoded = xorCipher(obfuscated, key);
        
        document.getElementById('deobfuscate-output').value = decoded;
        document.getElementById('output-deobfuscate').classList.add('show');
        
        showAlert('✅ Code déobfusqué avec succès!', 'success');
    } catch (error) {
        showAlert('❌ Erreur: Clé incorrecte ou code invalide!', 'error');
    }
}


// --- UTILITAIRES (VOTRE CODE ORIGINAL, INCHANGÉ) ---

function copyOutput() {
    const text = document.getElementById('output-text').value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showAlert('📋 Code copié dans le presse-papiers!', 'success');
    }).catch(err => {
        showAlert('❌ Erreur lors de la copie.', 'error');
    });
}

function copyDeobfuscated() {
    const text = document.getElementById('deobfuscate-output').value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showAlert('📋 Code copié dans le presse-papiers!', 'success');
    }).catch(err => {
        showAlert('❌ Erreur lors de la copie.', 'error');
    });
}

function downloadOutput() {
    const content = document.getElementById('output-text').value;
    if (!content) return;
    const filename = currentFileName || 'obfuscated';
    const ext = currentFileExt || '.html';
    downloadFile(content, filename + '_obfuscated' + ext);
}

function downloadDeobfuscated() {
    const content = document.getElementById('deobfuscate-output').value;
    if (!content) return;
    downloadFile(content, 'deobfuscated.html');
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showAlert('💾 Fichier téléchargé avec succès!', 'success');
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
}

function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.className = 'alert alert-' + type + ' show';
    alert.textContent = message;
    setTimeout(() => hideAlert(), 5000);
}

function hideAlert() {
    document.getElementById('alert').classList.remove('show');
}

function clearAll() {
    document.getElementById('input-text').value = '';
    document.getElementById('output-text').value = '';
    document.getElementById('file-info').style.display = 'none';
    document.getElementById('file-input').value = '';
    document.getElementById('output-obfuscate').classList.remove('show');
    currentFile = null;
    currentFileName = '';
    currentFileExt = '';
    hideAlert();
}

function clearDeobfuscate() {
    document.getElementById('deobfuscate-input').value = '';
    document.getElementById('deobfuscate-output').value = '';
    document.getElementById('output-deobfuscate').classList.remove('show');
    hideAlert();
}