/**
 * Shape of the rich tour detail stored in experiences.details (JSONB).
 *
 * Public detail page reads this shape. Admin edits this shape.
 * Optional fields fall through to sensible empty defaults on render.
 */

export interface TourItineraryStep {
  time: string;
  title: string;
  body: string;
}

export interface TourFaq {
  q: string;
  a: string;
}

export interface TourReview {
  name: string;
  origin: string;
  text: string;
}

export interface TourDetail {
  /** Paragraphs shown above the inclusion list. Falls back to the
   *  experience's `description` when empty. */
  overview?: string[];
  /** Bullet points — what is part of the price. */
  includes?: string[];
  /** Bullet points — what is explicitly not part of the price. */
  excludes?: string[];
  /** Numbered timeline of the tour. */
  itinerary?: TourItineraryStep[];
  /** Practical packing / preparation notes. */
  whatToBring?: string[];
  faqs?: TourFaq[];
  reviews?: TourReview[];
  /** Optional meeting point / pick-up note shown near the CTA. */
  meetingPoint?: string;
  /** Cancellation policy summary. */
  cancellationPolicy?: string;
}
