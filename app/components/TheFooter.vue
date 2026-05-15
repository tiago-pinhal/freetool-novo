<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()

const manageCookies = () => {
  import('vanilla-cookieconsent').then(m => m.showPreferences())
}
</script>

<template>
  <footer class="footer p-4 bg-base-200 text-base-content border-t border-base-content/5 mt-2 flex flex-wrap items-center justify-between gap-y-4 px-6 md:px-10">
    <aside class="flex items-center">
      <p class="text-sm opacity-60">
        &copy; {{ currentYear }} <span class="font-bold">FreeTool.Dev</span> — {{ t('r') }}
      </p>
    </aside>
    <nav class="flex flex-wrap gap-x-6 gap-y-2 justify-center" aria-label="Footer Navigation">
      <NuxtLink :to="localePath('about')" class="link link-hover font-medium underline-offset-4">{{ t('a') }}</NuxtLink>
      <NuxtLink :to="localePath('privacy')" class="link link-hover font-medium underline-offset-4">{{ t('p') }}</NuxtLink>
      <NuxtLink :to="localePath('terms-of-use')" class="link link-hover font-medium underline-offset-4">{{ t('t') }}</NuxtLink>
      <button class="link link-hover font-medium underline-offset-4" @click="manageCookies">{{ t('c') }}</button>
    </nav>
  </footer>
</template>

<i18n lang="yaml">
en:
    r: "All Rights Reserved"
    a: "About"
    p: "Privacy Policy"
    t: "Terms"
    c: "Cookies"
pt:
    r: "Todos os Direitos Reservados"
    a: "Sobre"
    p: "Política de Privacidade"
    t: "Termos"
    c: "Cookies"
es:
    r: "Todos los Derechos Reservados"
    a: "Sobre nosotros"
    p: "Política de Privacidad"
    t: "Términos"
    c: "Cookies"
fr:
    r: "Tous droits réservés"
    a: "À propos"
    p: "Politique de Confidentialité"
    t: "Conditions"
    c: "Cookies"
it:
    r: "Tutti i diritti riservati"
    a: "Su di noi"
    p: "Politica Sulla Privacy"
    t: "Termini"
    c: "Cookie"
id:
    r: "Semua Hak Dilindungi"
    a: "Tentang Kami"
    p: "Kebijakan Privasi"
    t: "Syarat dan Ketentuan"
    c: "Cookie"
de:
    r: "Alle Rechte vorbehalten"
    a: "Über uns"
    p: "Datenschutzrichtlinie"
    t: "Nutzungsbedingungen"
    c: "Cookies"
nl:
    r: "Alle rechten voorbehouden"
    a: "Over ons"
    p: "Privacybeleid"
    t: "Voorwaarden"
    c: "Cookies"
</i18n>
