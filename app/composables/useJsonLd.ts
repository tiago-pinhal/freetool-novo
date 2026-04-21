import { useHead, useI18n, useRequestURL } from '#imports'

// --- Types ---

interface WithContext {
  '@context': 'https://schema.org'
  '@type': string
}

export interface WebSiteSchema extends WithContext {
  '@type': 'WebSite'
  name: string
  url: string
  description?: string
  inLanguage?: string | string[]
}

export interface WebPageSchema extends WithContext {
  '@type': 'WebPage'
  name: string
  url: string
  description?: string
  inLanguage?: string
  isPartOf?: { '@id': string }
}

export interface BreadcrumbListSchema extends WithContext {
  '@type': 'BreadcrumbList'
  itemListElement: BreadcrumbItem[]
}

export interface BreadcrumbItem {
  '@type': 'ListItem'
  position: number
  name: string
  item?: string
}

export interface SoftwareApplicationSchema extends WithContext {
  '@type': 'SoftwareApplication'
  name: string
  url: string
  description?: string
  applicationCategory?: string
  operatingSystem?: string
  offers?: OfferSchema
  inLanguage?: string
  featureList?: string | string[]
}

export interface WebApplicationSchema extends Omit<SoftwareApplicationSchema, '@type'> {
  '@type': 'WebApplication'
}

export interface OfferSchema {
  '@type': 'Offer'
  price: string | number
  priceCurrency?: string
}

export interface FAQPageSchema extends WithContext {
  '@type': 'FAQPage'
  mainEntity: FAQItem[]
}

export interface FAQItem {
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}

export interface HowToSchema extends WithContext {
  '@type': 'HowTo'
  name: string
  step: HowToStep[]
}

export interface HowToStep {
  '@type': 'HowToStep'
  position: number
  name: string
  text: string
}

export interface OrganizationSchema extends WithContext {
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
  sameAs?: string[]
  description?: string
}

export type JsonLdInput =
  | WebSiteSchema
  | WebPageSchema
  | BreadcrumbListSchema
  | SoftwareApplicationSchema
  | WebApplicationSchema
  | FAQPageSchema
  | HowToSchema
  | OrganizationSchema

// --- Constants ---

export const FREE_OFFER: OfferSchema = {
  '@type': 'Offer',
  price: '0',
  priceCurrency: 'USD',
}

// --- Builders (pure functions) ---

export function buildWebSite(
  options: Omit<WebSiteSchema, '@context' | '@type'>
): WebSiteSchema {
  return { '@context': 'https://schema.org', '@type': 'WebSite', ...options }
}

export function buildWebPage(
  options: Omit<WebPageSchema, '@context' | '@type'>
): WebPageSchema {
  return { '@context': 'https://schema.org', '@type': 'WebPage', ...options }
}

export function buildSoftwareApp(
  options: Omit<SoftwareApplicationSchema, '@context' | '@type'>
): SoftwareApplicationSchema {
  return { '@context': 'https://schema.org', '@type': 'SoftwareApplication', ...options }
}

export function buildWebApp(
  options: Omit<WebApplicationSchema, '@context' | '@type'>
): WebApplicationSchema {
  return { '@context': 'https://schema.org', '@type': 'WebApplication', ...options }
}

export function buildBreadcrumbList(
  items: { name: string; url?: string }[]
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  }
}

export function buildFAQPage(
  questions: { question: string; answer: string }[]
): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }
}

export function buildHowTo(
  name: string,
  steps: { name: string; text: string }[]
): HowToSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    step: steps.map((s, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

export function buildOrganization(
  options: Omit<OrganizationSchema, '@context' | '@type'>
): OrganizationSchema {
  return { '@context': 'https://schema.org', '@type': 'Organization', ...options }
}

// --- Core composable ---

export function useJsonLd(schema: JsonLdInput | JsonLdInput[]) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  useHead({
    script: schemas.map((s) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(s),
    })),
  })
}

// --- Convenience composable for tool/category pages ---

interface PageJsonLdOptions {
  name: string
  description?: string
  /** Use 'tool' for individual tools, 'page' for category/static pages */
  type?: 'tool' | 'page'
  /** Category for SoftwareApplication (default: 'UtilitiesApplication') */
  applicationCategory?: string
  breadcrumb?: { name: string; url?: string }[]
  faq?: { question: string; answer: string }[]
  features?: string[]
  howToName?: string
  howToSteps?: { name: string; text: string }[]
}

export function usePageJsonLd(options: PageJsonLdOptions) {
  const { locale } = useI18n({ useScope: 'global' })
  const reqUrl = useRequestURL()
  const pageUrl = reqUrl.href

  const schemas: JsonLdInput[] = []

  if (options.type === 'tool') {
    schemas.push(
      buildWebApp({
        name: options.name,
        url: pageUrl,
        description: options.description,
        applicationCategory: options.applicationCategory ?? 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: FREE_OFFER,
        inLanguage: locale.value,
        featureList: options.features,
      })
    )
  } else {
    schemas.push(
      buildWebPage({
        name: options.name,
        url: pageUrl,
        description: options.description,
        inLanguage: locale.value,
      })
    )
  }

  if (options.breadcrumb?.length) {
    const origin = reqUrl.origin
    const resolvedBreadcrumb = options.breadcrumb.map((item) => ({
      ...item,
      url: item.url
        ? item.url.startsWith('http') ? item.url : `${origin}${item.url}`
        : undefined,
    }))
    schemas.push(buildBreadcrumbList(resolvedBreadcrumb))
  }

  if (options.faq?.length) {
    schemas.push(buildFAQPage(options.faq))
  }

  if (options.howToSteps?.length) {
    schemas.push(buildHowTo(options.howToName || options.name, options.howToSteps))
  }

  useJsonLd(schemas)
}
