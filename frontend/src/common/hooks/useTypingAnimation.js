import { useState, useEffect } from "react";

export const useTypingAnimation = (
  words = ["Dynamic Watermarks", "Self-Destructing Links", "Email Lead Capture", "Direct Mail Delivery"],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1800
) => {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];

    let timer;
    if (!isDeleting && displayText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentWord.substring(0, prev.length - 1)
            : currentWord.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return { displayText, isDeleting, currentWord: words[wordIndex % words.length] };
};
