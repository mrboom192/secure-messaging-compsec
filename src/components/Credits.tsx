const Credits = () => {
  return (
    <div className="flex flex-col items-center gap-4 text-sm text-black mb-8">
      <a
        href="https://github.com/mrboom192/secure-messaging-compsec"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-4 px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-colors group"
      >
        <GitHubIcon className="text-black group-hover:text-white transition-colors" />
        View the GitHub Repo
      </a>
      <p className="text-center text-xs text-gray-700">
        By{" "}
        <a
          href="https://www.linkedin.com/in/cristiana-eagen-7a611b250/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          Cristiana Eagen
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/jason-nguyen-69aa0a284/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          Jason Nguyen
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/victoria-rowe-9a5623199/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          Victoria Rowe
        </a>
      </p>
    </div>
  );
};

export default Credits;

const GitHubIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 80"
    fill="currentColor"
    className={`w-6 h-6 ${className}`} // default size can be overridden
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M40 2.5C18.8208 2.5 1.66667 19.6542 1.66667 40.8333C1.66667 57.7958 12.6396 72.1229 27.8771 77.2021C29.7938 77.5375 30.5125 76.3875 30.5125 75.3812C30.5125 74.4708 30.4646 71.4521 30.4646 68.2417C20.8333 70.0146 18.3417 65.8937 17.575 63.7375C17.1438 62.6354 15.275 59.2333 13.6458 58.3229C12.3042 57.6042 10.3875 55.8312 13.5979 55.7833C16.6167 55.7354 18.7729 58.5625 19.4917 59.7125C22.9417 65.5104 28.4521 63.8812 30.6563 62.875C30.9917 60.3833 31.9979 58.7062 33.1 57.7479C24.5708 56.7896 15.6583 53.4833 15.6583 38.8208C15.6583 34.6521 17.1438 31.2021 19.5875 28.5187C19.2042 27.5604 17.8625 23.6312 19.9708 18.3604C19.9708 18.3604 23.1813 17.3542 30.5125 22.2896C33.5792 21.4271 36.8375 20.9958 40.0958 20.9958C43.3542 20.9958 46.6125 21.4271 49.6792 22.2896C57.0104 17.3062 60.2208 18.3604 60.2208 18.3604C62.3292 23.6312 60.9875 27.5604 60.6042 28.5187C63.0479 31.2021 64.5333 34.6042 64.5333 38.8208C64.5333 53.5312 55.5729 56.7896 47.0438 57.7479C48.4333 58.9458 49.6313 61.2458 49.6313 64.8396C49.6313 69.9667 49.5833 74.0875 49.5833 75.3812C49.5833 76.3875 50.3021 77.5854 52.2188 77.2021C67.3604 72.1229 78.3333 57.7479 78.3333 40.8333C78.3333 19.6542 61.1792 2.5 40 2.5Z"
    />
  </svg>
);
