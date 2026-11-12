import Layout from "@/components/layout/layout";
import { SEO } from "@/components/seo";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";
import { POLICIES } from "@/lib/site-facts";

/*
 * Wording note: "start date" means the first day of the booked service —
 * check-in for accommodation, the experience date, or day 1 of a journey.
 * Day ranges are written "31 days or more" / "30 days or fewer" so no day
 * is left undefined.
 */

export default function TermsOfService() {
  const c = useSiteContent();
  const title = pickContent(c, "terms.title", "Terms of Service");
  return (
    <>
      <SEO
        title="Terms of Service - Booking Conditions & Policies"
        description="Complete terms of service covering booking procedures, deposit requirements, payment terms, cancellation policies, and travel conditions for all Soléi bookings."
        path="/terms-of-service"
      />
      <Layout>
      <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-solei-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center">{title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">1. Our Contract</h2>
          <p>Soléi Inc. owns and operates <strong><a href="https://soléi.com" className="text-solei-teal">soléi.com</a></strong> Soléi operates its own properties in Siwa Oasis and books partner hotels, experiences, journeys and ground transport on your behalf. Soléi does not sell flights.</p>
          <p>By booking your experience with Soléi Inc. ("Soléi"), <strong>you confirm that you have read and accepted these Terms of Service in full</strong>.</p>
          <p>The services provided to you are those shown on your booking-confirmation invoice.</p>
          <p><strong>Product-specific terms take precedence.</strong> {POLICIES.cancellationPrecedence}</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">2. Validity</h2>
          <p>All dates, itineraries, and prices are valid <strong>from 05-07-2025 until 04-07-2030</strong>.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">3. Deposit Requirements</h2>
          <p>Unless the product's booking page states otherwise (see §1 — product-specific terms take precedence; for example, Siwa accommodation and experiences may be paid in full when you book):</p>
          <ul>
            <li>A <strong>non-refundable deposit of 20 %</strong> per person, per booking, is required to confirm any booking.</li>
            <li>Bookings made <strong>30 days or fewer</strong> before the start date must be paid <strong>in full at the time of booking</strong>.</li>
            <li>Certain journeys may require a higher deposit; details are stated on the journey's page and confirmed when you book.</li>
          </ul>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">4. Acceptance of Booking & Final Payments</h2>
          <ol>
            <li>Once Soléi accepts your booking, we issue an <strong>invoice</strong>; that invoice date becomes the <strong>contract date</strong>.</li>
            <li><strong>Final payment</strong> is due <strong>31 days before the start date</strong> (unless the product's booking page states otherwise).</li>
            <li>If we do not receive the balance on or before the due date, we reserve the right to <strong>cancel your booking</strong>.</li>
          </ol>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">5. Traveller Details</h2>
          <p>To confirm your travel arrangements you must supply, by the balance-due date:</p>
          <ul>
            <li>Full name (exactly as in passport)</li>
            <li>Nationality</li>
            <li>Passport number, issue date & expiry date</li>
            <li>Date of birth</li>
            <li>Any pre-existing medical conditions that may affect your travel</li>
          </ul>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">6. Cancellation by the Traveller</h2>
          <p>{POLICIES.cancellationPrecedence} The schedule below applies only where a product's booking page does not state its own cancellation terms.</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 my-4">
              <thead>
                <tr className="bg-solei-navy text-white">
                  <th className="border border-gray-300 px-4 py-2 text-left">Notice given before the start date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Cancellation fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2"><strong>46 days or more</strong></td>
                  <td className="border border-gray-300 px-4 py-2">Deposit retained</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2"><strong>31–45 days</strong></td>
                  <td className="border border-gray-300 px-4 py-2">Greater of deposit <strong>or</strong> 50 % of total cost</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2"><strong>30 days or fewer</strong></td>
                  <td className="border border-gray-300 px-4 py-2">100 % of total cost</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><em>Cancellation is effective only when Soléi receives <strong>written notice</strong>.</em></p>
          <p>No refunds are given for unused services once a stay, experience or journey has started.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">7. Cancellation by Soléi Inc.</h2>
          <p>We may cancel a booking up to <strong>28 days</strong> before the start date if external events (e.g., terrorism, natural disasters, political instability) make operation unviable. You may then:</p>
          <ul>
            <li>transfer payments to new dates, <strong>or</strong></li>
            <li>receive a <strong>full refund</strong> (less any unrecoverable costs).</li>
          </ul>
          <p>Soléi is not liable for incidental expenses you incur (visas, vaccinations, non-refundable flights, etc.).</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">8. Booking Amendments</h2>
          <ul>
            <li>Change to another booking or transfer to a third party <strong>31 days or more</strong> before the start date: <strong>US $50</strong> per person <strong>plus</strong> supplier fees.</li>
            <li>Requests <strong>30 days or fewer</strong> before the start date follow the cancellation terms that apply to the booking (§6).</li>
            <li>No amendments allowed <strong>within 7 days</strong> of the start date.</li>
            <li>Other arrangement changes: <strong>US $25</strong> per booking <strong>plus</strong> supplier fees.</li>
          </ul>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">9. Inclusions & Exclusions</h2>
          <p>Refer to the page for each property, experience or journey for a precise list of what <strong>is</strong> and <strong>is not</strong> included.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">10. Prices & Surcharges</h2>
          <p>Prices are quoted in <strong>US dollars</strong> and are based on exchange rates and supplier costs current when the price was published.</p>
          <p>Soléi may impose surcharges up to <strong>31 days before the start date</strong> for:</p>
          <ul>
            <li>Exchange-rate fluctuations</li>
            <li>Increases in transport or local-operator costs</li>
            <li>Taxes or government actions</li>
          </ul>
          <p>Soléi absorbs the <strong>first 50 %</strong> of any surcharge; you pay the balance.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">11. Age & Health Requirements</h2>
          <ul>
            <li><strong>Minimum age to travel unaccompanied:</strong> 14 years. Younger travellers are welcome when accompanied by a parent or responsible adult.</li>
            <li><strong>No fixed upper age limit</strong>, but some experiences and journeys are physically demanding—ensure fitness to travel.</li>
            <li>Health information is your responsibility; seek professional medical advice as needed.</li>
          </ul>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">12. Passport & Visas</h2>
          <ul>
            <li>Passports must be <strong>valid for at least six months beyond the end date of your stay</strong>.</li>
            <li>Carry all travel documents with you at all times and ensure all visa requirements are met.</li>
          </ul>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">13. Travel Insurance <em>(Mandatory)</em></h2>
          <p>Your policy must cover, at minimum:</p>
          <ul>
            <li>Personal accident & death</li>
            <li>Medical expenses & emergency repatriation <strong>≥ US $100,000</strong> each</li>
            <li>Strongly recommended: cancellation, curtailment, personal liability, and loss of luggage.</li>
          </ul>
          <p>Proof of insurance is required.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">14. Flexibility</h2>
          <p>Itineraries are <strong>representative</strong>; routes, schedules, activities, and transport may change without notice due to local circumstances.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">15. Change of Itinerary</h2>
          <ul>
            <li><strong>Before the start date:</strong> We will notify you of any <strong>major change</strong> (affecting ≥ 1 day). You may accept, choose an alternative, or receive a refund for the affected services.</li>
            <li><strong>After the start date:</strong> We may alter itineraries for safety or operational reasons. Additional costs are your responsibility. Soléi is not liable for incidental expenses (e.g., non-refundable flights).</li>
          </ul>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">16. Limitation of Liability</h2>
          <p>Soléi operates its own Siwa properties (Soléi Old Town, Soléi Royal, Soléi Desert Retreat and Soléi Salt Caves) and is responsible for the services it provides there. For partner hotels and third-party suppliers (transport, activity operators, restaurants, etc.), Soléi acts as an agent: to the fullest extent allowed by law, <strong>Soléi is not liable</strong> for their acts or omissions. Where an implied warranty cannot be excluded, Soléi's liability is limited to:</p>
          <ol>
            <li>providing services of equal value, <strong>or</strong></li>
            <li>refunding all monies received for the booking.</li>
          </ol>
          <p>Soléi is <strong>not</strong> liable for indirect, consequential, or economic loss.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">17. Optional Activities</h2>
          <p>Activities not explicitly included in your booking price are <strong>not</strong> part of this contract.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">18. Claims & Complaints</h2>
          <ol>
            <li>Raise issues <strong>immediately</strong> with your property, guide or our local team.</li>
            <li>If unresolved, submit a formal written complaint within <strong>30 days</strong> of the end of your stay.</li>
          </ol>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">19. Photos & Marketing</h2>
          <p>You grant Soléi a <strong>perpetual, worldwide, royalty-free licence</strong> to use images of you taken on tour for promotional purposes.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">20. Privacy Policy</h2>
          <p>Personal data is used solely for booking operations or Soléi marketing, and may be shared with relevant agents/suppliers. See our website for the full policy.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">21. Applicable Law & Jurisdiction</h2>
          <p>These Terms are governed by the <strong>laws of Egypt</strong>.</p>
          <p>Any dispute shall be brought before the <strong>courts of Cairo, Egypt</strong>.</p>

          <hr className="my-8 border-gray-200" />

          <h2 className="text-2xl font-bold text-solei-navy mt-8 mb-4">22. Registered Address</h2>
          <p><strong>Soléi Inc.</strong><br />
          31 Central Avenue, Moqattam<br />
          Cairo 11572, Egypt</p>

        </div>
      </div>
    </div>
    </Layout>
    </>
  );
}