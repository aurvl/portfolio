export type ImageDimensions = {
  width: number
  height: number
}

const IMAGE_DIMENSIONS: Record<string, ImageDimensions> = {
  'assets/blog/images/blog1.jpg': { width: 6048, height: 3402 },
  'assets/blog/images/blog2.jpg': { width: 2048, height: 1152 },
  'assets/blog/images/blog3.jpg': { width: 4000, height: 2250 },
  'assets/blog/images/blog4.jpg': { width: 4032, height: 2268 },
  'assets/blog/images/blog5.jpg': { width: 8448, height: 4752 },
  'assets/blog/images/blog6.jpg': { width: 3000, height: 1688 },
  'assets/blog/images/blog7.jpg': { width: 4582, height: 2577 },
  'assets/blog/images/defaultblogpostcover.png': { width: 1024, height: 559 },
  'assets/blog/images/ia-pas-a-pas/bp1-backward.png': { width: 541, height: 410 },
  'assets/blog/images/ia-pas-a-pas/bp1-neuron.png': { width: 241, height: 161 },
  'assets/blog/images/ia-pas-a-pas/bp1-relu.png': { width: 679, height: 448 },
  'assets/blog/images/ia-pas-a-pas/bp2-artificial_neuron.png': { width: 320, height: 210 },
  'assets/blog/images/ia-pas-a-pas/bp2-convex_loss_function.png': { width: 841, height: 547 },
  'assets/blog/images/ia-pas-a-pas/bp2-sigmoid.png': { width: 691, height: 393 },
  'assets/blog/images/ia-pas-a-pas/bp2-train_process-en.png': { width: 8105, height: 1123 },
  'assets/blog/images/ia-pas-a-pas/bp2-train_process-fr.png': { width: 8191, height: 1101 },
  'assets/blog/images/ia-pas-a-pas/bp3-mlp-decision-boundary.png': { width: 689, height: 701 },
  'assets/blog/images/ia-pas-a-pas/bp3-mlp.png': { width: 540, height: 291 },
  'assets/blog/images/ia-pas-a-pas/bp3-single-neuron-decision-boundary.png': { width: 612, height: 470 },
  'assets/images/about-image.png': { width: 1009, height: 985 },
  'assets/images/hero-image.png': { width: 447, height: 447 },
  'assets/images/certifications/anthropic.png': { width: 600, height: 600 },
  'assets/images/certifications/ct1.png': { width: 261, height: 260 },
  'assets/images/certifications/ct2.png': { width: 833, height: 833 },
  'assets/images/certifications/datacampinc_logo.jpg': { width: 100, height: 100 },
  'assets/images/companies/csm-logo.png': { width: 195, height: 195 },
  'assets/images/companies/eco.jpg': { width: 357, height: 357 },
  'assets/images/companies/fsn.jpg': { width: 1600, height: 1600 },
  'assets/images/logos/logo1.png': { width: 695, height: 159 },
  'assets/images/logos/logo1li.png': { width: 695, height: 159 },
  'assets/images/logos/logo2.png': { width: 767, height: 159 },
  'assets/images/logos/logo2li.png': { width: 759, height: 159 },
  'assets/images/logos/logo3.png': { width: 703, height: 217 },
  'assets/images/logos/logo3li.png': { width: 703, height: 217 },
  'assets/images/logos/logo4.png': { width: 841, height: 237 },
  'assets/images/logos/logo4li.png': { width: 841, height: 237 },
  'assets/images/tools/pbi.png': { width: 192, height: 256 },
  'assets/images/tools/tabl.png': { width: 48, height: 48 },
  'assets/projects/images/ab-testing-new-model-cover.png': { width: 1025, height: 562 },
  'assets/projects/images/allocine-tv-series-scraping-cover.jpg': { width: 1200, height: 799 },
  'assets/projects/images/banking-fraud-data-collection-cover.png': { width: 974, height: 650 },
  'assets/projects/images/bayesian-linear-regression-econometrics-cover.jpg': { width: 4857, height: 3469 },
  'assets/projects/images/belgian-trade-time-series-cover.jpg': { width: 1920, height: 1080 },
  'assets/projects/images/comments-analysis-text-classification-cover.jpg': { width: 5925, height: 3950 },
  'assets/projects/images/defaultprojectcover.png': { width: 2816, height: 1536 },
  'assets/projects/images/environmental-attention-index-pta-cover.jpg': { width: 5760, height: 3840 },
  'assets/projects/images/excel-data-analyst-project-cover.jpg': { width: 3999, height: 2666 },
  'assets/projects/images/factorial-analysis-mixed-data-cover.jpg': { width: 1024, height: 576 },
  'assets/projects/images/fear-greed-index-estimator-cover.png': { width: 2816, height: 1536 },
  'assets/projects/images/gpt-from-scratch-cover.jpg': { width: 2160, height: 3840 },
  'assets/projects/images/house-price-prediction-cover.jpg': { width: 5168, height: 3448 },
  'assets/projects/images/insurance-claim-fraud-counterfactual-simulator-cover.jpg': { width: 1800, height: 1200 },
  'assets/projects/images/msci-world-cw8-price-prediction-cover.jpg': { width: 1560, height: 880 },
  'assets/projects/images/nyc-smart-restaurants-migration-cover.jpg': { width: 540, height: 360 },
  'assets/projects/images/phillips-curve-europe-policy-cover.jpg': { width: 720, height: 360 },
  'assets/projects/images/research-papers-recommendation-system-cover.jpg': { width: 791, height: 527 },
  'assets/projects/images/salary-prediction-project-cover.jpg': { width: 6016, height: 4000 },
  'assets/projects/images/sales-analytics-dashboard-cover.png': { width: 1280, height: 720 },
  'assets/projects/images/tsc-finance-temporal-signal-classification-cover.png': { width: 1165, height: 472 },
  'assets/projects/images/twitter-activity-french-deputies-cover.jpg': { width: 1200, height: 800 },
}

export function getImageDimensions(source?: string) {
  if (!source) return undefined

  const normalizedSource = source
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/portfolio\//, '')
    .replace(/^\/+/, '')

  return IMAGE_DIMENSIONS[normalizedSource]
}
