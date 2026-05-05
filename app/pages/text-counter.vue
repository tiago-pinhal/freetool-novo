<script setup lang="ts">
import { reactive, watch, computed, onMounted } from 'vue'

const { t } = useI18n({ useScope: 'local' })

const faqs = computed(() => [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') }
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [
    t('f_1'),
    t('f_2'),
    t('f_3'),
    t('f_4')
  ],
  faq: faqs.value
})

useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('meta') }
  ],
  script: [
    { src: 'https://cdn.jsdelivr.net/npm/countable@3.0.1/Countable.js', defer: true, crossorigin: "anonymous", referrerpolicy: "no-referrer" }
  ]
})

interface State { 
  text: string; 
  words: number; 
  paragraphs: number; 
  lines: number; 
  chars: number; 
  all: number; 
  ads: boolean; 
}
const state: State = reactive({ 
  text: '', 
  words: 0, 
  paragraphs: 0, 
  lines: 0, 
  chars: 0, 
  all: 0, 
  ads: false 
})

function updateCounts() {
    if (import.meta.client && (window as any).Countable) {
        (window as any).Countable.count(state.text, (totals: any) => {
            state.words = totals.words;
            state.paragraphs = totals.paragraphs;
            state.lines = state.text !== '' ? state.text.split(/\r\n|\r|\n/).length : 0;
            state.chars = totals.characters;
            state.all = totals.all;

            if (!state.ads && state.words) {
                state.ads = true;
            }
        })
    }
}

onMounted(() => {
    // Attempt an initial count once script loads
    const interval = setInterval(() => {
        if ((window as any).Countable) {
            updateCounts();
            clearInterval(interval);
        }
    }, 100);
    // clear after 5s just in case
    setTimeout(() => clearInterval(interval), 5000);
})

watch(() => state.text, () => {
    updateCounts();
})

