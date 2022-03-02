import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { register } from 'timeago.js';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translations: {
                'Sign Up': 'Sign Up',
                'Password mismatch': 'Password mismatch',
                'ID': 'ID',
                'Username': 'Username',
                'Password': 'Password',
                'Password Repeat': 'Password Repeat',
                'Login': 'Login',
                'Logout': 'Logout',
                'Users': 'Users',
                'Next': 'Next',
                'Previous': 'Previous',
                'Load Failure': 'Load Failure',
                'User not found!': 'User not found!',
                'Edit': 'Edit',
                'Cancel': 'Cancel',
                'Save': 'Save',
                'Change Username': 'Change Username',
                'My Profile': 'My Profile',
                'Send': 'Send',
                'There is no message': 'There is no message',
                'Load old messages': 'Load old messages',
                'There are new messages': 'There are new messages',
                'This attachment type has not been supported!' : 'This attachment type has not been supported!',
                'Delete Message': 'Delete Message',
                'Are you sure to delete this message ?': 'Are you sure to delete this message ?',
                'Delete My Account': 'Delete My Account',
                'Are you sure to delete your account?': 'Are you sure to delete your account?'
            }
        },
        tr: {
            translations: {
                'Sign Up': 'Kayıt Ol',
                'Password mismatch': 'Parolalar eşleşmiyor',
                'ID': 'Kullanıcı Kimliği',
                'Username': 'Kullanıcı Adı',
                'Password': 'Parola',
                'Password Repeat': 'Parola Tekrarı',
                'Login': 'Giriş Yap',
                'Logout': 'Çıkış Yap',
                'Users': 'Kullanıcılar',
                'Next': 'Sonraki',
                'Previous': 'Önceki',
                'Load Failure': 'Liste bulunamadı',
                'User not found!': 'Kullanıcı bulunamadı!',
                'Edit': 'Düzenle',
                'Cancel': 'İptal',
                'Save': 'Kaydet',
                'Change Username': 'Kullanıcı adını değiştir',
                'My Profile': 'Profil Sayfam',
                'Send': 'Gönder',
                'There is no message': 'Gösterilecek mesaj yok',
                'Load old messages': 'Eski mesajları görüntüle',
                'There are new messages': 'Okunmamış mesajlar var',
                'This attachment type has not been supported!': 'Bu dosya tipi desteklenmemektedir!',
                'Delete Message': 'Mesajı Sil',
                'Are you sure to delete this message ?': 'Mesajı silmek istediğinize emin misiniz ?',
                'Delete My Account': 'Hesabımı Sil',
                'Are you sure to delete your account?': 'Hesabını silmek istediğine emin misin?'
            }
        }
    },
    fallbackLng: 'tr',
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    interpolation: {
        escapeValue: false,
        formatSeparator: ','
    },
    react: {
        wait: true
    }
});

const timeagoTR = (number, index) => {
    return [
        ['az önce', 'şimdi'],
        ['%s saniye önce', '%s saniye içinde'],
        ['1 dakika önce', '1 dakika içinde'],
        ['%s dakika önce', '%s dakika içinde'],
        ['1 saat önce', '1 saat içinde'],
        ['%s saat önce', '%s saat içinde'],
        ['1 gün önce', '1 gün içinde'],
        ['%s gün önce', '%s gün içinde'],
        ['1 hafta önce', '1 hafta içinde'],
        ['%s hafta önce', '%s hafta içinde'],
        ['1 ay önce', '1 ay içinde'],
        ['%s ay önce', '%s ay içinde'],
        ['1 yıl önce', '1 yıl içinde'],
        ['%s yıl önce', '%s yıl içinde'],
    ][index];
}
register('tr', timeagoTR);

export default i18n;
