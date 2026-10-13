import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    q: "Is QuickLink free to use?",
    a: "Yes! You can shorten unlimited links for free. Extra features require an account.",
  },
  {
    q: "Can I create custom slugs?",
    a: "Yes, registered users can set custom slugs for their links.",
  },
  {
    q: "Do you provide analytics?",
    a: "Absolutely! Track clicks, location, and devices with our analytics dashboard.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-20 px-6 bg-slate-50">
      <h2
        className="text-3xl font-bold text-center text-slate-800 mb-12"
        data-aos="fade-up"
      >
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="mb-4 bg-white border rounded-lg shadow-sm"
            data-aos="fade-up"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center px-4 py-3 text-left text-lg font-medium text-slate-800"
            >
              {faq.q}
              <FaChevronDown
                className={`transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-4 py-3 text-slate-600 border-t bg-slate-50">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
