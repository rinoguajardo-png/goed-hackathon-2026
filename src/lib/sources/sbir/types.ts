/**
 * Raw shapes matching the public SBIR.gov API (api.www.sbir.gov/public/api/
 * solicitations and /awards). We hit "Forbidden" testing this API today
 * (likely IP/rate gated), so today's data comes from the fixtures in
 * ./fixtures/*.json, hand-shaped to match this same schema. Swapping in the
 * live API tomorrow means only changing index.ts's data source — normalize.ts
 * and everything downstream stays the same.
 */

export interface SbirSolicitationTopic {
  topic_number?: string;
  topic_title?: string;
  topic_description?: string;
}

export interface SbirSolicitation {
  solicitation_number: string;
  solicitation_title: string;
  program: "SBIR" | "STTR" | "SBIR/STTR";
  phase?: string;
  agency: string;
  branch?: string;
  solicitation_year?: number;
  open_date?: string;
  close_date?: string;
  application_due_date?: string;
  current_status?: string;
  solicitation_agency_url?: string;
  research_area_keywords?: string[];
  solicitation_topics?: SbirSolicitationTopic[];
}

export interface SbirAward {
  firm: string;
  award_title: string;
  agency: string;
  branch?: string;
  phase?: string;
  program?: "SBIR" | "STTR";
  agency_tracking_number?: string;
  contract?: string;
  proposal_award_date?: string;
  award_year?: number;
  award_amount?: string | number;
  state?: string;
  research_area_keywords?: string[];
  abstract?: string;
}
