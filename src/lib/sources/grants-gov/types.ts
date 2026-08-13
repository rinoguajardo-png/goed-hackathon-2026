/**
 * Raw shapes returned by the Grants.gov Search2 API (api.grants.gov/v1/api).
 * These mirror the vendor's field names exactly and are NOT exported outside
 * lib/sources/grants-gov — normalize.ts is the only bridge to our internal
 * GovernmentOpportunity model.
 */

export interface GrantsGovSearchRequest {
  keyword?: string;
  rows?: number;
  startRecordNum?: number;
  oppStatuses?: string; // e.g. "forecasted|posted"
}

export interface GrantsGovOppHit {
  id: string;
  number: string;
  title: string;
  agencyCode: string;
  agency: string;
  openDate: string;
  closeDate: string;
  oppStatus: string;
  docType: string;
  cfdaList: string[];
}

export interface GrantsGovSearchResponse {
  errorcode: number;
  msg: string;
  data: {
    hitCount: number;
    startRecord: number;
    oppHits: GrantsGovOppHit[];
  };
}

export interface GrantsGovFundingInstrument {
  id: string;
  description?: string;
}

export interface GrantsGovSynopsis {
  synopsisDesc?: string;
  responseDate?: string;
  postingDate?: string;
  archiveDate?: string;
  awardCeiling?: string;
  awardFloor?: string;
  applicantEligibilityDesc?: string;
  fundingInstruments?: GrantsGovFundingInstrument[];
  fundingActivityCategories?: GrantsGovFundingInstrument[];
}

export interface GrantsGovForecast {
  forecastDesc?: string;
  estSynopsisPostingDate?: string;
  estApplicationResponseDate?: string;
  applicantEligibilityDesc?: string;
  awardCeiling?: string;
  awardFloor?: string;
  fundingActivityCategories?: GrantsGovFundingInstrument[];
}

export interface GrantsGovOpportunityDetail {
  id: number;
  opportunityNumber: string;
  opportunityTitle: string;
  docType: string;
  agencyDetails?: { agencyName?: string; agencyCode?: string };
  topAgencyDetails?: { agencyName?: string; agencyCode?: string };
  synopsis?: GrantsGovSynopsis | null;
  forecast?: GrantsGovForecast | null;
}

export interface GrantsGovFetchOpportunityResponse {
  errorcode: number;
  msg: string;
  data: GrantsGovOpportunityDetail;
}
