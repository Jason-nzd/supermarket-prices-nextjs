import React from 'react';

function ResultsFilterPanel() {
  return (
    <div className='flex flex-wrap h-min p-0.5 border-2 border-slate-400 rounded-2xl gap-10 px-10'>
      <div className='flex flex-wrap items-center'>Countdown {toggleIcon}</div>
      <div className='flex flex-wrap items-center'>Pak n Save {toggleIcon}</div>
      <div className='flex flex-wrap items-center'>The Warehouse {toggleIcon}</div>
      <div className='flex flex-wrap items-center'>Order By </div>
      <div>Reset</div>
    </div>
  );
}

const toggleIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    fill='currentColor'
    viewBox='0 0 16 16'
    className='w-6 h-6 mx-1 pt-1'
  >
    <path d='M7 5H3a3 3 0 0 0 0 6h4a4.995 4.995 0 0 1-.584-1H3a2 2 0 1 1 0-4h3.416c.156-.357.352-.692.584-1z' />
    <path d='M16 8A5 5 0 1 1 6 8a5 5 0 0 1 10 0z' />
  </svg>
);

export default ResultsFilterPanel;
