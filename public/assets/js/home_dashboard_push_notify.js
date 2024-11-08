$(document).ready(function () {
    const csrf_tokenGL = document.querySelector('meta[name="csrf_token"]').content;
    const service_worker_file_js = document.querySelector('meta[name="service-worker-file-js"]').content;
    const public_key_push_notification = document.querySelector('meta[name="public-key-push-notification"]').content;

    navigator.serviceWorker.register(service_worker_file_js);

    function askForPermission() {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                // get service worker
                navigator.serviceWorker.ready.then((sw) => {
                    // subscribe
                    sw.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: public_key_push_notification,
                    }).then((subscription) => {
                        console.log("sub ok:" + JSON.stringify(subscription));

                        // save subscription browser
                        saveSub(JSON.stringify(subscription));
                    }).catch((error) => {
                        console.error("Subscription failed: ", error);
                        showError("enable notifications error: ", error);
                    });
                });
            }
        });
    }

    function btnEnableNotifications() {
        $('#btn-enable-notification').on('click', function () {
            askForPermission();
        });
    }

    btnEnableNotifications();

    function saveSub(sub) {
        $.ajax({
            type: 'POST',
            url: '/save-push-notification-sub',
            data: {
                '_token': csrf_tokenGL,
                'sub': sub,
            },
            success: function (data) {
                showSuccess('Notification enabled successfully🎉');
            },
            error: function (error) {
                showError('Failed to save subscription:', error);
            }
        });
    }
});