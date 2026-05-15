export const useConsentState = () => {
  const analyticsConsent = useState<boolean>('consent:analytics', () => false)
  const adsConsent = useState<boolean>('consent:ads', () => false)
  return { analyticsConsent, adsConsent }
}
