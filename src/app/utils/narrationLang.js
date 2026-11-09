// Which BCP-47 language code AudioPlayer/speechSynthesis should narrate a
// subject's lesson/quiz/weak-spot content in. Every AudioPlayer call that
// reads out real curriculum content (as opposed to a fixed English UI
// instruction, e.g. a mini-game's "Tap the matching pair!") was hard-coded
// to 'en-GB', including for Tamil subjects — so Tamil-script text was
// being read with an English voice, which either mispronounces it badly
// or produces no sound at all, since most English voices have no Tamil
// phoneme support whatsoever. Every other taught subject (English, Math,
// Science, Computer Science, Coding) is still in English, so this only
// needs the two branches.
export function getNarrationLang(subjectId) {
  return (subjectId || '').toLowerCase().startsWith('tamil') ? 'ta-IN' : 'en-GB';
}
