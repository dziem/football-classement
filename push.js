var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BLoVaODFjLtaxJuFU5TiwDzAROr9efDkSqq_OjYGoyD55QkWa6gOrRbw3T5WvATGe5jZXzMbyrcMHUaaRVC3BG4",
   "privateKey": "v7xz0tMaWEWPw6XD0rX3b-R79fY_vi_PA9T9q-ZDB4o"
};
 
 
webPush.setVapidDetails(
   'mailto:dziemboh@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": " https://updates.push.services.mozilla.com/wpush/v2/gAAAAABewOV8o37uS7ljKEglRIKFoQt5jLyPQMZphncGdugO-2D7md-LMR_EMDgpEp9_02jcgcg1KAzG7MkWft2dziyhZyOKFqp88ev7WnREOL2Di5sggt1qj1sXTBDPkanCm_96qh3gqULZNuScA_eBzq3Pen8MEheS45rz65Eu0Yuc4JrT08Q",
   "keys": {
	   "p256dh": "BLHPRhfq1mXkPYx5FuZVC35BKFu/8d0sNhDMyyex/abnQpKUOEzp0eSz0TdX6zqm7QtXDnAgGIRH+PjaKkWfaPg=",
	   "auth": "JMyRiXRus9gOBelTiMfcJQ=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '282922161193',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);