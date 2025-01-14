export const Footer = () => {
  return (
    <footer className="bg-[#f0f0f0] py-12 mt-16 border-t border-solid border-t-[rgb(230,230,230)]">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#666666]">Stay Connected</h3>
            <ul className="space-y-2">
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
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#666666]">Our Courses</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.productcompass.pm/p/cpdm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#868787] hover:underline"
                >
                  Continuous Product Discovery Masterclass
                </a>
              </li>
              <li>
                <a 
                  href="https://www.productcompass.pm/p/product-vision-strategy-objectives-course" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#868787] hover:underline"
                >
                  From Strategy to Objectives Masterclass
                </a>
              </li>
              <li>
                <a 
                  href="https://www.productcompass.pm/p/product-innovation-masterclass" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#868787] hover:underline"
                >
                  Product Innovation Masterclass
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};