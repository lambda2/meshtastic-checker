import React from "react";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <footer
        className={`flex flex- justify-center p-2 ${className}`}
        style={{
          backgroundColor: "var(--backgroundPrimary)",
          color: "var(--textPrimary)",
        }}
      >
        <p>
          Meshtastic Configurator | forked from{" "}
          <a
            href="https://client.meshtastic.org/"
            className="hover:underline"
            target="_blank"
            style={{ color: "var(--link)" }}
            rel="noreferrer"
          >
            Meshtastic web client
          </a>
        </p>
      </footer>
    );
  },
);

export default Footer;
