export const VolumeChartSVG = props => {
  return (
    <svg
      className={props.className}
      width="52"
      height="52"
      style={{ minWidth: "52px" }}
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="15" className="stroke-primary-bg stroke-width-28" />
      <path
        d="M31.5 31.5V17.625"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white-primary"
      />
      <path
        d="M43.5106 24.5625L19.4895 38.4375"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white-primary"
      />
      <path
        d="M17.8563 34.0438C17.6985 33.2051 17.6211 32.3533 17.625 31.5C17.6232 28.6305 18.512 25.8311 20.1689 23.4882C21.8257 21.1453 24.1689 19.3744 26.875 18.4199V28.8262L17.8563 34.0438Z"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white-primary"
      />
      <path
        d="M31.5 17.625C33.9313 17.6253 36.3198 18.2644 38.4263 19.4783C40.5328 20.6922 42.2833 22.4384 43.5026 24.5418C44.7218 26.6452 45.367 29.0321 45.3734 31.4634C45.3798 33.8946 44.7473 36.2848 43.5392 38.3947C42.331 40.5045 40.5897 42.2599 38.4897 43.4849C36.3896 44.71 34.0045 45.3617 31.5733 45.3748C29.1421 45.3879 26.7501 44.762 24.637 43.5597C22.5238 42.3574 20.7637 40.6209 19.5328 38.5242"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white-primary"
      />
    </svg>
  );
};
