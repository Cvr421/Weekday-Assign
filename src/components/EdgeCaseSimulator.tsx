import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SIMULATOR_SCENARIOS } from '../data/playbookData';
import confetti from 'canvas-confetti';

export const EdgeCaseSimulator: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = SIMULATOR_SCENARIOS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (scenario.options[idx].isCorrect) {
      setScore(prev => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < SIMULATOR_SCENARIOS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md border border-purple-700/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40">
                Intern Onboarding Trainer
              </span>
              <span className="text-xs text-purple-300">Zomato SOP Certification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              Interactive Edge-Case Simulator
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">
              Test Ram & Shyam's instincts against real-world candidate friction and edge cases.
            </p>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500">
              Scenario {currentIdx + 1} of {SIMULATOR_SCENARIOS.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Current Score:</span>
              <span className="font-bold text-purple-700">{score} Correct</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / SIMULATOR_SCENARIOS.length) * 100}%` }}
            />
          </div>

          {/* Scenario Details */}
          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                {scenario.id}
              </span>
              <span className="text-xs text-purple-900 font-semibold">
                {scenario.company} • Candidate: {scenario.candidateName}
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">{scenario.title}</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              "{scenario.situation}"
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              What does the Zomato Playbook mandate you do?
            </label>

            {scenario.options.map((opt, oIdx) => {
              const isSelected = selectedOption === oIdx;
              const hasAnswered = selectedOption !== null;

              let btnStyle = "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800";
              if (hasAnswered) {
                if (opt.isCorrect) {
                  btnStyle = "border-emerald-400 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500";
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = "border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-500";
                } else {
                  btnStyle = "border-slate-200 bg-slate-50 opacity-40 text-slate-500";
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <div className="flex-1">
                    <p>{opt.text}</p>

                    {/* Reveal Feedback */}
                    {hasAnswered && isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1 text-xs">
                        <div className="flex items-center gap-1 font-bold">
                          {opt.isCorrect ? (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                            </span>
                          ) : (
                            <span className="text-rose-700 flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Incorrect Choice
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700">{opt.feedback}</p>
                        <p className="text-indigo-700 font-semibold bg-white/80 p-2 rounded border border-indigo-100 mt-1">
                          📜 {opt.zomatoPrinciple}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {selectedOption !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
              >
                <span>{currentIdx + 1 === SIMULATOR_SCENARIOS.length ? 'Finish Certification' : 'Next Scenario'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Completion Screen */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900">Simulator Certification Complete!</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              You scored <strong className="text-purple-700">{score} out of {SIMULATOR_SCENARIOS.length}</strong> on edge-case protocol execution.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-xs text-slate-700 space-y-2 text-left">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Key Takeaways for Ram & Shyam:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Always offer <strong>Concierge Booking on Call</strong> to eliminate friction.</li>
              <li>Collect <strong>3 custom slots</strong> immediately when Calendly has 0 available slots.</li>
              <li>Never spam calls; stick to the <strong>T-0, T+4h, and T+12h time-boxed windows</strong>.</li>
            </ul>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Simulator</span>
          </button>
        </div>
      )}

    </div>
  );
};
