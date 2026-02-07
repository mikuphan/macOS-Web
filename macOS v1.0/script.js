/* --- 1. HỆ THỐNG THỜI GIAN THỰC --- */
function updateClock() {
    const now = new Date();
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    // Định dạng giờ:phút
    const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    // Định dạng ngày
    const date = `${days[now.getDay()]} ${now.getDate()} thg ${now.getMonth() + 1}`;
    
    document.getElementById('clock').innerHTML = `${date} &nbsp; ${time}`;
}
setInterval(updateClock, 1000);
updateClock();

/* --- 2. HỆ THỐNG PIN THỰC (BATTERY API) --- */
function initBattery() {
    const batteryLevel = document.getElementById('battery-level');
    const batteryIcon = document.getElementById('battery-icon');

    // Kiểm tra trình duyệt có hỗ trợ không
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            updateBatteryUI(battery);

            // Cập nhật khi pin thay đổi
            battery.addEventListener('levelchange', () => updateBatteryUI(battery));
            battery.addEventListener('chargingchange', () => updateBatteryUI(battery));
        });
    } else {
        batteryLevel.textContent = "Laptop"; // Không hỗ trợ
    }

    function updateBatteryUI(battery) {
        const level = Math.round(battery.level * 100);
        batteryLevel.textContent = level + '%';

        // Chọn icon phù hợp
        let iconClass = 'fas fa-battery-full';
        if (battery.charging) {
            iconClass = 'fas fa-bolt'; // Đang sạc
        } else if (level < 20) {
            iconClass = 'fas fa-battery-quarter';
            batteryIcon.style.color = '#ff5f57'; // Màu đỏ khi pin yếu
        } else if (level < 50) {
            iconClass = 'fas fa-battery-half';
            batteryIcon.style.color = 'white';
        } else {
            iconClass = 'fas fa-battery-full';
            batteryIcon.style.color = 'white';
        }
        
        batteryIcon.innerHTML = `<i class="${iconClass}"></i>`;
    }
}
initBattery();

/* --- 3. XỬ LÝ KÉO CỬA SỔ (DRAG) --- */
const windowEl = document.getElementById("myWindow");
const headerEl = document.getElementById("windowHeader");
const shield = document.getElementById("iframeShield");

let isDragging = false;
let offsetX = 0, offsetY = 0;

headerEl.addEventListener("mousedown", (e) => {
    isDragging = true;
    // Tính khoảng cách từ chuột đến góc trên trái cửa sổ
    offsetX = e.clientX - windowEl.offsetLeft;
    offsetY = e.clientY - windowEl.offsetTop;
    
    // Bật khiên chắn iframe để chuột không bị iframe bắt mất
    shield.style.display = "block";
    windowEl.style.zIndex = "1000"; // Đưa cửa sổ lên trên cùng
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    
    // Tính vị trí mới
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Giới hạn không cho kéo mất khỏi màn hình
    if (newTop < 30) newTop = 30; // Không che menu bar

    windowEl.style.left = newLeft + "px";
    windowEl.style.top = newTop + "px";
});

document.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        shield.style.display = "none"; // Tắt khiên chắn
    }
});

/* --- 4. XỬ LÝ RESIZE (THAY ĐỔI KÍCH THƯỚC) --- */
const resizer = document.getElementById("resizer");
let isResizing = false;

resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    shield.style.display = "block"; // Bật khiên chắn iframe
    e.preventDefault(); // Ngăn chọn văn bản
});

document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    
    // Tính kích thước mới dựa trên vị trí chuột
    const newWidth = e.clientX - windowEl.offsetLeft;
    const newHeight = e.clientY - windowEl.offsetTop;

    // Set kích thước (CSS đã có min-width/min-height để không bị quá nhỏ)
    windowEl.style.width = newWidth + "px";
    windowEl.style.height = newHeight + "px";
});

document.addEventListener("mouseup", () => {
    if (isResizing) {
        isResizing = false;
        shield.style.display = "none";
    }
});

/* --- 5. CHỨC NĂNG TRÌNH DUYỆT --- */
const urlInput = document.getElementById('urlInput');
const iframe = document.getElementById('browserFrame');

function loadUrl() {
    let url = urlInput.value.trim();
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    iframe.src = url;
    urlInput.value = url;
}

function handleEnter(e) {
    if (e.key === 'Enter') loadUrl();
}

// Điều khiển cửa sổ (Đèn giao thông)
function closeWindow() {
    windowEl.style.display = 'none';
}
function minimizeWindow() {
    windowEl.style.transform = 'scale(0.8) translateY(100vh)';
    windowEl.style.opacity = '0';
    setTimeout(() => { windowEl.style.display = 'none'; }, 300);
}
function openWindow() {
    windowEl.style.display = 'flex';
    // Reset hiệu ứng minimize
    setTimeout(() => {
        windowEl.style.transform = 'none';
        windowEl.style.opacity = '1';
    }, 10);
}
function maximizeWindow() {
    if (windowEl.style.width === '100%') {
        // Restore
        windowEl.style.width = '800px';
        windowEl.style.height = '500px';
        windowEl.style.top = '100px';
        windowEl.style.left = '200px';
        windowEl.style.borderRadius = '10px';
    } else {
        // Fullscreen
        windowEl.style.width = '100%';
        windowEl.style.height = 'calc(100vh - 30px)';
        windowEl.style.top = '30px';
        windowEl.style.left = '0';
        windowEl.style.borderRadius = '0';
    }
}