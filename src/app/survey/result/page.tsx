'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface CategoryResult {
  mean: number;
  label: string;
  description: string;
}

interface BaiResult {
  sum: number;
  label: string;
  description: string;
}

interface ResultData {
  categoryResults: Record<string, CategoryResult>;
  globalResult: CategoryResult;
  baiResult: BaiResult;
}

type CategoryColors = {
  [key: string]: string;
};

// Export Radar chart component - Updated for deployment
const RadarChartComponent = (props: any) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart 
        data={props.data}
        cx="50%" 
        cy="50%" 
        outerRadius="80%"
      >
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis 
          dataKey="category" 
          tick={{ fill: '#71717a', fontSize: 13 }}
          tickLine={false}
        />
        <PolarRadiusAxis 
          domain={[0, 5]} 
          tickCount={6} 
          axisLine={true} 
          tick={{ fontSize: 13 }}
        />
        {Object.entries(props.categoryResults)
          .filter(([cat]) => cat !== 'BAI 불안척도')
          .map(([category]) => (
            <Radar 
              key={category}
              name={category} 
              dataKey="value" 
              stroke={props.getTailwindColor(props.categoryColors[category] || 'bg-indigo-500')}
              fill={props.getTailwindColor(props.categoryColors[category] || 'bg-indigo-500')}
              fillOpacity={0.5}
              isAnimationActive={true}
              dot
            />
          ))}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default function SurveyResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('surveyResult');
      if (stored) {
        setResult(JSON.parse(stored));
      } else {
        router.push('/survey');
      }
    }
  }, [router]);

  if (!result) {
    return <div className="p-4 text-center">결과를 불러오는 중...</div>;
  }

  const { globalResult, categoryResults, baiResult } = result;

  // Define category colors
  const categoryColors: CategoryColors = {
    '부모역할 효능감으로 불안': 'bg-rose-400',
    '완벽주의로 인한 불안': 'bg-sky-700',
    '사회적지지에 대한 불안': 'bg-green-600',
    '자녀에 대한 염려': 'bg-cyan-600',
    '자녀와의 애착에 대한 염려': 'bg-red-500',
  };

  // Convert Tailwind classes to hex colors for the chart
  const getTailwindColor = (className: string): string => {
    switch(className) {
      case 'bg-rose-400': return '#fb7185';
      case 'bg-sky-700': return '#0369a1';
      case 'bg-green-600': return '#16a34a';
      case 'bg-cyan-600': return '#0891b2';
      case 'bg-red-500': return '#ef4444';
      default: return '#6366F1';
    }
  };

  // Get anxiety level color and background
  const getStatusColor = (label: string) => {
    if (label.includes('좋음') || label.includes('정상')) {
      return {
        bg: 'bg-emerald-200',
        text: 'text-green-600',
        badge: 'bg-green-100 text-green-600'
      };
    } else if (label.includes('가벼운') || label.includes('경미한')) {
      return {
        bg: 'bg-yellow-200',
        text: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-600'
      };
    } else if (label.includes('중간')) {
      return {
        bg: 'bg-orange-200',
        text: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-600'
      };
    } else {
      return {
        bg: 'bg-rose-200',
        text: 'text-red-600',
        badge: 'bg-rose-100 text-red-500'
      };
    }
  };

  const globalStatusColors = getStatusColor(globalResult.label);
  const baiStatusColors = getStatusColor(baiResult.label);

  return (
    <div className="w-full max-w-md mx-auto bg-white flex flex-col min-h-screen">
      {/* Title container */}
      <div className="w-full px-5 pt-8 pb-5 flex flex-col justify-start items-start gap-3">
        <div className="self-stretch justify-start text-black text-xl md:text-2xl font-bold font-['Pretendard_Variable'] leading-loose">나의 양육불안지수 보고서</div>
      </div>

      {/* Alert box */}
      <div className="w-full px-5 pb-3 flex flex-col justify-start items-start gap-6">
        <div className="self-stretch px-4 py-3 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col justify-start items-start gap-2">
          <div className="inline-flex justify-start items-center gap-1">
            <div className="size-4 relative">
              <div className="size-3.5 left-[1.33px] top-[1.33px] absolute bg-amber-500" />
            </div>
            <div className="justify-center text-amber-500 text-sm font-semibold font-['Pretendard_Variable'] leading-3" style={{ fontSize: '13px' }}>안내</div>
          </div>
          <div className="self-stretch justify-center text-zinc-600 text-sm font-normal font-['Pretendard_Variable'] leading-tight" style={{ fontSize: '13px' }}>이 결과는 검사 당시의 상태를 기반으로 합니다. 점수는 참고용이며 정확한 판단은 전문가와 상담하세요.</div>
        </div>
      </div>

      <div className="h-px w-full bg-white" />

      {/* Overall result section */}
      <div className="size-full px-5 py-10 bg-white flex flex-col justify-start items-start gap-5">
        <div className="self-stretch h-9 inline-flex justify-start items-start">
          <div className="w-80 justify-start text-neutral-800 text-xl font-bold font-['Pretendard_Variable'] leading-loose">나의 양육불안 총평</div>
        </div>
        
        <div className="w-72 flex flex-col justify-start items-start gap-2.5">
          <div className="px-2 py-1 bg-rose-100 rounded-[100px] inline-flex justify-center items-center gap-1">
            <div className="size-3.5 relative overflow-hidden">
              <div className="size-2.5 left-[1.75px] top-[1.71px] absolute bg-red-500" />
            </div>
            <div className="text-center justify-start text-red-500 text-base font-bold font-['Pretendard_Variable'] leading-none">
              총점 : {globalResult.mean.toFixed(1)}점 / {globalResult.label}
            </div>
          </div>
        </div>
        
        <div className="w-full flex flex-col justify-center items-center gap-2.5">
          <div className="self-stretch h-auto px-5 py-3 relative flex flex-col justify-start items-start gap-2.5">
            <div className="w-full pl-7 pr-2.5 bg-neutral-50 rounded-2xl inline-flex justify-start items-center py-3">
              <div className="w-full relative overflow-hidden">
                <div className="w-full inline-flex flex-col justify-center items-start">
                  <div className="w-full flex flex-col justify-center items-start gap-4">
                    <div className="w-full justify-start text-zinc-600 text-base font-bold font-['Pretendard_Variable'] leading-tight">
                      회원님의 양육불안지수는 {globalResult.label} 수준이에요
                    </div>
                  </div>
                  <div className="w-full flex flex-col justify-center items-start gap-4">
                    <div className="w-full justify-start text-zinc-600 text-base font-normal font-['Pretendard_Variable'] leading-tight">
                      {globalResult.description}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-10 h-9 relative overflow-hidden flex-shrink-0 ml-2">
                <div className={`size-7 left-[4.88px] top-[2.92px] absolute ${globalStatusColors.bg} rounded-full`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Radar chart section */}
      <div className="w-full px-5 py-8 bg-neutral-50 rounded-2xl flex flex-col justify-start items-start gap-5 overflow-hidden">
        <div className="justify-start text-neutral-800 text-base font-bold font-['Pretendard_Variable'] leading-normal">자세히 살펴보기</div>
        
        <div className="w-full py-4 rounded-3xl flex flex-col justify-center items-center">
          {/* Radar chart wrapper */}
          <div className="w-full h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                data={Object.entries(categoryResults)
                  .filter(([cat]) => cat !== 'BAI 불안척도')
                  .map(([cat, { mean }]) => ({ 
                    category: cat, 
                    value: mean 
                  }))}
                cx="50%" 
                cy="50%" 
                outerRadius="80%"
              >
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#71717a', fontSize: 13 }}
                  tickLine={false}
                />
                <PolarRadiusAxis 
                  domain={[0, 5]} 
                  tickCount={6} 
                  axisLine={true} 
                  tick={{ fontSize: 13 }}
                />
                {Object.entries(categoryResults)
                  .filter(([cat]) => cat !== 'BAI 불안척도')
                  .map(([category]) => (
                    <Radar 
                      key={category}
                      name={category} 
                      dataKey="value" 
                      stroke={getTailwindColor(categoryColors[category] || 'bg-indigo-500')}
                      fill={getTailwindColor(categoryColors[category] || 'bg-indigo-500')}
                      fillOpacity={0.5}
                      isAnimationActive={true}
                      dot
                    />
                  ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Individual category results */}
      {Object.entries(categoryResults)
        .filter(([cat]) => cat !== 'BAI 불안척도')
        .map(([category, { mean, label, description }]) => (
          <div key={category} className="size-full px-5 py-10 bg-white flex flex-col justify-start items-start gap-5">
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              <div className="self-stretch px-2 py-1 bg-rose-100 rounded-[100px] inline-flex justify-center items-center gap-1">
                <div className="size-3.5 relative overflow-hidden">
                  <div className="size-2.5 left-[1.75px] top-[1.71px] absolute bg-red-500" />
                </div>
                <div className="text-center justify-start text-red-500 text-base font-bold font-['Pretendard_Variable'] leading-none">
                  {category}
                </div>
              </div>
            </div>
            
            <div className="w-full flex flex-col justify-center items-center gap-2.5">
              <div className="self-stretch h-auto px-5 py-3 relative flex flex-col justify-start items-start gap-2.5">
                <div className="w-full pl-7 pr-2.5 bg-neutral-50 rounded-2xl inline-flex justify-start items-center py-3">
                  <div className="w-full relative overflow-hidden">
                    <div className="w-full inline-flex flex-col justify-center items-start">
                      <div className="w-full flex flex-col justify-center items-start gap-2">
                        <div className="w-full justify-start text-zinc-600 text-base font-bold font-['Pretendard_Variable'] leading-tight">
                          회원님의 불안지수는 {label} 수준이에요
                        </div>
                        <div className="w-full justify-start text-zinc-600 text-base font-normal font-['Pretendard_Variable'] leading-tight">
                          평균점수 : {mean.toFixed(1)} 점
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-9 relative overflow-hidden flex-shrink-0 ml-2">
                    <div className={`size-7 left-[4.88px] top-[2.92px] absolute ${getStatusColor(label).bg} rounded-full`} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-72 justify-start text-zinc-600 text-base font-normal font-['Pretendard_Variable'] leading-tight">
              {description}
            </div>
          </div>
        ))}

      {/* BAI result section */}
      <div className="size-full px-5 py-10 bg-white flex flex-col justify-start items-start gap-5">
        <div className="self-stretch h-9 inline-flex justify-start items-start">
          <div className="w-80 justify-start text-neutral-800 text-xl font-bold font-['Pretendard_Variable'] leading-loose">
            나의 BAI 불안척도 결과
          </div>
        </div>
        
        <div className="w-72 flex flex-col justify-start items-start gap-2.5">
          <div className="px-2 py-1 bg-rose-100 rounded-[100px] inline-flex justify-center items-center gap-1">
            <div className="size-3.5 relative overflow-hidden">
              <div className="size-2.5 left-[1.75px] top-[1.71px] absolute bg-red-500" />
            </div>
            <div className="text-center justify-start text-red-500 text-base font-bold font-['Pretendard_Variable'] leading-none">
              총점 : {baiResult.sum}점 / {baiResult.label}
            </div>
          </div>
        </div>
        
        <div className="w-full flex flex-col justify-center items-center gap-2.5">
          <div className="self-stretch h-auto px-5 py-3 relative flex flex-col justify-start items-start gap-2.5">
            <div className="w-full pl-7 pr-2.5 bg-neutral-50 rounded-2xl inline-flex justify-start items-center py-3">
              <div className="w-full relative overflow-hidden">
                <div className="w-full inline-flex flex-col justify-center items-start">
                  <div className="w-full flex flex-col justify-center items-start gap-4">
                    <div className="w-full justify-start text-zinc-600 text-base font-bold font-['Pretendard_Variable'] leading-tight">
                      회원님의 불안지수는 {baiResult.label} 수준이에요
                    </div>
                  </div>
                  <div className="w-full flex flex-col justify-center items-start gap-4">
                    <div className="w-full justify-start text-zinc-600 text-base font-normal font-['Pretendard_Variable'] leading-tight">
                      {baiResult.description}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-10 h-9 relative overflow-hidden flex-shrink-0 ml-2">
                <div className={`size-7 left-[4.88px] top-[2.92px] absolute ${baiStatusColors.bg} rounded-full`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full bg-white flex flex-col justify-start items-center mt-auto">
        <div className="self-stretch h-px bg-zinc-100" />
        <div className="self-stretch px-5 py-4 inline-flex justify-between items-start gap-1">
          <button
            onClick={() => {
              localStorage.removeItem('surveyResult');
              router.push('/survey');
            }}
            className="flex-1 px-4 py-4 bg-neutral-100 rounded-2xl flex justify-center items-center gap-2"
          >
            <div className="text-center justify-center text-zinc-600 text-base font-semibold font-['Pretendard_Variable'] leading-none">
              다시하기
            </div>
          </button>
          <button
            onClick={() => window.open('https://www.thenile.kr/pacer', '_blank')}
            className="flex-1 px-4 py-4 bg-sky-500 rounded-2xl flex justify-center items-center gap-2"
          >
            <div className="text-center justify-center text-white text-base font-semibold font-['Pretendard_Variable'] leading-none">
              후원하기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 