/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PostCallReviewRecord } from '../types/postCallReview';

export const MOCK_POST_CALL_REVIEWS: PostCallReviewRecord[] = [
  {
    callId: 'CALL-20260831-09412',
    callDateTime: '2026-08-31 10:14:22 EDT',
    durationSeconds: 278, // 04:38
    audioRecordingUrl: 'rec_s3_vance_20260831_dual.wav',
    channel: 'INBOUND',
    collectorName: 'Sarah Jenkins',
    collectorId: 'OP-4821',
    debtorName: 'Marcus Vance',
    accountNumber: 'ACC-8921-9842',
    originalCreditor: 'First Horizon Auto Credit',
    totalBalance: 8420.50,
    principalBalance: 7170.50,
    accruedFees: 1250.00,
    daysPastDue: 114,

    // Interaction Summary
    summary:
      'Right-party contact confirmed with debtor Marcus Vance. Debtor explained non-payment was caused by a temporary 6-week medical leave and unpaid convalescence in July. Debtor stated he resumed full-time employment at Apex Logistics on Aug 24 and receives his first full bi-weekly direct deposit this Friday, Sept 5, 2026. Collector Sarah Jenkins addressed fee resistance by offering an authorized $750.00 late penalty waiver upon execution of a binding 3-part installment plan. Debtor agreed to an immediate first payment of $1,200.00 on Sept 5, followed by two equal payments of $850.00 on Sept 19 and Oct 3. Debtor authorized pre-authorized debit on card *4892. Full statutory Mini-Miranda and TCPA dual-channel recording disclosures were communicated and verified compliant.',

    milestones: [
      {
        time: '00:18',
        speaker: 'Collector Sarah Jenkins',
        title: 'Mini-Miranda Statutory Disclosure',
        description: 'Communicated 15 U.S.C. § 1692e(11) debt collection identity notice & two-party recording consent.',
      },
      {
        time: '00:44',
        speaker: 'Debtor Marcus Vance',
        title: 'Right-Party & Hardship Disclosure',
        description: 'Confirmed identity; disclosed unpaid medical leave during July 2026 as reason for delinquency.',
      },
      {
        time: '01:52',
        speaker: 'Debtor Marcus Vance',
        title: 'Solvency & Employment Verification',
        description: 'Stated resumption of full-time dispatch work at Apex Logistics with liquid direct deposit on Sept 5.',
      },
      {
        time: '02:35',
        speaker: 'Collector Sarah Jenkins',
        title: 'Authorized Concession Presentation',
        description: 'Offered $750 fee abatement conditional upon structured 3-part scheduled PTP plan.',
      },
      {
        time: '03:40',
        speaker: 'Debtor Marcus Vance',
        title: 'Binding PTP & Card Authorization',
        description: 'Accepted $1,200.00 initial payment on Sept 5, 2026 via debit card ending in 4892.',
      },
    ],

    disposition: {
      code: 'PTP_SCHEDULED',
      label: 'Promise to Pay Scheduled (Multi-Payment Plan)',
      description: 'Debtor committed to binding 3-installment repayment arrangement with first installment on next payday.',
    },

    sentiment: {
      initialState: 'Defensive & Anxious (68% Vocal Biomarker Stress)',
      finalState: 'Collaborative & Relieved (18% Vocal Biomarker Stress)',
      trend: 'positive_recovery',
      debtorCooperationScore: 88,
      agentEmpathyScore: 94,
      stressTrajectory: [
        { time: '00:00', agentStress: 14, debtorStress: 72 },
        { time: '01:00', agentStress: 12, debtorStress: 65 },
        { time: '02:00', agentStress: 15, debtorStress: 54 },
        { time: '03:00', agentStress: 11, debtorStress: 31 },
        { time: '04:30', agentStress: 10, debtorStress: 18 },
      ],
      acousticObservations: [
        'Acoustic pitch variability decreased by 42% following fee waiver announcement at 02:35.',
        'Zero interruptions or aggressive volume spikes detected across 04:38 interaction.',
        'Speech rate stabilized from 182 WPM (rushed/nervous) to 134 WPM (conversational).',
      ],
    },

    collectionOutcome: {
      outcomeType: 'PROMISE_TO_PAY',
      label: 'Promise to Pay Secured ($2,900 Total Cure Commitment)',
      amountRecoveredPromise: 2900.00,
      settlementPercentage: 40.4,
      feeConcessionGranted: 750.00,
      resolutionEfficiency: 'Optimal (AHT 04:38 vs 06:00 Target)',
    },

    nonPaymentReason: {
      primaryCategory: 'Temporary Medical Hardship / Reduced Income',
      rootCauseSummary:
        'Debtor experienced 6 weeks of unpaid medical leave following a surgical procedure in July 2026. Lost approximately $3,800 in household gross wages. Now returned to full duty.',
      supportingDebtorStatements: [
        '"I had unexpected surgery in early July and was out of work unpaid for almost six weeks."',
        '"Things backed up on me while I was on medical leave, but I went back to full-time last week."',
      ],
      mitigatingFactors: [
        'No prior default history on account across past 36 months.',
        'Verified return to full-time salaried employment at Apex Logistics.',
        'Demonstrated proactive willingness to settle upon receiving first paycheck.',
      ],
    },

    ptpInformation: {
      hasPtp: true,
      promisedAmount: 1200.00,
      firstPaymentDate: '2026-09-05',
      paymentRail: 'Pre-Authorized Debit Card (Visa *4892)',
      paymentSchedule: [
        {
          installmentNumber: 1,
          dueDate: '2026-09-05',
          amount: 1200.00,
          rail: 'Debit Card *4892',
          status: 'SCHEDULED_LOCKED',
        },
        {
          installmentNumber: 2,
          dueDate: '2026-09-19',
          amount: 850.00,
          rail: 'Debit Card *4892',
          status: 'PENDING_SCHEDULE',
        },
        {
          installmentNumber: 3,
          dueDate: '2026-10-03',
          amount: 850.00,
          rail: 'Debit Card *4892',
          status: 'PENDING_SCHEDULE',
        },
      ],
      preAuthorizedDebitToken: 'tok_live_dp_4892_sec881',
      feeWaiverApproved: true,
      feeWaiverAmount: 750.00,
    },

    recommendedFollowUp: {
      followUpDate: '2026-09-04',
      followUpTime: '09:00 AM EDT',
      channel: 'SMS_AND_EMAIL',
      channelLabel: 'Automated Reg-F Reminder (SMS + Email Portal)',
      actionTitle: 'T-24h Pre-Debit Notification',
      instructions:
        'Deliver statutory pre-authorized debit reminder notice with one-click payment portal confirmation link 24 hours prior to Friday execution.',
      complianceNotice: '12 CFR § 1006.6(d) Opt-In electronic communication notice logged.',
    },

    recommendedNextAction: {
      actionType: 'LOCK_DIALER_AND_QUEUE_PTP',
      actionTitle: 'Post PTP Mandate & Apply Temporary Dialer Suppression',
      description:
        'Submit the $1,200.00 PTP payment mandate into the core settlement gateway and suppress account ACC-8921-9842 from outbound autodialer queues pending Sept 5 debit execution.',
      targetSystem: 'Core Settlement Ledger & Genesis Campaign Gateway',
      priority: 'HIGH',
    },

    recommendedStage: {
      currentStageNumber: 3,
      currentStageName: 'Stage 3: Active Early Collections (60-119 DPD)',
      recommendedStageNumber: 4,
      recommendedStageName: 'Stage 4: PTP Fulfillment & Settlement Monitoring',
      transitionRationale:
        'Account satisfies deterministic criteria for Stage 4 transition: right-party contact established, binding repayment arrangement recorded, and initial payment date locked within 7 calendar days.',
      gateChecklist: [
        {
          check: 'Right-Party Identity Verification (SSN / DOB Match)',
          satisfied: true,
          evidenceRef: 'Audio timestamp 00:32 (SSN last 4 confirmed 8819)',
        },
        {
          check: 'Binding Payment Commitment within 14 Calendar Days',
          satisfied: true,
          evidenceRef: 'First installment $1,200 scheduled for Sept 5, 2026 (5 days)',
        },
        {
          check: 'Pre-Authorized Payment Rail Stored & Verified Tokenized',
          satisfied: true,
          evidenceRef: 'Token tok_live_dp_4892_sec881 created with CVV pass',
        },
        {
          check: 'Regulatory Mini-Miranda Disclosure Certified Communicated',
          satisfied: true,
          evidenceRef: 'Audio timestamp 00:18 (15 U.S.C. § 1692e(11))',
        },
      ],
    },

    aiConfidence: {
      overallConfidence: 94,
      confidenceTier: 'VERY_HIGH',
      modelEngine: 'StageFlow Copilot Acoustic-LLM v3.4 (Domain Calibrated)',
      subScores: [
        {
          dimension: 'Speech-to-Text Acoustic Accuracy',
          score: 98,
          status: 'HIGH',
          details: 'Dual-channel clean 16kHz audio with lossless signal-to-noise ratio.',
        },
        {
          dimension: 'Named Entity & Financial Extraction',
          score: 96,
          status: 'HIGH',
          details: 'Discovered employer ($1,200 wage cadence), dates, and payment tokens verified.',
        },
        {
          dimension: 'Statutory & Regulatory Audit Verification',
          score: 99,
          status: 'HIGH',
          details: 'Mini-Miranda disclosure and two-party consent fully matched canonical rules.',
        },
        {
          dimension: 'Intent & Commitment Intent Classification',
          score: 91,
          status: 'HIGH',
          details: 'Zero ambiguity in payment dates or card authorization statements.',
        },
      ],
      evidence: [
        {
          id: 'ev-1',
          category: 'STATUTORY_DISCLOSURE',
          timestamp: '00:18',
          quote: '"This is Sarah Jenkins with StageFlow Recovery Services on a recorded line on behalf of First Horizon Auto Credit. This is an attempt to collect a debt..."',
          speaker: 'Sarah Jenkins (Collector)',
          extractedFact: 'Mini-Miranda 15 U.S.C. § 1692e(11) delivered verbatim.',
          confidence: 99,
          verified: true,
        },
        {
          id: 'ev-2',
          category: 'TRANSCRIPT_CITATION',
          timestamp: '01:52',
          quote: '"I got back to work at Apex Logistics full-time on the 24th, and my first regular paycheck direct deposits this Friday the 5th."',
          speaker: 'Marcus Vance (Debtor)',
          extractedFact: 'Verified employment at Apex Logistics; liquid paycheck arrives Sept 5, 2026.',
          confidence: 97,
          verified: true,
        },
        {
          id: 'ev-3',
          category: 'FINANCIAL_COMMITMENT',
          timestamp: '03:40',
          quote: '"Yes, go ahead and schedule the $1,200 charge on my debit card ending in 4892 for Friday the 5th, and we can do the other two payments every two weeks after that."',
          speaker: 'Marcus Vance (Debtor)',
          extractedFact: 'Binding authorization for $1,200.00 on 2026-09-05 and recurring cadence.',
          confidence: 98,
          verified: true,
        },
        {
          id: 'ev-4',
          category: 'ENTITY_DISCOVERY',
          timestamp: '02:48',
          quote: '"If you can waive that $750 in penalty fees like you said, I can definitely make the twelve hundred work Friday."',
          speaker: 'Marcus Vance (Debtor)',
          extractedFact: 'Debtor explicitly conditioned commitment on $750 late fee concession.',
          confidence: 95,
          verified: true,
        },
      ],
      signals: [
        {
          id: 'sig-1',
          name: 'Vocal Biomarker Stress Relief',
          category: 'ACOUSTIC',
          level: 'POSITIVE',
          score: 86,
          description: 'Acoustic micro-tremors reduced significantly after fee concession presentation.',
          evidenceTime: '02:35 - 04:10',
        },
        {
          id: 'sig-2',
          name: 'Confirmed Payday Liquidity Alignment',
          category: 'SOLVENCY',
          level: 'POSITIVE',
          score: 95,
          description: 'Payment schedule aligns exactly with confirmed bi-weekly direct deposit cycle.',
          evidenceTime: '01:52',
        },
        {
          id: 'sig-3',
          name: 'Zero Litigation / Attorney Dispute Risk',
          category: 'RISK',
          level: 'POSITIVE',
          score: 99,
          description: 'No keywords relating to bankruptcy, legal representation, or cease-and-desist.',
          evidenceTime: 'Entire Call',
        },
        {
          id: 'sig-4',
          name: 'Regulatory Disclosure Compliance',
          category: 'COMPLIANCE',
          level: 'POSITIVE',
          score: 100,
          description: 'All mandatory disclosures made within the first 60 seconds of interaction.',
          evidenceTime: '00:18',
        },
      ],
    },

    // 3. Operational Recommendations with Lifecycle States
    recommendations: [
      {
        id: 'rec-ptp-schedule',
        title: 'Post Promise-to-Pay (PTP) Mandate of $1,200.00',
        category: 'PTP_POSTING',
        description: 'Schedule automated debit of $1,200.00 on 2026-09-05 against Visa *4892 and queue remaining installments.',
        impact: 'Secures $2,900.00 total recovery for First Horizon Auto Credit portfolio.',
        status: 'CONFIRMED',
        aiConfidence: 98,
        confirmedBy: 'Sarah Jenkins (OP-4821)',
        confirmedAt: '2026-08-31 10:19:04 EDT',
      },
      {
        id: 'rec-fee-waiver',
        title: 'Authorize $750.00 Late Penalty Fee Concession',
        category: 'DISPOSITION',
        description: 'Apply conditional $750.00 late fee abatement ledger credit upon clearance of first $1,200 installment.',
        impact: 'Abates delinquent charges within collector authorized delegation ceiling ($1,000 max).',
        status: 'PENDING',
        aiConfidence: 95,
      },
      {
        id: 'rec-stage-transition',
        title: 'Promote Account to Stage 4: PTP Settlement Monitoring',
        category: 'STAGE_TRANSITION',
        description: 'Transition account ACC-8921-9842 from Stage 3 to Stage 4 in the deterministic recovery pipeline.',
        impact: 'Updates recovery probability weight from 34% to 78% in financial forecast.',
        status: 'PENDING',
        aiConfidence: 94,
      },
      {
        id: 'rec-dialer-suppression',
        title: 'Enforce Outbound Dialer Suppression Rule',
        category: 'NEXT_ACTION',
        description: 'Block automated outbound predictive dialer campaigns for ACC-8921-9842 through Sept 07, 2026.',
        impact: 'Prevents harassment compliance violations while PTP is in active pending grace window.',
        status: 'EXECUTED_VERIFIED',
        aiConfidence: 99,
        confirmedBy: 'Sarah Jenkins (OP-4821)',
        confirmedAt: '2026-08-31 10:19:12 EDT',
        executedAt: '2026-08-31 10:19:15 EDT',
        executionReceiptHash: '0x8f19c4d2938b77a01e4599cb',
      },
      {
        id: 'rec-sms-followup',
        title: 'Queue Automated T-24h Pre-Debit SMS Notification',
        category: 'FOLLOW_UP_SCHEDULE',
        description: 'Schedule automated SMS confirmation reminder on 2026-09-04 at 09:00 AM EDT to debtor cell (555) 234-8910.',
        impact: 'Reduces NSF (Non-Sufficient Funds) debit failure probability by 41%.',
        status: 'PENDING',
        aiConfidence: 92,
      },
    ],
  },
  {
    callId: 'CALL-20260831-08129',
    callDateTime: '2026-08-31 09:02:15 EDT',
    durationSeconds: 312,
    audioRecordingUrl: 'rec_s3_rostova_20260831_dual.wav',
    channel: 'OUTBOUND',
    collectorName: 'David Chen',
    collectorId: 'OP-3310',
    debtorName: 'Elena Rostova',
    accountNumber: 'ACC-3419-7721',
    originalCreditor: 'Apex Commercial Capital',
    totalBalance: 14200.00,
    principalBalance: 12500.00,
    accruedFees: 1700.00,
    daysPastDue: 145,

    summary:
      'Contacted debtor Elena Rostova regarding outstanding commercial guarantee balance of $14,200.00. Debtor provided proof of business dissolution due to supply chain insolvency. Debtor offered a one-time lump-sum settlement of $8,500.00 (60% of principal balance) sourced from family borrowing, payable by Sept 15, 2026. Collector David Chen requested formal hardship documentation and bank statements to support manager approval for 40% balance write-down.',

    milestones: [
      {
        time: '00:20',
        speaker: 'Collector David Chen',
        title: 'Mini-Miranda & Disclosure',
        description: 'Outbound contact Mini-Miranda and recording consent verified.',
      },
      {
        time: '01:15',
        speaker: 'Debtor Elena Rostova',
        title: 'Business Involuntary Dissolution Statement',
        description: 'Disclosed closure of retail catering business and lack of corporate liquid assets.',
      },
      {
        time: '03:10',
        speaker: 'Debtor Elena Rostova',
        title: 'Lump-Sum Settlement Offer ($8,500)',
        description: 'Offered $8,500.00 single payment settlement in full satisfaction of debt.',
      },
    ],

    disposition: {
      code: 'SETTLEMENT_PROPOSAL_PENDING',
      label: 'Settlement Proposal Under Manager Review',
      description: 'Lump-sum settlement offer of $8,500 submitted; awaiting formal hardship documentation.',
    },

    sentiment: {
      initialState: 'Frustrated & Overwhelmed',
      finalState: 'Cooperative & Realistic',
      trend: 'de_escalated',
      debtorCooperationScore: 78,
      agentEmpathyScore: 91,
      stressTrajectory: [
        { time: '00:00', agentStress: 10, debtorStress: 80 },
        { time: '02:00', agentStress: 12, debtorStress: 60 },
        { time: '05:00', agentStress: 11, debtorStress: 42 },
      ],
      acousticObservations: [
        'Debtor voice quaver noted during discussion of commercial liquidation.',
        'Professional empathetic posture maintained by collector throughout.',
      ],
    },

    collectionOutcome: {
      outcomeType: 'PARTIAL_DOWNPAYMENT',
      label: 'Lump-Sum Settlement Intake ($8,500 on $14,200 Balance)',
      amountRecoveredPromise: 8500.00,
      settlementPercentage: 59.8,
      feeConcessionGranted: 1700.00,
      resolutionEfficiency: 'Pending Supervisor Sign-Off',
    },

    nonPaymentReason: {
      primaryCategory: 'Commercial Business Involuntary Closure',
      rootCauseSummary: 'Small business ceased operations following severe vendor contract cancellation in Q2 2026.',
      supportingDebtorStatements: ['"We had to surrender our commercial kitchen lease in May."'],
      mitigatingFactors: ['Personal guarantor willing to liquidate personal savings to avoid civil suit.'],
    },

    ptpInformation: {
      hasPtp: true,
      promisedAmount: 8500.00,
      firstPaymentDate: '2026-09-15',
      paymentRail: 'Wire Transfer / Certified Funds',
      paymentSchedule: [
        {
          installmentNumber: 1,
          dueDate: '2026-09-15',
          amount: 8500.00,
          rail: 'Fedwire / Certified Cashier Check',
          status: 'PENDING_SCHEDULE',
        },
      ],
      preAuthorizedDebitToken: 'N/A - Wire Settlement',
      feeWaiverApproved: false,
      feeWaiverAmount: 5700.00,
    },

    recommendedFollowUp: {
      followUpDate: '2026-09-08',
      followUpTime: '02:00 PM EDT',
      channel: 'PHONE_OUTBOUND',
      channelLabel: 'Supervisor Settlement Review Call',
      actionTitle: 'Hardship Documentation Verification',
      instructions: 'Review uploaded tax returns and formally issue written settlement agreement letter.',
      complianceNotice: 'Written settlement agreement required under FTC guidelines before executing funds.',
    },

    recommendedNextAction: {
      actionType: 'SUBMIT_FOR_MANAGER_APPROVAL',
      actionTitle: 'Escalate $5,700 Debt Forgiveness to Credit Committee',
      description: 'Submit formal settlement authorization packet with proof of insolvency to Ops Manager.',
      targetSystem: 'Governance & Exception Authorization Ledger',
      priority: 'HIGH',
    },

    recommendedStage: {
      currentStageNumber: 4,
      currentStageName: 'Stage 4: Pre-Legal Escalation (120-179 DPD)',
      recommendedStageNumber: 5,
      recommendedStageName: 'Stage 5: Settlement & Compromise Agreement',
      transitionRationale: 'Settlement offer exceeds 55% floor threshold and is pending documentary review.',
      gateChecklist: [
        { check: 'Proof of Business Insolvency Uploaded', satisfied: false, evidenceRef: 'Pending Debtor Email' },
        { check: 'Settlement Exceeds Statutory Floor', satisfied: true, evidenceRef: 'Offer $8,500 > Floor $7,800' },
        { check: 'Dual-Party Identity Certified', satisfied: true, evidenceRef: 'Audio timestamp 00:20' },
      ],
    },

    aiConfidence: {
      overallConfidence: 89,
      confidenceTier: 'HIGH',
      modelEngine: 'StageFlow Copilot Acoustic-LLM v3.4',
      subScores: [
        { dimension: 'Speech-to-Text Acoustic Accuracy', score: 96, status: 'HIGH', details: 'Clear audio.' },
        { dimension: 'Named Entity & Financial Extraction', score: 92, status: 'HIGH', details: 'Settlement terms captured.' },
        { dimension: 'Statutory & Regulatory Audit Verification', score: 98, status: 'HIGH', details: 'Passed.' },
        { dimension: 'Intent & Commitment Intent Classification', score: 82, status: 'MODERATE', details: 'Contingent on family loan.' },
      ],
      evidence: [
        {
          id: 'ev-10',
          category: 'FINANCIAL_COMMITMENT',
          timestamp: '03:10',
          quote: '"I can borrow $8,500 from my sister if your company will agree to close this account in full and not pursue a judgment."',
          speaker: 'Elena Rostova (Debtor)',
          extractedFact: 'Debtor offered $8,500 settlement contingent on full release of liability.',
          confidence: 94,
          verified: true,
        },
      ],
      signals: [
        {
          id: 'sig-10',
          name: 'High Settlement Motivation',
          category: 'INTENT',
          level: 'POSITIVE',
          score: 88,
          description: 'Strong desire to avoid civil court filing or public record judgment.',
          evidenceTime: '03:10',
        },
      ],
    },

    recommendations: [
      {
        id: 'rec-rostova-hardship',
        title: 'Dispatch Hardship Document Request Email Portal Link',
        category: 'FOLLOW_UP_SCHEDULE',
        description: 'Send secure portal link for debtor to upload 2025 business tax return and dissolution filing.',
        impact: 'Required documentation for compliance audit and debt forgiveness tax form 1099-C.',
        status: 'PENDING',
        aiConfidence: 94,
      },
      {
        id: 'rec-rostova-settle',
        title: 'Queue $8,500 Settlement Packet for Credit Committee',
        category: 'DISPOSITION',
        description: 'Pre-populate Credit Committee waiver docket with 59.8% recovery ratio.',
        impact: 'Secures $8,500 cash recovery on otherwise uncollectible defunct corporate entity.',
        status: 'PENDING',
        aiConfidence: 89,
      },
    ],
  },
  {
    callId: 'CALL-20260831-07741',
    callDateTime: '2026-08-31 08:35:10 EDT',
    durationSeconds: 194,
    audioRecordingUrl: 'rec_s3_hayes_20260831_dual.wav',
    channel: 'INBOUND',
    collectorName: 'Marcus Miller',
    collectorId: 'OP-1102',
    debtorName: 'Derrick Hayes',
    accountNumber: 'ACC-1194-6632',
    originalCreditor: 'Summit Auto Finance',
    totalBalance: 4650.00,
    principalBalance: 3200.00,
    accruedFees: 1450.00,
    daysPastDue: 88,

    summary:
      'Inbound dispute call from debtor Derrick Hayes regarding a $1,450.00 vehicle repossession and remarketing fee. Debtor claimed vehicle was voluntarily surrendered prior to the contractual notice date and provided a receipt signed by Summit Repo Agent on July 12. Debtor refused to pay the repossession fee, stating he is ready to pay the principal balance of $3,200.00 immediately if the repo fee is investigated and removed. Collector Marcus Miller initiated a formal dispute inquiry.',

    milestones: [
      {
        time: '00:15',
        speaker: 'Collector Marcus Miller',
        title: 'Mini-Miranda Notice',
        description: 'Statutory debt collector disclosure delivered.',
      },
      {
        time: '00:45',
        speaker: 'Debtor Derrick Hayes',
        title: 'Formal Fee Dispute Lodged',
        description: 'Contested $1,450 repossession assessment; claimed voluntary surrender agreement.',
      },
    ],

    disposition: {
      code: 'DISPUTE_INVESTIGATION_FEE',
      label: 'Dispute Investigation — Penalty / Repossession Fee',
      description: 'Account placed on 30-day statutory dispute hold under FDCPA 15 U.S.C. § 1692g.',
    },

    sentiment: {
      initialState: 'Agitated & Confrontational',
      finalState: 'Assertive but Firm',
      trend: 'persistent_friction',
      debtorCooperationScore: 45,
      agentEmpathyScore: 88,
      stressTrajectory: [
        { time: '00:00', agentStress: 15, debtorStress: 88 },
        { time: '01:30', agentStress: 14, debtorStress: 78 },
        { time: '03:14', agentStress: 12, debtorStress: 64 },
      ],
      acousticObservations: ['Elevated decibel levels during first 60 seconds; de-escalated after formal dispute docket logged.'],
    },

    collectionOutcome: {
      outcomeType: 'DISPUTE_INVESTIGATION',
      label: 'Formal Dispute Registered ($1,450 Fee Contested)',
      amountRecoveredPromise: 0.00,
      settlementPercentage: 0.0,
      feeConcessionGranted: 0.00,
      resolutionEfficiency: 'Dispute SLA Active (30-Day Resolution Window)',
    },

    nonPaymentReason: {
      primaryCategory: 'Disputed Repossession / Third-Party Towing Assessment',
      rootCauseSummary: 'Debtor asserts vehicle was voluntarily surrendered prior to involuntary tow dispatch.',
      supportingDebtorStatements: ['"I handed the keys over voluntarily at the branch on July 12th. I have the signed paper."'],
      mitigatingFactors: ['Debtor stated willingness to pay entire $3,200 principal immediately once fee is cleared.'],
    },

    ptpInformation: {
      hasPtp: false,
      promisedAmount: 0,
      firstPaymentDate: 'N/A - Dispute Pending',
      paymentRail: 'N/A',
      paymentSchedule: [],
      preAuthorizedDebitToken: 'N/A',
      feeWaiverApproved: false,
      feeWaiverAmount: 0,
    },

    recommendedFollowUp: {
      followUpDate: '2026-09-12',
      followUpTime: '10:00 AM EDT',
      channel: 'SECURE_PORTAL',
      channelLabel: 'Dispute Resolution Written Response',
      actionTitle: '30-Day Validation of Debt Dispatch',
      instructions: 'Request repo lot billing logs from Summit Auto Finance and issue formal 1692g validation packet.',
      complianceNotice: 'All collection activity must remain ceased until written validation is mailed.',
    },

    recommendedNextAction: {
      actionType: 'APPLY_DISPUTE_LOCK',
      actionTitle: 'Apply Immediate FDCPA 1692g Collection Freeze',
      description: 'Flag account ACC-1194-6632 as DISPUTED in credit reporting feed and halt all outbound contacts.',
      targetSystem: 'Credit Bureau Reporting Rail & Dial System',
      priority: 'CRITICAL',
    },

    recommendedStage: {
      currentStageNumber: 3,
      currentStageName: 'Stage 3: Active Collections',
      recommendedStageNumber: 9,
      recommendedStageName: 'Stage 9: Dispute & Regulatory Compliance Review',
      transitionRationale: 'Mandatory statutory transition under FDCPA § 1692g upon verbal fee dispute.',
      gateChecklist: [
        { check: 'Dispute Reason Categorized & Logged', satisfied: true, evidenceRef: 'Audio timestamp 00:45' },
        { check: 'Outbound Dial Freeze Activated', satisfied: true, evidenceRef: 'Suppression Rule 1692g-1' },
      ],
    },

    aiConfidence: {
      overallConfidence: 96,
      confidenceTier: 'VERY_HIGH',
      modelEngine: 'StageFlow Copilot Acoustic-LLM v3.4',
      subScores: [
        { dimension: 'Speech-to-Text Acoustic Accuracy', score: 98, status: 'HIGH', details: 'Clear.' },
        { dimension: 'Statutory & Regulatory Audit Verification', score: 99, status: 'HIGH', details: 'Dispute detected.' },
        { dimension: 'Named Entity Extraction', score: 94, status: 'HIGH', details: 'Repo receipt referenced.' },
        { dimension: 'Risk & Litigation Classification', score: 95, status: 'HIGH', details: 'High compliance sensitivity.' },
      ],
      evidence: [
        {
          id: 'ev-20',
          category: 'TRANSCRIPT_CITATION',
          timestamp: '00:45',
          quote: '"I am formally disputing this fourteen hundred dollar tow charge. I have the signed voluntary surrender receipt right here in my hand."',
          speaker: 'Derrick Hayes (Debtor)',
          extractedFact: 'Dispute lodged under 15 U.S.C. § 1692g for $1,450.00 fee.',
          confidence: 99,
          verified: true,
        },
      ],
      signals: [
        {
          id: 'sig-20',
          name: 'Statutory Dispute Trigger',
          category: 'COMPLIANCE',
          level: 'CRITICAL',
          score: 100,
          description: 'Mandatory 30-day validation hold required under federal law.',
          evidenceTime: '00:45',
        },
      ],
    },

    recommendations: [
      {
        id: 'rec-dispute-lock',
        title: 'Impose FDCPA § 1692g Statutory Collection Freeze',
        category: 'NEXT_ACTION',
        description: 'Freeze all collection attempts and update Metro 2 credit reporting status to XB (Account Disputed).',
        impact: 'Guarantees 100% regulatory compliance against CFPB unvalidated collection penalties.',
        status: 'EXECUTED_VERIFIED',
        aiConfidence: 99,
        confirmedBy: 'Marcus Miller (OP-1102)',
        confirmedAt: '2026-08-31 08:39:02 EDT',
        executedAt: '2026-08-31 08:39:03 EDT',
        executionReceiptHash: '0x3c8911f92a10b8e722cd',
      },
      {
        id: 'rec-repo-audit',
        title: 'Dispatch Repo Fee Audit Request to Summit Auto Finance',
        category: 'DISPOSITION',
        description: 'Request bill of lading and voluntary drop-off receipt from original creditor repo department.',
        impact: 'Facilitates removal of erroneous $1,450 fee and fast-tracks $3,200 principal recovery.',
        status: 'PENDING',
        aiConfidence: 96,
      },
    ],
  },
];
