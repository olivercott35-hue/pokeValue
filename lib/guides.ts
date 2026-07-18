export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  updated: string;
  sections: {
    heading: string;
    body: string[];
  }[];
};

export const guides: Guide[] = [
  {
    slug: "how-to-value-pokemon-cards",
    title: "How to Value Pokémon Cards in the UK",
    description:
      "A practical UK guide to identifying the exact printing, assessing condition, comparing marketplace evidence, accounting for fees and producing a realistic Pokémon card valuation.",
    category: "Card Values",
    readTime: "6 min read",
    updated: "18 July 2026",
    sections: [
      {
        heading: "Start with the exact card, not only the Pokémon name",
        body: [
          "A useful valuation begins with identification. Two cards can feature the same Pokémon and almost identical artwork while belonging to different sets, years, languages or print variants. Check the set symbol, collector number, card name, rarity, language and any first-edition, reverse-holo, promotional or stamped markings before comparing prices.",
          "Use the collector number together with the set name whenever possible. A search for “Charizard 100/101 Dragon Frontiers” is much more precise than a search for “old Charizard”. If the card has no obvious set symbol, compare it with a verified checklist and look for copyright dates, promotional numbering and card-layout details.",
        ],
      },
      {
        heading: "Confirm the finish and print variant",
        body: [
          "Normal, holofoil, reverse-holo, first-edition and unlimited copies should not be valued as though they are interchangeable. The same database record can sometimes contain several marketplace price fields, and the highest field may belong to a different variant from the card in your hand.",
          "PokeValue displays the marketplace and selected variant beside the estimate. Before using that figure, compare the finish of your physical card with the labelled variant. If they do not match, find evidence for the correct version rather than applying the displayed number automatically.",
        ],
      },
      {
        heading: "Assess condition before looking at the final number",
        body: [
          "Condition can create a large gap between two copies of the same card. Inspect the front and back under bright, indirect light. Look for whitening, corner wear, scratches, print lines, dents, creases, stains, edge chips, silvering and surface pressure marks. Tilt holofoil cards slowly because scratches and indentations can disappear when viewed straight on.",
          "Use conservative wording. A card that looks clean in a sleeve is not automatically Near Mint. Remove it carefully, inspect both sides and note every defect. When unsure between two condition categories, valuing at the lower category is usually safer than assuming a premium condition that a buyer may reject.",
        ],
      },
      {
        heading: "Compare sold evidence, not only optimistic listings",
        body: [
          "An active listing shows what a seller hopes to receive; it does not prove that buyers are paying that amount. Recent completed sales are more useful when they match the same printing, language, condition and grading status. One unusual sale should not define the value, especially when several lower sales sit around a consistent range.",
          "Try to collect at least three relevant comparisons. Remove obvious outliers, damaged copies presented as clean, lots containing several cards and sales with unclear photographs. If there are very few recent sales, use a wider range and state that confidence is low rather than presenting a precise figure that the evidence cannot support.",
        ],
      },
      {
        heading: "Use marketplace estimates as a starting point",
        body: [
          "Marketplace trend and market fields are useful for screening a large collection, but they are not guaranteed sale prices. They may combine listings from different sellers, may update at different intervals and may not reflect the exact condition of your copy. A displayed estimate should lead to further checking, not replace it.",
          "PokeValue uses one consistent resolver across card, set and collection pages. For a UK and European audience, available Cardmarket data is prioritised, with one clearly labelled available TCGplayer market variant used as a fallback. The full rule and its limitations are explained on the Pricing Methodology page.",
        ],
      },
      {
        heading: "Convert currencies and account for selling costs",
        body: [
          "A euro or US-dollar marketplace value is not the same as the amount that reaches a UK seller. Currency conversion changes, and a sale may also involve marketplace fees, payment fees, postage, packaging, insurance or an auction-house commission. Buyers may also pay less when a seller has limited feedback or weak photographs.",
          "For example, imagine matching raw sales around £120. If selling costs and insured delivery total roughly £15, the practical net value may be nearer £105. A local cash buyer may offer less for convenience, while a patient direct sale could achieve more. Decide whether you are estimating retail asking value, likely sale value or expected net proceeds and label it clearly.",
        ],
      },
      {
        heading: "Separate raw and graded markets",
        body: [
          "A raw card should not be valued from the price of a top-graded copy. Graded prices include the assigned grade, authentication, population, holder preference and buyer confidence. Even a visually clean raw card may receive a lower grade because of centering, tiny surface damage or print defects.",
          "When considering grading, compare the raw value with several realistic grade outcomes rather than only the highest grade. Include grading fees, shipping, insurance and the time your money is tied up. A card can be collectible and valuable without grading being financially sensible.",
        ],
      },
      {
        heading: "Create a valuation range",
        body: [
          "A range is often more honest than a single number. Record a conservative value, a likely value and a strong-sale value. The conservative figure might reflect a quick sale or the lower end of comparable condition; the likely figure should match the central cluster of evidence; the strong-sale figure assumes good presentation and patience.",
          "For a card with comparable sales at £82, £90, £94 and £110, a reasonable working range might be £85–£100 rather than claiming exactly £94.00. If your copy has noticeable whitening compared with the sold examples, move the range down. If it is clearly cleaner and the market is active, the upper end may be more realistic.",
        ],
      },
      {
        heading: "Common valuation mistakes",
        body: [
          "Frequent mistakes include comparing the wrong set, using a first-edition price for an unlimited card, treating reverse-holo and normal copies as identical, ignoring condition, copying the highest active listing, comparing raw cards with graded tens and forgetting selling costs.",
          "Another mistake is assuming rarity guarantees demand. A technically rare card can remain inexpensive when few collectors want it, while a lower-rarity card featuring a popular Pokémon or artwork can sell consistently. Value depends on both scarcity and buyer interest.",
        ],
      },
      {
        heading: "A repeatable UK valuation checklist",
        body: [
          "Write down the exact set, number, language and finish. Inspect condition outside the sleeve. Check the clearly labelled PokeValue marketplace estimate. Collect several recent matching sales. Exclude mismatched variants and obvious outliers. Convert currencies where needed, subtract likely selling costs and finish with a range rather than an unsupported exact figure.",
          "Recheck important cards before selling because markets change. For expensive vintage cards, unusual errors or cards with uncertain authenticity, consider an experienced dealer, auction specialist or recognised grading service. PokeValue is a research tool, not a guaranteed professional appraisal.",
        ],
      },
    ],
  },
  {
    slug: "pokemon-card-condition-guide",
    title: "Pokémon Card Condition Guide for Collectors",
    description:
      "Learn how to inspect Pokémon card corners, edges, surfaces, centering, dents and creases, then describe condition consistently before buying, selling or grading.",
    category: "Condition",
    readTime: "5 min read",
    updated: "18 July 2026",
    sections: [
      {
        heading: "Why condition descriptions need to be conservative",
        body: [
          "Condition is one of the largest sources of disagreement in Pokémon card sales. Terms such as Near Mint, Excellent, Lightly Played and Played are useful, but marketplaces and collectors do not always apply them in exactly the same way. Clear photographs and a written defect list are more reliable than a label alone.",
          "Describe the card you can prove, not the grade you hope it might receive. A card can look excellent from the front while the back has edge whitening, a pressure dent or a small crease. Inspect both sides before assigning any condition category.",
        ],
      },
      {
        heading: "Prepare a safe inspection area",
        body: [
          "Wash and dry your hands, clear the surface and use bright indirect light. A clean playmat or soft lint-free surface reduces the chance of adding scratches. Remove the card from rigid holders slowly and avoid dragging the surface against a sleeve seam.",
          "Use a movable desk lamp and inspect from several angles. A phone torch held too close can create glare, so move the light rather than relying on one straight-on view. Magnification can help with expensive cards, but normal viewing is still important because buyers judge the overall presentation as well as tiny defects.",
        ],
      },
      {
        heading: "Corners",
        body: [
          "Check all eight visible corner faces: four on the front and four on the back. Look for whitening, rounding, splitting, lifting foil and small impact marks. One damaged corner can materially affect a clean-looking card, particularly when grading is being considered.",
          "Vintage cards may have minor corner wear consistent with age, but age does not erase the defect. Photograph each corner closely when selling a valuable card. Avoid using a dark background that hides whitening or an overexposed background that removes edge detail.",
        ],
      },
      {
        heading: "Edges",
        body: [
          "Run your eyes along every edge without rubbing it. Common problems include white chips, rough factory cuts, silvering on holofoil borders, small dents and edge impressions caused by tight binders or poor storage. Check the back carefully because blue-border whitening is often easier to see there.",
          "Factory roughness and later wear can look similar. For a sales description, the practical point is that the defect is visible, not whether it occurred during printing. State what can be seen and include a clear photograph rather than promising a buyer that an imperfection will be ignored by a grader.",
        ],
      },
      {
        heading: "Front and back surfaces",
        body: [
          "Tilt the card slowly under light. Search for scratches, scuffs, fingerprints, stains, clouding, print lines, roller marks, indentations and areas where the gloss differs. Holofoil surfaces can hide fine scratching until the light reaches the correct angle.",
          "Do not attempt aggressive cleaning. Liquids, abrasives, erasers and polishes can alter the finish or create new damage. A loose speck can sometimes be removed safely with clean air or an extremely soft approach, but a mark that does not lift immediately should be treated as part of the condition.",
        ],
      },
      {
        heading: "Dents, bends and creases",
        body: [
          "A pressure dent may be visible only from one angle, but it can be more serious than light edge whitening. Check around the artwork, text box and centre of the back for small depressions. Binder rings, top loaders, clips and stacked objects are common causes.",
          "A crease breaks or permanently folds the card structure and normally moves the card into a significantly lower condition category. Flattening a crease under weight does not restore the fibres. Disclose it clearly even when the front artwork makes it difficult to notice.",
        ],
      },
      {
        heading: "Centering and print quality",
        body: [
          "Centering describes how evenly the printed design sits within the borders. It matters strongly for grading, but an off-centre card can still have clean surfaces and edges. Keep centering separate from physical wear when describing a raw card.",
          "Other factory issues include print lines, ink dots, miscuts, texture problems and poorly cut edges. Some genuine errors attract collectors, but most ordinary print defects reduce grading potential. Do not call a printing flaw an error card unless the feature is recognised and clearly documented.",
        ],
      },
      {
        heading: "Practical raw condition categories",
        body: [
          "Near Mint generally means a clean card with only very minor imperfections visible on close inspection. Lightly Played usually allows limited edge wear or fine scratching while keeping strong overall presentation. Moderately Played has more obvious wear, and Heavily Played includes substantial whitening, scratches, dents or structural damage. Damaged cards may have creases, tears, water damage, writing or severe surface problems.",
          "These descriptions are not universal grading standards. When a card sits between categories, use the lower category and explain why. Buyers are more likely to trust a conservative listing with detailed photographs than an optimistic label followed by hidden defects.",
        ],
      },
      {
        heading: "Condition and grading are not the same thing",
        body: [
          "A seller's Near Mint description does not guarantee a high numerical grade. Grading companies apply their own standards to centering, corners, edges, surface and authenticity. Tiny defects that are acceptable in a raw marketplace description can still prevent a top grade.",
          "Before submitting, inspect the card as though you were trying to reject it. Estimate several possible grades and compare the financial result for each one. If grading only makes sense at the highest possible grade, the decision is carrying substantial risk.",
        ],
      },
      {
        heading: "How to document condition when selling",
        body: [
          "Use front and back photographs, close-ups of every defect and at least one angled-light image for holofoil or textured cards. Avoid filters, heavy sharpening and dark sleeves that hide the edges. State whether the card has a dent, crease, print line or noticeable whitening instead of relying only on “see pictures”.",
          "Package the card so its condition cannot worsen in transit. Use an inner sleeve, suitable rigid protection, a team bag or sealed outer sleeve, and a rigid mailer or box appropriate to the value. Good documentation protects both buyer and seller if a dispute occurs.",
        ],
      },
    ],
  },
  {
    slug: "how-to-spot-fake-pokemon-cards",
    title: "How to Spot Fake Pokémon Cards Safely",
    description:
      "A careful authentication checklist covering print quality, fonts, texture, holo patterns, card stock, numbering and seller warning signs without damaging the card.",
    category: "Authenticity",
    readTime: "5 min read",
    updated: "18 July 2026",
    sections: [
      {
        heading: "Use several checks together",
        body: [
          "No single home test proves that a Pokémon card is genuine. Counterfeits vary from obvious low-quality copies to convincing reproductions. The safest approach is to compare several features against a verified card from the same set and printing.",
          "Do not destroy a card to test it. Rip tests, cutting edges and chemical tests permanently damage genuine cards and are unnecessary for normal collecting. When the value is high or the evidence conflicts, seek an experienced dealer or recognised authentication service.",
        ],
      },
      {
        heading: "Confirm that the card should exist",
        body: [
          "Search the exact set and collector number in a reliable checklist. Confirm the card name, artwork, rarity, language, weakness, resistance, attacks, HP, copyright line and set symbol. Fake cards often combine artwork from one printing with the text or number from another.",
          "Watch for impossible combinations, such as a modern rarity treatment on an older layout, a collector number not found in the set, or a promotional stamp that does not match known distribution. An unfamiliar card is not automatically fake, but it needs stronger verification.",
        ],
      },
      {
        heading: "Compare fonts, spacing and symbols",
        body: [
          "Official cards use consistent typefaces, spacing and symbol shapes within an era. Counterfeits may have letters that are too thin or bold, uneven line spacing, incorrect energy symbols, misplaced accent marks or text that sits too close to a border.",
          "Compare with a high-resolution verified image and, ideally, a genuine physical card from the same set. Do not compare only with a random online photograph because colour balance, compression and camera angle can make genuine printing look different.",
        ],
      },
      {
        heading: "Inspect colour and print sharpness",
        body: [
          "Fake cards often have oversaturated artwork, muddy shadows, weak blacks or a back colour that is noticeably purple, grey or washed out. Fine text and thin lines may look fuzzy because the card was copied from a scan rather than printed from original production files.",
          "Colour alone is not decisive. Genuine cards vary between print runs, factories and languages, and phone cameras alter white balance. Use colour as one part of the evidence and compare under the same lighting.",
        ],
      },
      {
        heading: "Check holofoil and texture behaviour",
        body: [
          "The holo pattern should match the specific card and era. Some fakes use a generic rainbow sheet across the entire card, while the genuine version limits foil to particular areas or uses a recognisable directional pattern. Tilt the card and compare how the foil moves.",
          "Modern textured cards should have texture lines that align with the intended design rather than a random grid or smooth glossy surface. A missing texture is suspicious when the exact genuine printing is known to have one, but confirm the variant because normal and promotional copies can differ.",
        ],
      },
      {
        heading: "Feel, thickness and edges",
        body: [
          "Counterfeits may feel excessively glossy, thin, stiff or waxy. Genuine card stock usually has a consistent layered feel, but age, humidity and sleeves can affect handling. Avoid flexing an expensive card simply to judge stiffness.",
          "Inspect the edge under good light. Some genuine cards show a dark internal layer, while many fakes reveal bright white or poorly bonded stock. This is only a supporting clue; edge appearance varies and should never be used alone to authenticate a card.",
        ],
      },
      {
        heading: "Be cautious with the light test",
        body: [
          "Holding a light behind a card is sometimes suggested because thin counterfeit stock may transmit more light. The result changes with the torch strength, card era, print factory and surrounding light, so it is not a pass-or-fail test.",
          "A card that transmits light is not automatically fake, and a thick counterfeit may block light. Use the test only as a comparison between cards from the same era and never expose the card to heat or prolonged intense light.",
        ],
      },
      {
        heading: "Seller and listing warning signs",
        body: [
          "A price far below the normal range, stock photographs, refusal to show the back, blurred images, a large supply of rare cards and pressure to pay outside protected systems are warning signs. Check feedback, sale history and whether the seller answers specific questions about condition and origin.",
          "Bundles described as “gold metal cards”, unofficial fan cards or novelty cards may be sold openly, but they should not be represented as official tournament-legal Pokémon TCG cards. Read the wording carefully and do not assume every item using Pokémon artwork is an authentic trading card.",
        ],
      },
      {
        heading: "Vintage and high-value cards",
        body: [
          "Vintage counterfeits can imitate wear to appear convincing. Check period-correct fonts, holo patterns, copyright details and card stock. For first-edition and shadowless cards, verify that every identifying feature belongs together rather than focusing only on the stamp.",
          "For a high-value purchase, request clear front, back, edge and angled-light photographs before paying. Consider an in-person inspection or an authentication-backed marketplace. The cost of professional verification can be reasonable compared with the loss from buying a sophisticated counterfeit.",
        ],
      },
      {
        heading: "A safe authentication checklist",
        body: [
          "Confirm the set and number, compare the layout with a verified example, inspect fonts and symbols, examine print sharpness, verify holo or texture behaviour, inspect the back and edges, and assess the seller. Record which checks passed and which remain uncertain.",
          "If several independent details are wrong, treat the card as suspicious. If everything appears correct but the value is significant, that is still not a guarantee. Authentication is about building confidence from consistent evidence, not finding one magical test.",
        ],
      },
    ],
  },
  {
    slug: "should-you-grade-your-pokemon-cards",
    title: "Should You Grade Your Pokémon Cards?",
    description:
      "A UK-focused decision guide covering condition screening, fees, realistic grade outcomes, liquidity, population reports and when keeping a card raw makes more sense.",
    category: "Grading",
    readTime: "5 min read",
    updated: "18 July 2026",
    sections: [
      {
        heading: "Grading solves specific problems",
        body: [
          "A graded holder provides an independent opinion on authenticity and condition, protects the card and can make valuable cards easier to compare. It can also improve buyer confidence when the grading company is recognised by the intended market.",
          "Grading does not automatically create profit. The result may be lower than expected, fees can be substantial and some collectors prefer raw cards. Start by deciding whether your goal is protection, authentication, resale, registry collecting or personal presentation.",
        ],
      },
      {
        heading: "Identify the exact card and raw value",
        body: [
          "Before estimating a graded outcome, confirm the exact set, number, language, finish and edition. Compare several recent raw sales in matching condition. An incorrect variant can make the entire grading calculation meaningless.",
          "Use a realistic raw value rather than the highest asking price. If a clean raw card regularly sells around £70, treat £70 as the opportunity cost of submitting it because you could potentially sell it without paying grading fees or waiting for a return.",
        ],
      },
      {
        heading: "Screen condition ruthlessly",
        body: [
          "Inspect centering, corners, edges and surfaces under angled light. Look for whitening, dents, print lines, scratches, stains, creases and factory defects. A tiny dent can matter more than several small edge marks, and clean-looking fronts can hide damage on the back.",
          "Estimate at least three outcomes: a disappointing grade, a likely grade and an optimistic grade. If the submission only works financially at the optimistic result, it is a high-risk decision rather than an obvious grading candidate.",
        ],
      },
      {
        heading: "Calculate the complete cost",
        body: [
          "Include the grading fee, shipping to the service, return shipping, insurance, intermediary fees, customs or tax where relevant, protective packaging and the cost of capital while the card is unavailable. Promotional grading prices can still become expensive once a single-card shipment is fully insured.",
          "Suppose a card is worth £80 raw and the complete submission cost is £35. Your effective position is already £115 before considering selling fees. If the likely graded sale is £120, the small difference may not justify the risk, time and possibility of a lower grade.",
        ],
      },
      {
        heading: "Compare realistic graded sales",
        body: [
          "Use sold evidence for the same card, language, grading company and numerical grade. A grade from one company may not trade at the same price as the same number from another. Do not value every slab from the most expensive result in the market.",
          "Look at sale frequency as well as price. A card showing one high sale and no other buyers may be difficult to liquidate. A slightly lower price with regular sales can be more useful when deciding whether grading improves marketability.",
        ],
      },
      {
        heading: "Understand population reports",
        body: [
          "Population reports show how many examples a grading company has recorded at each grade, but they do not reveal every card in existence. Resubmissions, crossovers and cards graded by other companies can distort the apparent supply.",
          "A low population can support interest when demand is strong, but low population alone does not create value. Some cards have few graded copies because few collectors want to submit them. Combine population data with sale frequency and collector demand.",
        ],
      },
      {
        heading: "Choose a service for the intended buyer",
        body: [
          "UK collectors may consider domestic services for lower shipping complexity, while international companies may have broader resale recognition for certain cards. Compare current fees, insurance arrangements, declared-value rules, turnaround information and the prices achieved by each holder in your target market.",
          "Do not select a company only because it appears to give higher grades. Consistent standards, authentication reputation, holder security, customer support and buyer trust matter. Service terms change, so confirm the current details directly before sending cards.",
        ],
      },
      {
        heading: "When grading often makes sense",
        body: [
          "Strong candidates include valuable cards that need authentication, exceptionally clean vintage cards, high-demand modern chase cards with realistic top-grade potential, cards where a mid-grade still preserves value and sentimental cards that benefit from long-term protection.",
          "Grading can also make collection management easier when insurance or inheritance records require a third-party description. Financial return is not the only valid reason, but the owner should be clear when the decision is personal rather than an investment calculation.",
        ],
      },
      {
        heading: "When keeping a card raw may be better",
        body: [
          "Low-value cards, cards with obvious dents or creases, cards where grading costs approach the raw value and cards with a very small graded buyer pool often make more sense raw. Some binder collectors also value easy viewing and set completion more than a slab.",
          "Keeping a card raw does not mean leaving it unprotected. Use an appropriate sleeve, rigid holder or binder, control moisture and sunlight, and document the condition. You can reconsider grading if the market, card value or your collecting goal changes.",
        ],
      },
      {
        heading: "A simple grading decision worksheet",
        body: [
          "Write down the raw sale range, complete grading cost, estimated values for several grades, probability you assign to each outcome, expected selling fees and expected waiting time. Then compare the weighted result with selling or keeping the card raw.",
          "For example, a £150 raw card with £40 total grading cost should not be judged only against a £400 top-grade sale. If the likely grade sells for £190 and a lower grade sells for £130, the downside and fees may outweigh the chance of the top result. Use conservative evidence and grade because the full decision makes sense, not because the best-case number is exciting.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
