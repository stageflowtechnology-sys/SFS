/**
 * StageFlow AI — Philippine Collections Localization Layer
 * Purpose-built for Philippine Banking, Fintech, Lending, and Third-Party Collection Agencies (ECA/ACA).
 */

export type CommunicationLanguage = 'ENGLISH' | 'TAGLISH' | 'FILIPINO';

export type PhilippineEntitySector = 
  | 'UNIVERSAL_BANK' 
  | 'DIGITAL_BANK' 
  | 'FINTECH_LENDING' 
  | 'MICROFINANCE' 
  | 'ECA_AGENCY';

export type ContactRelationship = 
  | 'BORROWER' 
  | 'AUTHORIZED_REPRESENTATIVE' 
  | 'THIRD_PARTY_FAMILY' 
  | 'THIRD_PARTY_EMPLOYER' 
  | 'WRONG_PARTY' 
  | 'UNKNOWN_PARTY';

export type DebtorWillingnessState = 
  | 'WILLING_BUT_UNABLE' 
  | 'ABLE_BUT_UNWILLING' 
  | 'DISPUTED_ACCOUNT' 
  | 'UNABLE_TO_CONTACT' 
  | 'WRONG_PARTY' 
  | 'PAYMENT_ALREADY_MADE' 
  | 'INFORMATION_INSUFFICIENT';

export type PhilippineCollectionStage =
  | 'ACCOUNT_ENDORSEMENT'
  | 'ACCOUNT_VALIDATION'
  | 'ALLOCATION'
  | 'COLLECTOR_ASSIGNMENT'
  | 'COLLECTION_ATTEMPTS'
  | 'CONTACTABILITY_ASSESSMENT'
  | 'RIGHT_PARTY_CONTACT'
  | 'NEGOTIATION'
  | 'PAYMENT_ARRANGEMENT_PTP'
  | 'FOLLOW_UP'
  | 'PAYMENT_MONITORING'
  | 'BROKEN_PTP_MANAGEMENT'
  | 'RE_COLLECTION'
  | 'ESCALATION'
  | 'PRE_LEGAL'
  | 'LEGAL_COLLECTION'
  | 'RESOLUTION_CLOSURE';

export interface PhilippineAddress {
  unitOrHouseNumber?: string;
  street: string;
  subdivisionOrVillage?: string;
  barangay: string;
  municipalityOrCity: string;
  province: string;
  region: string;
  postalCode: string;
  landmarkNote?: string;
  verifiedStatus?: 'VERIFIED' | 'PROBABLE' | 'POSSIBLE' | 'INSUFFICIENT' | 'CONTRADICTED';
}

export interface PhilippineCustomerName {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: 'Jr.' | 'Sr.' | 'II' | 'III' | 'IV' | string;
  preferredName?: string;
}

export interface PhilippineClientConfig {
  clientId: string;
  clientName: string;
  sector: PhilippineEntitySector;
  shortCode: string;
  preferredLanguage: CommunicationLanguage;
  agencyLabel: 'ECA' | 'ACA' | 'Agency' | 'Vendor' | 'Partner';
  regulatoryRail: string;
  fieldVisitPermitted: boolean;
  legalEscalationThresholdDays: number;
}

export interface PhilippineScriptTemplate {
  key: string;
  title: string;
  scenario: string;
  english: string;
  taglish: string;
  filipino: string;
  complianceTag: string;
  safeForThirdParty: boolean;
}

export const PHILIPPINE_REGULATORY_DISCLAIMER = 
  'Verify against applicable client policy and current Philippine regulatory requirements (e.g., BSP Circular 454, SEC MC-18 Series of 2019, and NPC Data Privacy Act of 2012).';

/**
 * Currency Formatter for Philippine Peso (₱)
 */
export function formatPHP(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₱0.00';
  }
  const numeric = Number(amount);
  return '₱' + numeric.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format Full Philippine Customer Name with optional Suffix and Middle Name
 */
