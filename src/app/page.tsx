'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const originalAminoAcids = [
  { name: "글라이신", image: "/amino/glycine.png", polarity: "비극성", group: "지방족 R기" },
  { name: "알라닌", image: "/amino/alanine.png", polarity: "비극성", group: "지방족 R기" },
  { name: "프롤린", image: "/amino/proline.png", polarity: "비극성", group: "지방족 R기" },
  { name: "발린", image: "/amino/valine.png", polarity: "비극성", group: "지방족 R기" },
  { name: "아이소류신", image: "/amino/isoleucine.png", polarity: "비극성", group: "지방족 R기" },
  { name: "류신", image: "/amino/leucine.png", polarity: "비극성", group: "지방족 R기" },
  { name: "메티오닌", image: "/amino/methionine.png", polarity: "비극성", group: "지방족 R기" },
  { name: "세린", image: "/amino/serine.png", polarity: "극성", group: "비전하 R기" },
  { name: "트레오닌", image: "/amino/threonine.png", polarity: "극성", group: "비전하 R기" },
  { name: "시스테인", image: "/amino/cysteine.png", polarity: "극성", group: "비전하 R기" },
  { name: "아스파라진", image: "/amino/asparagine.png", polarity: "극성", group: "비전하 R기" },
  { name: "글루타민", image: "/amino/glutamine.png", polarity: "극성", group: "비전하 R기" },
  { name: "페닐알라닌", image: "/amino/phenylalanine.png", polarity: null, group: "방향족 R기" },
  { name: "타이로신", image: "/amino/tyrosine.png", polarity: null, group: "방향족 R기" },
  { name: "트립토판", image: "/amino/tryptophan.png", polarity: null, group: "방향족 R기" },
  { name: "라이신", image: "/amino/lysine.png", polarity: null, group: "양전하 R기" },
  { name: "아르기닌", image: "/amino/arginine.png", polarity: null, group: "양전하 R기" },
  { name: "히스티딘", image: "/amino/histidine.png", polarity: null, group: "양전하 R기" },
  { name: "아스파트산", image: "/amino/aspartate.png", polarity: null, group: "음전하 R기" },
  { name: "글루탐산", image: "/amino/glutamate.png", polarity: null, group: "음전하 R기" },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function AminoAcidQuiz() {
  const [shuffledAminoAcids, setShuffledAminoAcids] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [records, setRecords] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimeMode, setIsTimeMode] = useState(false);
  const [showPropertyQuiz, setShowPropertyQuiz] = useState(false);
  const [propertyAnswer, setPropertyAnswer] = useState({ polarity: "", group: "" });
  const [propertyPartialCorrect, setPropertyPartialCorrect] = useState(false);
  const [propertyQuizEnabled, setPropertyQuizEnabled] = useState(false);

  useEffect(() => {
    setShuffledAminoAcids(shuffle(originalAminoAcids));
  }, []);

  useEffect(() => {
    if (isTimeMode && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && isTimeMode) {
      handleNext(false);
    }
  }, [timeLeft, isTimeMode]);

  const current = shuffledAminoAcids[index];

  const handleNext = (isCorrect) => {
    if (isCorrect && propertyQuizEnabled) {
      setShowPropertyQuiz(true);
    } else {
      finishStep(isCorrect);
    }
  };

  const finishStep = (isCorrect, propertyCorrect = true) => {
    if (isCorrect && propertyCorrect) setScore(score + 1);

    const partialCorrect = isCorrect && !propertyCorrect;

    setRecords(prev => [...prev, {
      name: current.name,
      correct: isCorrect && propertyCorrect,
      partial: partialCorrect,
      time: isTimeMode ? 10 - timeLeft : null
    }]);

    if (partialCorrect) {
      setResult(`성질 일부 오답! 정답: ${current.polarity ?? "-"}, ${current.group}`);
    } else {
      setResult(isCorrect && propertyCorrect ? "정답입니다!" : `틀렸어요! 정답: ${current.name}`);
    }

    setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= 20) {
        alert("퀴즈 종료! 기록은 아래에 저장되었습니다.");
        setIndex(0);
        setScore(0);
        setShuffledAminoAcids(shuffle(originalAminoAcids));
      } else {
        setIndex(nextIndex);
      }
      setAnswer("");
      setResult("");
      setShowPropertyQuiz(false);
      setPropertyAnswer({ polarity: "", group: "" });
      setPropertyPartialCorrect(false);
      setShowHint(false);
      if (isTimeMode) setTimeLeft(10);
    }, 1500);
  };

  const checkAnswer = () => {
    if (!current) return;
    handleNext(answer.trim() === current.name);
  };

  const checkPropertyAnswer = () => {
    const needPolarity = current.group === "지방족 R기" || current.group === "비전하 R기";
    const correctPolarity = !needPolarity || propertyAnswer.polarity === current.polarity;
    const correctGroup = propertyAnswer.group === current.group;
    const correct = correctPolarity && correctGroup;

    finishStep(true, correct);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">아미노산 이름 맞추기 퀴즈</h1>

      <div className="mb-2">
        <label className="mr-2 font-medium">시간 제한 모드</label>
        <input
          type="checkbox"
          checked={isTimeMode}
          onChange={() => {
            setIsTimeMode(!isTimeMode);
            setTimeLeft(10);
          }}
        />
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">성질 맞추기 모드</label>
        <input
          type="checkbox"
          checked={propertyQuizEnabled}
          onChange={() => setPropertyQuizEnabled(!propertyQuizEnabled)}
        />
      </div>

      {isTimeMode && (
        <div className="w-full bg-gray-200 h-3 rounded mb-2">
          <div
            className="bg-red-500 h-3 rounded"
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          ></div>
        </div>
      )}

      {current && (
        <Card>
          <CardContent className="p-4">
            <img
              src={current.image}
              alt="Amino Acid"
              className="w-48 h-48 object-contain mx-auto mb-4"
            />
            {!showPropertyQuiz ? (
              <>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="아미노산 이름 입력"
                  className="border px-2 py-1 w-full mb-2"
                />
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={checkAnswer}
                    className="font-bold px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
                  >
                    제출
                  </Button>
                  <Button onClick={() => setShowHint(!showHint)} variant="outline">
                    힌트
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-4">
                  <p className="font-semibold">이 아미노산의 성질은?</p>
                  {(current.group === "지방족 R기" || current.group === "비전하 R기") && (
                    <select
                      className="border px-2 py-1 my-2 w-full"
                      value={propertyAnswer.polarity}
                      onChange={(e) =>
                        setPropertyAnswer({ ...propertyAnswer, polarity: e.target.value })
                      }
                    >
                      <option value="">극성/비극성 선택</option>
                      <option value="극성">극성</option>
                      <option value="비극성">비극성</option>
                    </select>
                  )}
                  <select
                    className="border px-2 py-1 w-full"
                    value={propertyAnswer.group}
                    onChange={(e) =>
                      setPropertyAnswer({ ...propertyAnswer, group: e.target.value })
                    }
                  >
                    <option value="">R기 종류 선택</option>
                    <option value="지방족 R기">지방족 R기</option>
                    <option value="방향족 R기">방향족 R기</option>
                    <option value="비전하 R기">비전하 R기</option>
                    <option value="양전하 R기">양전하 R기</option>
                    <option value="음전하 R기">음전하 R기</option>
                  </select>
                  <Button className="mt-2" onClick={checkPropertyAnswer}>
                    속성 제출
                  </Button>
                </div>
              </>
            )}
            {showHint && (
              <div className="mt-2 text-sm text-gray-500">
                힌트: {current.name[0]}___
              </div>
            )}
            <div className="mt-2 text-lg">{result}</div>
            <div className="mt-2">점수: {score} / {shuffledAminoAcids.length}</div>
          </CardContent>
        </Card>
      )}

      {records.length > 0 && (
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold mb-2">기록</h2>
          <ul className="text-sm">
            {records.map((rec, idx) => (
              <li key={idx} className="mb-1">
                {idx + 1}. {rec.name} - {rec.correct ? "✅ 정답" : rec.partial ? "➖ 성질X" : "❌ 오답"}
                {rec.time !== null && ` (${rec.time}s)`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
