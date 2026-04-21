<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer p-4 bg-base-200 text-base-content border-t border-base-content/5 mt-auto flex flex-wrap items-center justify-between gap-y-4 px-6 md:px-10">
    <aside class="flex items-center">
      <p class="text-sm opacity-60">
        &copy; {{ currentYear }} <span class="font-bold">FreeTool.Dev</span> — {{ t('r') }}
      </p>
    </aside>
    <nav class="flex flex-wrap gap-x-6 gap-y-2 justify-center" aria-label="Footer Navigation">
      <NuxtLink :to="localePath('about')" class="link link-hover font-medium underline-offset-4">{{ t('a') }}</NuxtLink>
      <NuxtLink :to="localePath('privacy')" class="link link-hover font-medium underline-offset-4">{{ t('p') }}</NuxtLink>
      <NuxtLink :to="localePath('terms-of-use')" class="link link-hover font-medium underline-offset-4">{{ t('t') }}</NuxtLink>
    </nav>
  </footer>
</template>

<i18n lang="yaml">
en:
    r: "All Rights Reserved"
    a: "About"
    p: "Privacy Policy"
    t: "Terms"
pt:
    r: "Todos os Direitos Reservados"
    a: "Sobre"
    p: "Política de Privacidade"
    t: "Termos"
es:
    r: "Todos los Derechos Reservados"
    a: "Sobre"
    p: "Política de Privacidad"
    t: "Términos"
fr:
    r: "Tous droits réservés"
    a: "Propos"
    p: "Politique de Confidentialité"
    t: "Conditions"
it:
    r: "Tutti i diritti riservati"
    a: "Su di noi"
    p: "Politica Sulla Privacy"
    t: "Termini"
id:
    r: "Semua Hak Dilindungi"
    a: "Tentang Kami"
    p: "Kebijakan Privasi"
    t: "Syarat dan Ketentuan"
de:
    r: "Alle Rechte vorbehalten"
    a: "Über uns"
    p: "Datenschutzerklärung"
    t: "Bedingungen"
</i18n>
