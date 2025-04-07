import { Link } from "react-router";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import logo from "../../assets/images/logo.svg";

const Footer = () => {
  const footerLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#about", label: "About" },
  ];

  const socialLinks = [
    { to: "#", icon: Facebook },
    { to: "#", icon: Instagram },
    { to: "#", icon: Linkedin },
    { to: "#", icon: Youtube },
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
            <img src={logo} alt="logo" className="h-8 md:h-9 lg:h-10" />
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
                <socialLink.icon className="text-ebony-clay w-5 h-5 stroke-[1.5]"/>
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
