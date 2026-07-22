export default function CTA() {
  return (
    <section className="cta relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,10,0.9)_0%,rgba(8,10,10,0.6)_45%,rgba(8,10,10,0.95)_100%)]" />
      </div>

      <div className="page-padding">
        <div className="container">
          <div
            id="book-a-visit"
            className="wrap cta-wrap relative z-10 flex flex-col gap-12 lg:gap-20 justify-between lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
          >
            <div className="cta-left lg:pr-10">
              <div data-anim="element" className="mb-6 inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
                <span className="h-px w-10 bg-white/30" />
                Contact
              </div>
              <h2 data-anim="element" className="text-4xl lg:text-6xl font-serif leading-tight">
                Build a Sustainable <br />
                <span>and Affordable</span> Future
              </h2>
              <p data-anim="element" className="b1 mt-6 max-w-xl text-white/75">
                Whether you are searching for a home or exploring a land partnership, schedule a visit or reach out to
                begin your journey with J&amp;Z Holdings.
              </p>
              <div className="mt-10 grid max-w-xl gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
                  <div className="text-2xl font-serif">24hrs</div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Response window</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
                  <div className="text-2xl font-serif">2 Paths</div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Client or Landowner</p>
                </div>
              </div>
            </div>

            <div className="cta-right">
              <div className="grid gap-10 lg:grid-cols-2">
                <div data-anim="element" className="form w-form rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
                  <form id="wf-form-client" name="wf-form-client" data-name="Client Form" method="get" className="form-inner">
                    <input type="hidden" name="leadType" value="Client" />
                    <div className="form-head mb-8">
                      <div className="mb-4 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/60">
                        <span className="h-px w-8 bg-white/30" />
                        Client
                      </div>
                      <h3 className="text-2xl lg:text-4xl font-serif mb-2 leading-tight">Client Inquiry</h3>
                      <p className="b3 text-color-white-50">Looking for a residence? Share your details and we will guide you.</p>
                    </div>
                    <div className="form-fields">
                      <div className="input-wrap w-full">
                        <div className="input w-full">
                          <input
                            className="input__field is-name w-input h-12 w-full"
                            autoCapitalize="words"
                            maxLength={256}
                            name="client_name"
                            data-name="Client Name"
                            placeholder=" "
                            type="text"
                            id="client_name"
                            required
                          />
                          <div className="input__label">Name</div>
                          <div className="input__line w-full"></div>
                        </div>
                      </div>
                      <div className="input-row grid gap-6 md:grid-cols-2">
                        <div className="input-wrap w-full">
                          <div className="input w-full">
                            <input
                              className="input__field w-input h-12 w-full"
                              maxLength={256}
                              name="client_phone"
                              data-name="Client Phone"
                              placeholder=" "
                              type="tel"
                              id="client_phone"
                              required
                            />
                            <div className="input__label">Phone</div>
                            <div className="input__line w-full"></div>
                          </div>
                        </div>
                        <div className="input-wrap w-full">
                          <div className="input w-full">
                            <input
                              className="input__field w-input h-12 w-full"
                              maxLength={256}
                              name="client_email"
                              data-name="Client Email"
                              placeholder=" "
                              type="email"
                              id="client_email"
                              required
                            />
                            <div className="input__label">Email</div>
                            <div className="input__line w-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="input-wrap w-full">
                        <div className="input w-full">
                          <input
                            className="input__field w-input h-12 w-full"
                            maxLength={256}
                            name="client_interest"
                            data-name="Client Interest"
                            placeholder=" "
                            type="text"
                            id="client_interest"
                          />
                          <div className="input__label">Preferred Project / Area</div>
                          <div className="input__line w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="form-bottom">
                      <button
                        type="submit"
                        className="btn w-inline-block w-full rounded-full border border-white/20 bg-white/90 px-6 py-4 text-center text-sm uppercase tracking-[0.35em] text-black shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white"
                      >
                        Submit
                      </button>
                      <p className="b4 text-color-white-50">
                        By clicking on the button you agree with our <a href="#" className="link">privacy policy.</a>
                      </p>
                    </div>
                  </form>
                  <div className="w-form-done">
                    <div>Thank you! Your submission has been received!</div>
                  </div>
                  <div className="w-form-fail">
                    <div>Oops! Something went wrong while submitting the form.</div>
                  </div>
                </div>

                <div data-anim="element" className="form w-form rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
                  <form id="wf-form-landowner" name="wf-form-landowner" data-name="Landowner Form" method="get" className="form-inner">
                    <input type="hidden" name="leadType" value="Landowner" />
                    <div className="form-head mb-8">
                      <div className="mb-4 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/60">
                        <span className="h-px w-8 bg-white/30" />
                        Landowner
                      </div>
                      <h3 className="text-2xl lg:text-4xl font-serif mb-2 leading-tight">Landowner Partnership</h3>
                      <p className="b3 text-color-white-50">Have land to develop? Tell us about it and we will reach out.</p>
                    </div>
                    <div className="form-fields">
                      <div className="input-wrap w-full">
                        <div className="input w-full">
                          <input
                            className="input__field is-name w-input h-12 w-full"
                            autoCapitalize="words"
                            maxLength={256}
                            name="landowner_name"
                            data-name="Landowner Name"
                            placeholder=" "
                            type="text"
                            id="landowner_name"
                            required
                          />
                          <div className="input__label">Name</div>
                          <div className="input__line w-full"></div>
                        </div>
                      </div>
                      <div className="input-row grid gap-6 md:grid-cols-2">
                        <div className="input-wrap w-full">
                          <div className="input w-full">
                            <input
                              className="input__field w-input h-12 w-full"
                              maxLength={256}
                              name="landowner_phone"
                              data-name="Landowner Phone"
                              placeholder=" "
                              type="tel"
                              id="landowner_phone"
                              required
                            />
                            <div className="input__label">Phone</div>
                            <div className="input__line w-full"></div>
                          </div>
                        </div>
                        <div className="input-wrap w-full">
                          <div className="input w-full">
                            <input
                              className="input__field w-input h-12 w-full"
                              maxLength={256}
                              name="landowner_email"
                              data-name="Landowner Email"
                              placeholder=" "
                              type="email"
                              id="landowner_email"
                              required
                            />
                            <div className="input__label">Email</div>
                            <div className="input__line w-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="input-wrap w-full">
                        <div className="input w-full">
                          <input
                            className="input__field w-input h-12 w-full"
                            maxLength={256}
                            name="land_location"
                            data-name="Land Location"
                            placeholder=" "
                            type="text"
                            id="land_location"
                          />
                          <div className="input__label">Land Location</div>
                          <div className="input__line w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="form-bottom">
                      <button
                        type="submit"
                        className="btn w-inline-block w-full rounded-full border border-white/20 bg-white/90 px-6 py-4 text-center text-sm uppercase tracking-[0.35em] text-black shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white"
                      >
                        Submit
                      </button>
                      <p className="b4 text-color-white-50">
                        By clicking on the button you agree with our <a href="#" className="link">privacy policy.</a>
                      </p>
                    </div>
                  </form>
                  <div className="w-form-done">
                    <div>Thank you! Your submission has been received!</div>
                  </div>
                  <div className="w-form-fail">
                    <div>Oops! Something went wrong while submitting the form.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
