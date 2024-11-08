// Disable right-click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Detect developer tools
(function () {
    let devtoolsOpened = false;

    const checkDevTools = setInterval(() => {
        const threshold = 160;
        const width = window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold;

        if (width) {
            devtoolsOpened = true;
            alert("Please do not use developer tools!");
            // Optionally redirect or close the tab (not recommended)
            // window.close();
        } else {
            devtoolsOpened = false;
        }
    }, 1000);

    setTimeout(() => clearInterval(checkDevTools), 10000); // Stop checking after 10 seconds
})();

// Preventing certain key combinations
document.addEventListener('keydown', function (event) {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        event.preventDefault();
    }
});