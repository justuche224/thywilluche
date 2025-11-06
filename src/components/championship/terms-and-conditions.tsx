"use client";

import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import Link from "next/link";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen space-y-10 my-10">
      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className={`text-4xl lg:text-6xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              TERMS AND CONDITIONS
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light mb-8">
              Championship Registration Terms and Conditions
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                1. Registration Eligibility
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  By registering for the Championship, you confirm that you meet
                  all eligibility requirements as specified on the registration
                  page. You must be an active member of the community and have
                  purchased the required book to participate.
                </p>
                <p>
                  Registration is subject to verification, and we reserve the
                  right to reject any registration that does not meet the
                  specified criteria.
                </p>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                2. Registration Fee
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  A non-refundable registration fee is required to complete your
                  registration. The fee amount is specified on the registration
                  page and must be paid in full before your registration can be
                  processed.
                </p>
                <p>
                  Payment must be made using the provided payment details. You
                  are responsible for ensuring that all payment information is
                  accurate and complete.
                </p>
                <p>
                  Once payment is received and verified, your registration will
                  be reviewed and processed. Registration fees are
                  non-refundable under any circumstances, including but not
                  limited to withdrawal, disqualification, or cancellation of
                  the event.
                </p>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                3. Payment Receipt
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  You must upload a valid payment receipt as proof of payment.
                  The receipt must be clear, legible, and show all relevant
                  transaction details.
                </p>
                <p>
                  Acceptable formats include screenshots or photos of payment
                  receipts. The receipt must clearly show the payment amount,
                  account details, and transaction reference number.
                </p>
                <p>
                  We reserve the right to request additional verification if the
                  submitted receipt is unclear or incomplete.
                </p>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                4. Registration Status
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  Upon submission, your registration will be reviewed by our
                  team. You will receive email notifications regarding the
                  status of your registration.
                </p>
                <p>Registration statuses include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Pending:</strong> Your registration is under review
                  </li>
                  <li>
                    <strong>Approved:</strong> Your registration has been
                    accepted and confirmed
                  </li>
                  <li>
                    <strong>Rejected:</strong> Your registration has been
                    declined for reasons that will be communicated to you
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                5. Personal Information
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  You agree to provide accurate, current, and complete
                  information during registration. You are responsible for
                  maintaining the accuracy of your registration information.
                </p>
                <p>
                  Your personal information will be handled in accordance with
                  our privacy policy. By registering, you consent to the
                  collection, use, and storage of your personal information as
                  necessary for the administration of the Championship.
                </p>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                6. Code of Conduct
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  All participants are expected to maintain high standards of
                  conduct and respect for other participants, organizers, and
                  the community.
                </p>
                <p>
                  Any behavior deemed inappropriate, disruptive, or in violation
                  of community guidelines may result in immediate
                  disqualification and removal from the Championship without
                  refund.
                </p>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                7. Disqualification
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>We reserve the right to disqualify any participant who:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provides false or misleading information</li>
                  <li>Violates the terms and conditions</li>
                  <li>Engages in inappropriate conduct</li>
                  <li>Fails to meet eligibility requirements</li>
                  <li>Submits fraudulent payment receipts</li>
                </ul>
                <p>
                  Disqualified participants will not be entitled to any refund
                  of registration fees.
                </p>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                8. Modifications and Cancellations
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  We reserve the right to modify, postpone, or cancel the
                  Championship at any time due to circumstances beyond our
                  control, including but not limited to natural disasters,
                  public health emergencies, or other unforeseen events.
                </p>
                <p>
                  In the event of cancellation, we will make reasonable efforts
                  to notify all registered participants. However, registration
                  fees remain non-refundable.
                </p>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                9. Limitation of Liability
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  To the maximum extent permitted by law, we shall not be liable
                  for any indirect, incidental, special, consequential, or
                  punitive damages arising from your participation in the
                  Championship.
                </p>
                <p>
                  Our total liability shall not exceed the amount of the
                  registration fee paid by you.
                </p>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                10. Acceptance of Terms
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  By submitting your registration and payment, you acknowledge
                  that you have read, understood, and agree to be bound by these
                  Terms and Conditions.
                </p>
                <p>
                  If you do not agree to these terms, you should not proceed
                  with registration.
                </p>
              </div>
            </div>

            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2
                className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-4 ${oswald.className}`}
              >
                11. Contact Information
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-3">
                <p>
                  If you have any questions or concerns regarding these Terms
                  and Conditions, please contact us through the provided contact
                  channels.
                </p>
                <p>
                  We are committed to addressing your inquiries in a timely and
                  professional manner.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-600 mb-6">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-[#800000] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#600000] transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/championship/registration">
                  Back to Registration
                </Link>
              </motion.button>
              <motion.button
                className="border-2 border-[#800000] text-[#800000] px-8 py-4 rounded-lg font-semibold hover:bg-[#800000] hover:text-white transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/championship">Back to Championship</Link>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
