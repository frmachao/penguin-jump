export function setupControls() {
    const keys = document.querySelectorAll('.control-key');
    
    // 键盘事件处理
    window.addEventListener('keydown', (e) => {
        const key = document.querySelector(`[data-key="${e.key}"]`);
        if (key) {
            key.classList.add('pressed');
        }
    });

    window.addEventListener('keyup', (e) => {
        const key = document.querySelector(`[data-key="${e.key}"]`);
        if (key) {
            key.classList.remove('pressed');
        }
    });

    // 鼠标/触摸事件处理
    keys.forEach(key => {
        key.addEventListener('mousedown', () => {
            key.classList.add('pressed');
            // 触发对应的键盘事件
            const keyEvent = new KeyboardEvent('keydown', {
                key: key.getAttribute('data-key') || ''
            });
            window.dispatchEvent(keyEvent);
        });

        key.addEventListener('mouseup', () => {
            key.classList.remove('pressed');
            // 触发对应的键盘事件
            const keyEvent = new KeyboardEvent('keyup', {
                key: key.getAttribute('data-key') || ''
            });
            window.dispatchEvent(keyEvent);
        });

        // 处理触摸设备
        key.addEventListener('touchstart', (e) => {
            e.preventDefault();
            key.classList.add('pressed');
            const keyEvent = new KeyboardEvent('keydown', {
                key: key.getAttribute('data-key') || ''
            });
            window.dispatchEvent(keyEvent);
        });

        key.addEventListener('touchend', (e) => {
            e.preventDefault();
            key.classList.remove('pressed');
            const keyEvent = new KeyboardEvent('keyup', {
                key: key.getAttribute('data-key') || ''
            });
            window.dispatchEvent(keyEvent);
        });
    });
} 