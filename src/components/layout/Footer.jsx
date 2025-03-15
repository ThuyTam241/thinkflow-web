import { Link } from "react-router";
import facebookIcon from "../../assets/icons/facebook-icon.svg";
import instagramIcon from "../../assets/icons/instagram-icon.svg";
import linkedinIcon from "../../assets/icons/linkedin-icon.svg";
import youtubeIcon from "../../assets/icons/youtube-icon.svg";
import logo from "../../assets/images/logo.svg";

const Footer = () => {
  const footerLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#about", label: "About" },
  ];

  const socialLinks = [
    { to: "#", icon: facebookIcon },
    { to: "#", icon: instagramIcon },
    { to: "#", icon: linkedinIcon },
    { to: "#", icon: youtubeIcon },
  ];

  const legalLinks = [
    { to: "#", label: "Privacy Policy" },
    { to: "#", label: "Terms of Use" },
  ];

  return (
    <footer className="px-3 pt-6 md:px-5 lg:px-10 lg:pt-10">
      <div>
        <div className="flex flex-col items-center justify-between md:flex-row">
          {/* logo */}
          <Link to="/">
            <img src={logo} alt="logo" className="h-8 md:h-9 lg:h-auto" />
          </Link>

          {/* footer links */}
          <div className="my-5 flex flex-col gap-3 text-center md:my-0 md:flex-row md:gap-5 lg:gap-8">
            {footerLinks.map((footerLink, index) => (
              <a
                key={index}
                href={footerLink.href}
                className="font-body text-ebony-clay hover:text-indigo text-sm font-medium transition-all duration-300 ease-in-out md:text-base"
              >
                {footerLink.label}
              </a>
            ))}
          </div>

          {/* social links */}
          <ul className="flex gap-2.5">
            {socialLinks.map((socialLink, index) => (
              <Link key={index} to={socialLink.to}>
                <img
                  src={socialLink.icon}
                  alt={socialLink.icon.split("/").pop().replace(".svg", "")}
                />
              </Link>
            ))}
          </ul>
        </div>
        <div className="border-gallery text-ebony-clay mt-6 flex flex-col items-center border-t py-5 text-xs md:flex-row md:justify-between md:text-sm">
          <p>© 2024 ThinkFlow. All rights reserved.</p>

          {/* legal links */}
          <ul className="flex gap-6">
            {legalLinks.map((legalLink, index) => (
              <Link key={index} to={legalLink.to} className="mt-3 md:mt-0">
                {legalLink.label}
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
