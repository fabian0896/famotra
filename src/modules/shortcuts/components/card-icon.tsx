import * as React from 'react';

export function CardIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" {...props}>
      <g className="nc-icon-wrapper">
        <rect width="28" height="18" x="2" y="7" fill="#e6e6e6" rx="3" ry="3"></rect>
        <path
          d="M27 7H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V10a3 3 0 0 0-3-3m2 15c0 1.103-.897 2-2 2H5c-1.103 0-2-.897-2-2V10c0-1.103.897-2 2-2h22c1.103 0 2 .897 2 2z"
          opacity="0.15"
        ></path>
        <path
          fill="#fff"
          d="M27 8H5a2 2 0 0 0-2 2v1a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v-1a2 2 0 0 0-2-2"
          opacity="0.2"
        ></path>
        <rect width="6" height="5" x="5" y="11" fill="#edab40" rx="1.5" ry="1.5"></rect>
        <path
          d="M9 20H5.75a.75.75 0 0 1 0-1.5H9A.75.75 0 0 1 9 20M14.75 20H11.5a.75.75 0 0 1 0-1.5h3.25a.75.75 0 0 1 0 1.5M20.5 20h-3.25a.75.75 0 0 1 0-1.5h3.25a.75.75 0 0 1 0 1.5M26.25 20H23a.75.75 0 0 1 0-1.5h3.25a.75.75 0 0 1 0 1.5"
          opacity="0.15"
        ></path>
      </g>
    </svg>
  );
}
