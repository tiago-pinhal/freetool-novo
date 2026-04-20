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
</script>

<template>
  <header class="sticky top-0 z-40 w-full h-[77px] border-b border-base-content/5 bg-base-100/75 backdrop-blur-md transition-all duration-300 flex items-center px-2">
    <div class="mx-auto px-4 w-full">
      <div class="flex justify-between items-center w-full">
        <!-- Esquerda: Toggle & Logo -->
        <div class="flex items-center gap-4">
          <button
            v-if="!isHomePage"
            @click="toggleMenu"
            class="btn btn-ghost btn-square lg:hidden"
            aria-label="Menu"
          >
            <Icon name="bars-3-bottom-left.svg?width=24&height=24" />
          </button>

          <NuxtLink :to="localePath('/')" class="flex items-center text-2xl font-bold text-base-content transition-transform active:scale-95 whitespace-nowrap">
            𝗙𝗿𝗲𝗲𝗧𝗼𝗼𝗹
            <span class="ml-2 text-sm font-medium px-2 py-0.5 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white uppercase tracking-wider">
              DEV
            </span>
          </NuxtLink>
        </div>

        <!-- Direita: Seletor de Idiomas -->
        <div class="flex items-center">
          <div class="dropdown dropdown-end group">
            <div
              tabindex="0"
              role="button"
              class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-base-content hover:bg-base-200 transition-colors duration-200 cursor-pointer"
            >
              <Icon name="language.svg?width=18&height=18" />
              <span class="hidden sm:inline font-medium">{{ currentLocaleName }}</span>
              <Icon name="chevron-down.svg?width=18&height=18" class="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            <ul
              tabindex="0"
              class="dropdown-content z-[100] menu p-2 shadow-xl bg-base-200 rounded-lg w-44 mt-2 border border-base-content/10"
            >
              <li v-for="loc in otherLocales" :key="loc.code">
                <NuxtLink
                  :to="switchLocalePath(loc.code)"
                  class="text-base-content hover:bg-base-300 transition-colors rounded-md"
                >
                  {{ loc.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
