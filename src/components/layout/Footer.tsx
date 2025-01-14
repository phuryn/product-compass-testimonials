export const Footer = () => {
  return (
    <footer className="bg-[#f0f0f0] py-12 mt-16 border-t border-solid border-t-[rgb(230,230,230)]">
      <div className="container">
        <div className="flex flex-col items-center space-y-6">
          <h3 className="text-lg font-semibold text-[#666666]">Stay Connected</h3>
          <ul className="flex flex-wrap justify-center gap-6">
            <li>
              <a 
                href="https://www.productcompass.pm/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#868787] hover:underline"
              >
                The Product Compass Newsletter
              </a>
            </li>
            <li>
              <a 
                href="https://www.linkedin.com/in/pawel-huryn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#868787] hover:underline"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a 
                href="https://twitter.com/PawelHuryn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#868787] hover:underline"
              >
                X
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};