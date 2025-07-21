import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="brand-section">
          <h2>RE-JOB</h2>
          <p>დააკავშირეთ, ითანამშრომლეთ და შექმენით პროექტები საუკეთესო ფრილანსერებთან მთელი მსოფლიოდან.</p>
        </div>

        <div className="footer-links">
          <h3>სწრაფი ბმულები</h3>
          <ul>
            <li><a href="#">ჩვენს შესახებ</a></li>
            <li><a href="#">კონტაქტი</a></li>
            <li><a href="#">მომსახურების პირობები</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>კლიენტებისთვის</h3>
          <ul>
            <li><a href="#">პროექტის განთავსება</a></li>
            <li><a href="#">როგორ დავიქირავოთ</a></li>
            <li><a href="#">ფასები</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>ფრილანსერებისთვის</h3>
          <ul>
            <li><a href="#">სამუშაოს მოძებნა</a></li>
            <li><a href="#">პორტფოლიო</a></li>
            <li><a href="#">საზოგადოება</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © 2024 FreelanceHub. ყველა უფლება დაცულია.
      </div>
    </footer>
  );
};

export default Footer;