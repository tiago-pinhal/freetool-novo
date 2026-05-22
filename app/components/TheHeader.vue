<script setup lang="ts">
const { locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const currentLocale = computed(() => {
  return locales.value.find((l: any) => l.code === locale.value)
})

const currentLocaleName = computed(() => {
  const current = currentLocale.value
  return typeof current === 'object' ? (current as any).name : current
})

const otherLocales = computed(() => {
  return locales.value.filter((l: any) => l.code !== locale.value)
})

const toggleMenu = () => {
  const checkbox = document.getElementById('main-drawer') as HTMLInputElement | null
  if (checkbox) checkbox.checked = !checkbox.checked
}

const route = useRoute()
const detailsRef = ref<HTMLDetailsElement | null>(null)
</script>

<template>
  <header class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-content/5 w-full sticky top-0 z-50 h-16 px-2 sm:px-4">
    <div class="navbar-start flex items-center h-full">
      <button
        @click="toggleMenu"
        class="btn btn-ghost px-2 lg:hidden mr-1"
        aria-label="Menu"
        title="Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </button>
      <NuxtLink :to="localePath('/')" class="header-title">
        𝗙𝗿𝗲𝗲𝗧𝗼𝗼𝗹
        <span>
          DEV
        </span>
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <div class="flex items-center">
        <ul class="menu menu-horizontal p-0">
          <li>
            <details ref="detailsRef">
              <summary class="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-base-content hover:bg-base-content/10 transition-colors duration-200 cursor-pointer list-none">
                <Icon name="language.svg?width=18&height=18" aria-hidden="true" />
                <span class="hidden sm:inline font-medium text-sm">{{ currentLocaleName }}</span>
              </summary>
              <ul class="p-2 bg-base-200 rounded-lg w-44 mt-2 z-[100] shadow-xl border border-base-content/10 right-0">
                <li v-for="loc in otherLocales" :key="loc.code">
                  <NuxtLink
                    :to="switchLocalePath(loc.code)"
                    class="text-sm font-medium whitespace-nowrap"
                    @click="detailsRef ? detailsRef.removeAttribute('open') : null"
                  >
                    {{ loc.name }}
                  </NuxtLink>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