export function formatPhilippineName(nameObj: PhilippineCustomerName): string {
  const parts: string[] = [nameObj.firstName];
  if (nameObj.middleName && nameObj.middleName.trim()) {
    parts.push(nameObj.middleName.trim().length === 1 ? `${nameObj.middleName.toUpperCase()}.` : nameObj.middleName);
  }
  parts.push(nameObj.lastName);
  if (nameObj.suffix && nameObj.suffix.trim()) {
    parts.push(nameObj.suffix.trim());
  }
  return parts.join(' ');
}

/**
 * Format Philippine Address into a standard postal/field visit string
 */
export function formatPhilippineAddress(addr: PhilippineAddress): string {
  const segments: string[] = [];
  if (addr.unitOrHouseNumber) segments.push(addr.unitOrHouseNumber);
  if (addr.street) segments.push(addr.street);
  if (addr.subdivisionOrVillage) segments.push(addr.subdivisionOrVillage);
  if (addr.barangay) segments.push(`Brgy. ${addr.barangay.replace(/^Brgy\.?\s*/i, '')}`);
  if (addr.municipalityOrCity) segments.push(addr.municipalityOrCity);
  if (addr.province && addr.province !== addr.municipalityOrCity) segments.push(addr.province);
  if (addr.region) segments.push(addr.region);
  if (addr.postalCode) segments.push(addr.postalCode);
  return segments.join(', ');
}

/**
 * Philippine Collections Terminology Mapping
 */
export const PHILIPPINE_COLLECTIONS_GLOSSARY: { term: string; category: string; description: string; replacementOf: string }[] = [
  {
    term: 'Account Endorsement',
    category: 'Intake & Allocation',
    description: 'Formal transmission of a delinquent loan portfolio from the originating bank/fintech to an accredited collection agency.',
    replacementOf: 'Transfer Debt Cases / Case Handoff',
  },
  {
    term: 'Endorsement List / Batch',
    category: 'Intake & Allocation',
    description: 'Structured spreadsheet (Excel/CSV) exchange containing debtor master records, DPD, principal balance, and past due interest.',
    replacementOf: 'Intake File / Ingestion Sheet',
  },
  {
    term: 'Account Allocation',
    category: 'Operations',
    description: 'Assignment of endorsed debtor accounts to specific collection teams, tele-collectors, or field agents.',
    replacementOf: 'Distribute Debt Cases / Work Distribution',
  },
  {
    term: 'Tele-Collector',
    category: 'Personnel',
    description: 'Frontline recovery officer conducting phone, SMS, and digital outreach to negotiate payment arrangements.',
    replacementOf: 'Debt Collector Agent / Call Center Rep',
  },
  {
    term: 'Field Collector',
    category: 'Personnel',
    description: 'Field operations officer dispatched for physical residence or business address visits and ocular verification.',
    replacementOf: 'Physical Rep / Onsite Agent',
  },
  {
    term: 'External Collection Agency (ECA)',
    category: 'Agency Governance',
    description: 'Third-party recovery agency accredited by financial institutions under BSP and SEC guidelines to recover delinquent portfolios.',
    replacementOf: 'Debt Recovery Vendor / 3rd Party Servicer',
  },
  {
    term: 'Promise to Pay (PTP)',
    category: 'Negotiation',
    description: 'Debtor formal commitment with specific payment date, amount, and payment channel (e.g. Over-the-counter, GCash, Maya, Bank Transfer).',
    replacementOf: 'Payment Commitment / Scheduled Promise',
  },
  {
    term: 'Broken PTP',
    category: 'Negotiation',
    description: 'A payment promise that matured without reconciled bank or digital rail receipt, triggering immediate follow-up escalation.',
    replacementOf: 'Defaulted Promise / Failed Payment',
  },
  {
    term: 'PTP Kept / Conversion',
    category: 'KPIs & Yield',
    description: 'Percentage of promises successfully honored and verified against client bank clearing ledger.',
    replacementOf: 'Settlement Adherence / Promise Yield',
  },
  {
    term: 'Right Party Contact (RPC)',
    category: 'Contactability',
    description: 'Confirmed communication directly with the borrower or verified authorized legal representative.',
    replacementOf: 'Direct Debtor Touch / Verified Target',
  },
  {
    term: 'Payment Arrangement / Restructuring',
    category: 'Settlement',
    description: 'Agreed installment plan or restructured amortization schedule providing relief while ensuring recovery.',
    replacementOf: 'Repayment Contract / Payment Plan',
  },
  {
    term: 'Field Visit (Barangay Ocular)',
    category: 'Field Operations',
    description: 'In-person address verification and delivery of formal demand/contact notices respecting local barangay protocols.',
    replacementOf: 'Physical Contact Attempt / Home Visit',
  },
  {
    term: 'Pre-Legal & Small Claims',
    category: 'Legal Escalation',
    description: 'Final formal demand notice prior to formal referral to external counsel or filing with the Metropolitan/Municipal Trial Court.',
    replacementOf: 'Litigation Hold / Attorney Referral',
  },
  {
    term: 'Waiver / Reversal / Adjustment',
    category: 'Balance Cleanup',
    description: 'Approved reduction or concession of accrued penalty fees and late interest to secure lump-sum principal settlement.',
    replacementOf: 'Discount Authorization / Write-down',
  },
];

