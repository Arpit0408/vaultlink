import React, { useState, useEffect } from "react";
import * as chrono from "chrono-node";
import { Clock, CheckCircle2, Sparkles } from "lucide-react";

const NaturalExpiryInput = ({ valueMinutes, onChangeMinutes }) => {
  const [textInput, setTextInput] = useState("");
  const [parsedDate, setParsedDate] = useState(null);
  const [parsedMinutes, setParsedMinutes] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

  const evaluateNaturalLanguage = (rawText) => {
    if (!rawText || !rawText.trim()) {
      setParsedDate(null);
      setParsedMinutes(null);
      setErrorNotice(null);
      onChangeMinutes("");
      return;
    }

    try {
      const now = new Date();
      const parsed = chrono.parseDate(rawText, now, { forwardDate: true });

      if (parsed && parsed.getTime() > now.getTime()) {
        const diffMs = parsed.getTime() - now.getTime();
        const minutes = Math.max(1, Math.round(diffMs / (1000 * 60)));
        setParsedDate(parsed);
        setParsedMinutes(minutes);
        setErrorNotice(null);
        onChangeMinutes(minutes);
      } else if (parsed && parsed.getTime() <= now.getTime()) {
        setErrorNotice("Time must be in the future");
        setParsedDate(null);
        setParsedMinutes(null);
        onChangeMinutes("");
      } else {
        setErrorNotice("Try typing 'in 2 hours', 'tomorrow at 5pm', or '30 mins'");
        setParsedDate(null);
        setParsedMinutes(null);
        onChangeMinutes("");
      }
    } catch (err) {
      setErrorNotice("Could not parse time format");
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setTextInput(val);
    evaluateNaturalLanguage(val);
  };

  const handleQuickChip = (phrase) => {
    setTextInput(phrase);
    evaluateNaturalLanguage(phrase);
  };

  const handleClear = () => {
    setTextInput("");
    setParsedDate(null);
    setParsedMinutes(null);
    setErrorNotice(null);
    onChangeMinutes("");
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-vault-muted uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Self-Destruct / Expiry (Chrono AI)</span>
        </label>
        {textInput && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-semibold text-vault-muted hover:text-red-500 transition-colors cursor-pointer"
          >
            Clear Expiry
          </button>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={textInput}
          onChange={handleChange}
          onBlur={() => evaluateNaturalLanguage(textInput)}
          placeholder="e.g. in 2 hours, tomorrow at 5pm, 45 mins"
          className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors placeholder:text-vault-muted/60"
        />
      </div>

      {parsedDate && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>
              Expires {parsedDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} at{" "}
              {parsedDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            {parsedMinutes >= 60 ? `${(parsedMinutes / 60).toFixed(1)} hrs` : `${parsedMinutes} mins`}
          </span>
        </div>
      )}

      {errorNotice && (
        <p className="text-[11px] text-amber-500 font-medium px-1">
          {errorNotice}
        </p>
      )}

      <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
        <span className="text-[10px] text-vault-muted font-bold uppercase tracking-wider mr-1">
          Presets:
        </span>
        {["15 mins", "1 hour", "24 hours", "7 days"].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleQuickChip(chip)}
            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold border border-vault-subtle bg-vault-primary/60 hover:bg-vault-primary text-vault-muted hover:text-vault-main transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NaturalExpiryInput;
