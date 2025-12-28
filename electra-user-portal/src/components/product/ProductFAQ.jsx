import { useState } from "react";

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="faq">
      <h2>Frequently Asked Questions</h2>

      {FAQS.map((f, i) => (
        <div
          key={i}
          className={`faq-item ${openFaq === i ? "open" : ""}`}
          onClick={() => setOpenFaq(openFaq === i ? null : i)}
        >
          <div className="question">
            <span>{f.q}</span>
            <span className="icon">{openFaq === i ? "−" : "+"}</span>
          </div>
          <div className="answer">{f.a}</div>
        </div>
      ))}
    </section>
  );
}

const FAQS = [
  { q: "Do you deliver all over India?", a: "Yes. We provide all-India delivery." },
  { q: "Are shipping charges included?", a: "No. Shipping charges are extra." },
  { q: "How long does delivery take?", a: "15–25 days due to bulk production." },
  { q: "How can I track my order?", a: "Tracking will be shared via email." },
  { q: "Can I cancel or modify my order?", a: "No, once payment is confirmed." },
  { q: "How do I choose the right size?", a: "Refer to the size chart." },
  { q: "Is this official Electra merchandise?", a: "Yes, officially distributed." },
];
