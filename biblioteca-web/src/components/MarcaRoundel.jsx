export default function MarcaRoundel({ size = 34, invertido = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="19"
        fill="#001e50"
        stroke={invertido ? 'rgba(255, 255, 255, 0.35)' : 'none'}
        strokeWidth={invertido ? '1' : '0'}
      />
      <circle cx="20" cy="20" r="16.5" stroke="#ffd100" strokeWidth="1.5" />
      <path
        d="M12.5 14.25C15 13.4 17.6 13.6 20 15.1C22.4 13.6 25 13.4 27.5 14.25V26.25C25 25.4 22.4 25.6 20 27.1C17.6 25.6 15 25.4 12.5 26.25V14.25Z"
        stroke="#ffffff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 15.1V27.1"
        stroke="#ffffff"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