// Localized Routes
defineI18nRoute({
  paths: {
    en: '/text-counter',
    pt: '/contador-de-texto',
    es: '/contador-de-texto',
    fr: '/compteur-de-texte',
    it: '/contatore-di-testo',
    id: '/penghitung-teks',
    de: '/text-zaehler',
    nl: '/tekstteller'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('converter'), to: 'text-converter' },
      { label: t('ascii'), to: 'ascii-letter-generator' },
      { label: t('fancy'), to: 'fancy-letters' },
      { label: t('generator'), to: 'text-generator' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Input Area -->
      <div class="form-control w-full">
        <textarea 
          id="txt"
          v-model="state.text"
          rows="8"
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl text-lg leading-relaxed" 
          :placeholder="t('plc')"
          autofocus
        ></textarea>
      </div>

      <!-- Result Area (Stats) -->
      <div class="stats stats-vertical lg:stats-horizontal shadow w-full border border-base-content/10 bg-base-200">
        <div class="stat text-center lg:border-r lg:border-base-content/10 border-b lg:border-b-0 border-base-content/10">
          <div class="stat-title whitespace-normal">{{ t('words') }}</div>
          <div class="stat-value text-primary">{{ state.words }}</div>
        </div>
        <div class="stat text-center lg:border-r lg:border-base-content/10 border-b lg:border-b-0 border-base-content/10">
          <div class="stat-title whitespace-normal">{{ t('chars') }}</div>
          <div class="stat-value text-primary">{{ state.chars }}</div>
        </div>
        <div class="stat text-center lg:border-r lg:border-base-content/10 border-b lg:border-b-0 border-base-content/10">
          <div class="stat-title whitespace-normal">{{ t('chars') }} ({{ t('all') }})</div>
          <div class="stat-value text-primary">{{ state.all }}</div>
        </div>
        <div class="stat text-center lg:border-r lg:border-base-content/10 border-b lg:border-b-0 border-base-content/10">
          <div class="stat-title whitespace-normal">{{ t('paragraphs') }}</div>
          <div class="stat-value text-primary">{{ state.paragraphs }}</div>
        </div>
        <div class="stat text-center">
          <div class="stat-title whitespace-normal">{{ t('lines') }}</div>
          <div class="stat-value text-primary">{{ state.lines }}</div>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <p class="text-base-content/80 leading-relaxed">{{ t('about_desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4')]"
        />

        <UseCaseSection
          :title="t('apps_title')"
          :items="[
            { title: t('app_1_t'), description: t('app_1_d') },
            { title: t('app_2_t'), description: t('app_2_d') },
            { title: t('app_3_t'), description: t('app_3_d') },
            { title: t('app_4_t'), description: t('app_4_d') },
            { title: t('app_5_t'), description: t('app_5_d') }
          ]"
        />

        <UseCaseSection
          :title="t('edge_title')"
          :description="t('edge_desc')"
          :items="[
            { title: t('edge_1_t'), description: t('edge_1_d') },
            { title: t('edge_2_t'), description: t('edge_2_d') },
            { title: t('edge_3_t'), description: t('edge_3_d') },
            { title: t('edge_4_t'), description: t('edge_4_d') }
          ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <FaqSection :title="t('faq_title')" :items="faqs" />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    title: "Contador de Palavras e Caracteres",
    ogLocale: "pt_BR",
    meta: "Saiba rapidamente quantas palavras, caracteres, parágrafos e linhas há no seu texto.",
    about_desc: "O Contador de Texto é uma ferramenta online e gratuita que oferece precisão e agilidade na análise de conteúdos escritos. Com processamento em tempo real, você acompanha instantaneamente a quantidade de palavras, caracteres, linhas e parágrafos de qualquer texto. Ideal para profissionais de SEO, estudantes, redatores e social media, a ferramenta ajuda a manter seus conteúdos dentro de limites, padrões e exigências específicas com muito mais praticidade.",
    how_to_use_title: "Como usar o Contador de Texto",
    step_1_title: "Insira o seu texto",
    step_1_desc: "Digite ou cole o conteúdo que você deseja analisar.",
    step_2_title: "Veja os resultados",
    step_2_desc: "Os totais de palavras, caracteres, linhas e parágrafos são atualizados instantaneamente enquanto o texto é inserido ou atualizado.",
    step_3_title: "Analise as métricas",
    step_3_desc: "Utilize as estatísticas em tempo real para validar limites de conteúdo e atender critérios de SEO, redes sociais ou trabalhos acadêmicos.",
    apps_title: "Aplicações e Casos de Uso",
    app_1_t: "Redação para SEO",
    app_1_d: "Otimize títulos e meta descriptions mantendo-os dentro dos limites ideais de caracteres para motores de busca.",
    app_2_t: "Redes Sociais",
    app_2_d: "Garanta que seus posts caibam nos limites de plataformas como X (Twitter), Instagram, LinkedIn e WhatsApp.",
    app_3_t: "Trabalhos Acadêmicos",
    app_3_d: "Acompanhe a contagem exata de palavras e parágrafos para redações, artigos, teses e relatórios escolares.",
    app_4_t: "Copy de Marketing",
    app_4_d: "Valide o tamanho de anúncios, chamadas, e-mails e textos para landing pages com precisão.",
    app_5_t: "Edição e Revisão",
    app_5_d: "Compare versões de um texto e controle a expansão ou redução de conteúdo de forma prática.",
    edge_title: "Precisão e Casos Especiais",
    edge_desc: "Este contador de texto cobre os detalhes práticos que normalmente importam.",
    edge_1_t: "Caracteres com e sem espaços",
    edge_1_d: "exibimos os dois totais porque cada plataforma define 'caractere' de forma diferente, por exemplo: o X (Twitter) conta espaços, outros limites editoriais não contam",
    edge_2_t: "Contagem de linhas",
    edge_2_d: "importante para formulários, roteiros e redações com limite por linha",
    edge_3_t: "Contagem de parágrafos",
    edge_3_d: "útil para verificar estrutura em artigos, posts e textos formatados",
    edge_4_t: "Atualização em tempo real",
    edge_4_d: "os totais mudam enquanto você digita ou cola um texto",
    faq_title: "Perguntas Frequentes",
    faq1q: "Qual a diferença entre caracteres e caracteres com espaços?",
    faq1a: "Caracteres normalmente contam letras, números e pontuação sem incluir espaços. Caracteres com espaços também somam os espaços em branco no total.",
    faq2q: "O contador funciona com textos em outros idiomas?",
    faq2a: "Sim. A ferramenta funciona com qualquer idioma que use espaços para separar palavras, como inglês, espanhol, francês, alemão e outros. A contagem de caracteres independe do idioma.",
    faq3q: "Há limite de tamanho de texto que posso analisar?",
    faq3a: "Não. Não há limite imposto pela ferramenta. O processamento é feito diretamente no seu navegador, então você pode colar textos longos como artigos, teses ou scripts sem restrição.",
    features_title: "Principais Funcionalidades",
    f_1: "Contador de palavras",
    f_2: "Contador de caracteres com e sem espaços",
    f_3: "Contador de parágrafos e linhas",
    f_4: "Análise de texto em tempo real",
    plc: "Digite ou cole seu texto aqui para contar palavras e caracteres...",
    words: "Palavras",
    paragraphs: "Parágrafos",
    lines: "Linhas",
    chars: "Caracteres",
    all: "com espaços",
    converter: "Conversor de Texto",
    ascii: "Gerador de Letras ASCII",
    fancy: "Letras Diferentes",
    generator: "Gerador de Texto"
  }
}
</i18n>
