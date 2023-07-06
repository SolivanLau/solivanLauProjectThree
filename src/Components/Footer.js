const Footer = () => {
  const currentDate = new Date();

  return (
    <footer>
      <div className="wrapper">
        <p>
          Made by
          <a
            href="https://www.solivanlau.com"
            target="_blank"
            rel="noopener noreferrer"
            className="connectLink"
          >
            {' '}
            Solivan Lau{' '}
          </a>
          {currentDate.getFullYear()}
        </p>
      </div>
    </footer>
  );
};
export default Footer;
