function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.backgroundColor = color;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
    }, 2000);

    setTimeout(() => {
        notification.remove();
    }, 2500);
}
