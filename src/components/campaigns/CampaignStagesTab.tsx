import React from 'react';
import { CampaignItem } from '../../types/campaign';
import { CampaignStageBuilder } from './CampaignStageBuilder';

interface CampaignStagesTabProps {
  campaign: CampaignItem;
  onUpdateCampaign?: (updated: CampaignItem) => void;
  showToast?: (msg: string) => void;
}

export const CampaignStagesTab: React.FC<CampaignStagesTabProps> = ({
  campaign,
  onUpdateCampaign,
  showToast,
}) => {
  return (
    <CampaignStageBuilder
      campaign={campaign}
      onUpdateCampaign={onUpdateCampaign}
      showToast={showToast}
    />
  );
};

