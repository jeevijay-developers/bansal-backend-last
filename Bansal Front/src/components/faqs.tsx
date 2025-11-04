
const Faqs = ({ faqs }: any) => {
    return (
        <>
            <section className="overflow-hidden">
                <div className="faq-section">
                    <div className="container" data-aos="zoom-in">
                        <h2 className="heading mb-4">Frequently Asked <span> Questions</span></h2>
                        <div className="faq-card">
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                {faqs.map((f: any, index: any) => {
                                    const collapseId = `flush-collapse-${f.id || index}`;
                                    const headingId = `flush-heading-${f.id || index}`;
                                    return (
                                        <div className="accordion-item" key={f.id || index}>
                                            <h2 className="accordion-header" id={headingId}>
                                                <button
                                                    className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#${collapseId}`}
                                                    aria-expanded={index === 0}
                                                    aria-controls={collapseId}>
                                                    {f.title}
                                                </button>
                                            </h2>
                                            <div id={collapseId}
                                                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`} aria-labelledby={headingId}
                                                data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <p className="text text-dark">{f.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

export default Faqs;