/**
 * Standard Curated Multi-Lingual Philippine Collection Script Matrix
 */
export const PHILIPPINE_COMMUNICATION_TEMPLATES: PhilippineScriptTemplate[] = [
  {
    key: 'GREETING_RPC_VERIFICATION',
    title: 'Greeting & Right Party Contact (RPC) Verification',
    scenario: 'Opening outbound touch to verify borrower identity without disclosing debt details to third parties.',
    english: 'Good day. May I speak with Ma\'am/Sir [Customer Name]? This is [Collector Name] calling from [Agency/Bank Name] regarding an urgent matter with your account.',
    taglish: 'Magandang araw po. Pwede po bang makausap si Ma\'am/Sir [Customer Name]? Ako po si [Collector Name] mula sa [Agency/Bank Name], tumatawag po regarding sa urgent update sa inyong account.',
    filipino: 'Magandang araw po. Maaari ko po bang makausap si [Customer Name]? Ako po si [Collector Name] mula sa [Agency/Bank Name], tumatawag po ukol sa isang mahalagang update sa inyong account.',
    complianceTag: 'NPC Data Privacy & RPC Confirmation',
    safeForThirdParty: false,
  },
  {
    key: 'THIRD_PARTY_NON_DISCLOSURE',
    title: 'Third-Party Contact (Strict Non-Disclosure)',
    scenario: 'When a family member, co-worker, or alternate contact answers. No debt amount or delinquency is disclosed.',
    english: 'Good day. I am trying to reach Ma\'am/Sir [Customer Name] regarding an important personal administrative update. Could you please ask them to call me back at [Phone Number] or let me know when they might be available?',
    taglish: 'Magandang araw po. Hinahanap ko po sana si Ma\'am/Sir [Customer Name] para sa isang important personal administrative update. Pwede po bang paki-abiso na tumawag po sa akin sa [Phone Number], o kailan po kaya siya available?',
    filipino: 'Magandang araw po. Nais ko po sanang maabot si [Customer Name] ukol sa isang mahalagang personal na update. Maaari po ba ninyong maipahatid na mag-iwan ng tawag sa [Phone Number]?',
    complianceTag: 'SEC MC-18 & NPC Strict 3rd-Party Guardrail',
    safeForThirdParty: true,
  },
  {
    key: 'DEMAND_AND_BALANCE_EXPLANATION',
    title: 'Balance Presentation & Overdue Status',
    scenario: 'Clearly stating the outstanding balance and days past due in a respectful, professional manner.',
    english: 'Ma\'am/Sir, our records show that your account with [Bank/Fintech] has an outstanding balance of ₱[Amount], which is now [DPD] days past due. We are reaching out to help you settle this and prevent further penalty charges or escalation.',
    taglish: 'Ma\'am/Sir, ayon po sa record ng [Bank/Fintech], mayroon po kayong outstanding balance na ₱[Amount], na [DPD] days past due na po. Tumatawag po kami para tulungan kayo na mai-settle ito upang hindi na po madagdagan ng interest at penalties.',
    filipino: 'Ayon po sa aming talaan sa [Bank/Fintech], mayroon po kayong natitirang balanse na ₱[Amount] na [DPD] araw nang lampas sa takdang petsa. Nais po namin kayong tulungan upang maiwasan ang karagdagang multa at pagkaantala.',
    complianceTag: 'BSP Circular 454 Truthful Balance Presentation',
    safeForThirdParty: false,
  },
  {
    key: 'WILLING_BUT_UNABLE_ARRANGEMENT',
    title: 'Financial Hardship & Payment Arrangement / Restructuring',
    scenario: 'When borrower expresses genuine financial difficulty, offering affordable installment terms.',
    english: 'We understand your current situation, Ma\'am/Sir. To help you manage this, we can offer a structured payment arrangement where you pay an initial installment of ₱[Amount] by [Date], and spread the remaining balance over [Months] months.',
    taglish: 'Naiintindihan po namin ang inyong sitwasyon, Ma\'am/Sir. Para po makatulong sa inyo, pwede po tayong gumawa ng payment arrangement na may initial payment na ₱[Amount] ngayong [Date], at ang balance ay hulugan natin ng [Months] months.',
    filipino: 'Nauunawaan po namin ang inyong kasalukuyang kalagayan. Upang kayo ay matulungan, maaari po tayong magkasundo sa isang payment arrangement kung saan magbabayad muna ng ₱[Amount] sa [Date], at ang nalalabi ay hahatiin sa [Months] buwan.',
    complianceTag: 'Solution-Oriented Empathetic Settlement',
    safeForThirdParty: false,
  },
  {
    key: 'PROMISE_TO_PAY_CONFIRMATION',
    title: 'Promise to Pay (PTP) Commitment & Receipt Channel',
    scenario: 'Locking down the agreed payment date, amount, and payment channel with confirmation instructions.',
    english: 'Thank you for your commitment, Ma\'am/Sir. We have documented your Promise to Pay of ₱[Amount] on or before [Date]. You may settle this via [Payment Channel, e.g. GCash, Maya, 7-Eleven, or BDO/BPI Over-the-Counter]. Please send the transaction receipt to [Email/SMS Viber] so we can tag your account immediately.',
    taglish: 'Maraming salamat po sa inyong commitment, Ma\'am/Sir. Na-record na po namin ang inyong Promise to Pay na ₱[Amount] sa o bago ang [Date]. Pwede po kayong magbayad via [GCash / Maya / Bank Transfer / Bayad Center]. Paki-send po agad ang screenshot o copy ng receipt sa amin para ma-update ang inyong account.',
    filipino: 'Maraming salamat po. Aming naitala ang inyong pangakong pagbabayad na nagkakahalagang ₱[Amount] sa o bago sumapit ang [Date]. Maaari po kayong magbayad sa pamamagitan ng [GCash / Maya / Bangko]. Paki-padala po ang kopya ng resibo para sa agarang pag-post sa inyong account.',
    complianceTag: 'PTP Formalization & Clearing Rail Verification',
    safeForThirdParty: false,
  },
  {
    key: 'BROKEN_PTP_FOLLOWUP',
    title: 'Broken PTP Re-engagement',
    scenario: 'Follow-up when an agreed payment date passed without proof of settlement.',
    english: 'Good day Ma\'am/Sir. We noticed that your scheduled payment of ₱[Amount] for [Date] has not yet reflected in our clearing records. Is there any difficulty you encountered with the payment channel, or can you send over the transaction reference number?',
    taglish: 'Magandang araw po Ma\'am/Sir. Napansin po namin na hindi pa po nag-reflect sa system ang inyong scheduled payment na ₱[Amount] noong [Date]. May naging problema po ba sa payment channel, o may reference number po ba kayong hawak para ma-verify namin?',
    filipino: 'Magandang araw po. Nais po naming i-verify ang inyong takdang bayad na ₱[Amount] noong [Date] na hindi pa po pumapasok sa aming talaan. May naging aberya po ba, o maaari po bang maibahagi ang reference number ng inyong transaksyon?',
    complianceTag: 'Courteous Broken PTP Verification',
    safeForThirdParty: false,
  },
  {
    key: 'PRE_LEGAL_ESCALATION_NOTICE',
    title: 'Pre-Legal Escalation & Final Opportunity Notice',
    scenario: 'Professional pre-legal advisory explaining formal escalation if no arrangement is made.',
    english: 'Ma\'am/Sir, this is a formal pre-legal reminder regarding your endorsed account with [Creditor]. If we are unable to establish an amicable payment arrangement by [Date], your account will be recommended for formal legal review and endorsed to external counsel.',
    taglish: 'Ma\'am/Sir, ito po ay formal pre-legal reminder para sa inyong endorsed account sa [Creditor]. Kung hindi po tayo makakapag-settle ng amicable payment arrangement bago ang [Date], mapipilitan po kaming i-endorse ang account para sa formal legal review at Small Claims filing.',
    filipino: 'Ito po ay isang pormal na paunawa bago ang legal na aksyon ukol sa inyong account sa [Creditor]. Kung hindi po tayo magkakasundo sa isang maayos na payment arrangement bago sumapit ang [Date], ang inyong account ay irerekomenda para sa legal review.',
    complianceTag: 'Lawful Pre-Legal Notice (No False Threats)',
    safeForThirdParty: false,
  },
  {
    key: 'FIELD_VISIT_BARANGAY_ADVISORY',
    title: 'Field Visit & Barangay Address Verification Advisory',
    scenario: 'When tele-collections are unreachable, dispatching an accredited field collector for an ocular visit.',
    english: 'Notice of Scheduled Field Visit: An authorized field representative from [Agency Name] has been assigned to conduct an ocular address verification at [Barangay, City] regarding your account with [Creditor]. Please contact us at [Phone] to coordinate.',
    taglish: 'Advisory sa Field Visit: Mayroon po kaming authorized field collector mula sa [Agency Name] na na-assign para sa ocular address verification sa inyong area sa [Barangay, City] para sa inyong account sa [Creditor]. Paki-tawagan po kami sa [Phone] para maiwasan ang abala.',
    filipino: 'Paunawa ukol sa Field Visit: Isang awtorisadong kinatawan mula sa [Agency Name] ang naatasan para sa ocular visit sa inyong tirahan sa [Barangay, City]. Mangyaring tumawag po sa [Phone] para sa inyong koordinasyon.',
    complianceTag: 'Barangay Protocol & Field Ops Notice',
    safeForThirdParty: false,
  },
];

/**
 * Helper to retrieve localized script by key and target language
 */
export function getLocalizedScript(
  key: string,
  lang: CommunicationLanguage,
  params?: Record<string, string | number>
): string {
  const template = PHILIPPINE_COMMUNICATION_TEMPLATES.find((t) => t.key === key);
  if (!template) return '';

  let raw = template.english;
  if (lang === 'TAGLISH') raw = template.taglish;
  if (lang === 'FILIPINO') raw = template.filipino;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      raw = raw.replace(new RegExp(`\\[${k}\\]`, 'g'), String(v));
    });
  }

  return raw;
}
