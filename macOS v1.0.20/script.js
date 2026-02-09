window.onload = () => {
    setTimeout(() => {
        document.getElementById('boot-screen').style.display = 'none';
        document.getElementById('os-content').style.display = 'block';
        createWindow('settings'); // Mở About Mac ngay khi vào
    }, 3200);
};

function updateSystem() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
    if (navigator.getBattery) {
        navigator.getBattery().then(bat => {
            document.getElementById('battery-status').innerHTML = `${Math.round(bat.level * 100)}% <i class="fas fa-battery-full"></i>`;
        });
    }
}
setInterval(updateSystem, 1000);

let zIndex = 1000;

function createWindow(type) {
    const container = document.getElementById('window-container');
    const win = document.createElement('div');
    win.className = 'window';
    win.style.left = '250px'; win.style.top = '120px'; win.style.zIndex = ++zIndex;

    let appContent = '';
    if (type === 'settings') {
        appContent = `
            <div style="padding: 30px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" width="60" style="margin-bottom: 15px;">
                <h2 style="margin: 0;">Mac mini</h2>
                <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Late 2022</p>
                <div style="width: 100%; text-align: left; font-size: 13px; line-height: 1.8; border-top: 1px solid #eee; padding-top: 15px;">
                    <p><b>Processor:</b> Apple M2 Chip</p>
                    <p><b>Memory:</b> 16 GB Unified Memory</p>
                    <p><b>macOS:</b> Big Sur 11.0</p>
                    <p><b>Serial Number:</b> C02MX8PVMD6M</p>
                </div>
            </div>`;
    } else if (type === 'safari') {
        appContent = `<iframe src="https://www.wikipedia.org"></iframe>`;
    } else if (type === 'notes') {
        appContent = `<textarea style="width:100%;height:100%;padding:20px;border:none;outline:none;font-size:16px"></textarea>`;
    } else {
        appContent = `<div style="padding:40px; text-align:center;">📂 Thư mục trống</div>`;
    }

    win.innerHTML = `
        <div class="window-header">
            <div class="traffic-lights">
                <div class="light red" onclick="this.closest('.window').remove()"></div>
                <div class="light yellow" onclick="minimizeWindow(this)"></div>
                <div class="light green" onclick="toggleMaximize(this)"></div>
            </div>
            <div style="flex:1; text-align:center; font-size:12px; font-weight:600; color:#444">${type === 'settings' ? 'About This Mac' : type.toUpperCase()}</div>
        </div>
        <div class="window-content">${appContent}<div class="iframe-shield"></div></div>`;

    container.appendChild(win);
    initDrag(win);
}

function minimizeWindow(el) {
    const win = el.closest('.window');
    win.style.transform = 'scale(0.3) translateY(1000px)';
    win.style.opacity = '0';
    setTimeout(() => win.remove(), 300);
}

function toggleMaximize(el) {
    const win = el.closest('.window');
    if (win.style.width === '100vw') {
        win.style.width = '800px'; win.style.height = '500px'; win.style.top = '100px'; win.style.left = '200px';
    } else {
        win.style.width = '100vw'; win.style.height = 'calc(100vh - 30px)'; win.style.top = '30px'; win.style.left = '0';
    }
}

function initDrag(el) {
    const header = el.querySelector('.window-header');
    const shield = el.querySelector('.iframe-shield');
    let isDragging = false, offset = { x: 0, y: 0 };
    header.onmousedown = (e) => {
        if (el.style.width === '100vw') return;
        isDragging = true;
        offset.x = e.clientX - el.offsetLeft; offset.y = e.clientY - el.offsetTop;
        el.style.zIndex = ++zIndex; shield.style.display = 'block';
    };
    document.onmousemove = (e) => {
        if (!isDragging) return;
        el.style.left = (e.clientX - offset.x) + 'px'; el.style.top = (e.clientY - offset.y) + 'px';
    };
    document.onmouseup = () => { isDragging = false; shield.style.display = 'none'; };
}