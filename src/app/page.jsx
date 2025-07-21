'use client'
import Header from './components/Header/Header'
import styles from './page.module.css'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from './components/Footer/Footer'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [professionalSearchTerm, setProfessionalSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://5.83.153.81:25608/professional_network')
      .then(response => response.json())
      .then(data => {
        setProfessionals(data);
        setFilteredProfessionals(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  // ძიება პროფესიონალების სიაში
  useEffect(() => {
    if (professionalSearchTerm === '') {
      setFilteredProfessionals(professionals);
    } else {
      const filtered = professionals.filter(person => 
        person.name.toLowerCase().includes(professionalSearchTerm.toLowerCase()) ||
        (person.role && person.role.toLowerCase().includes(professionalSearchTerm.toLowerCase())) ||
        (person.job && person.job.toLowerCase().includes(professionalSearchTerm.toLowerCase()))
      );
      setFilteredProfessionals(filtered);
    }
  }, [professionalSearchTerm, professionals]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/pages/Hire?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleProfessionalSearch = (e) => {
    setProfessionalSearchTerm(e.target.value);
  };

  const clearProfessionalSearch = () => {
    setProfessionalSearchTerm('');
  };

  return (
    <>
      <Header />
      <section className={styles.hero}>
        <div className={styles.hero_div}>
          <div className={styles.hero_text}>
            <h1>შენი უნარები</h1>
            <h2>შენი წარმატებაა </h2>
            <p>დაუკავშირდით საუკეთესო კლიენტებს და აჩვენეთ თქვენი პროფესიული გამოცდილება</p>
            <form className={styles.input_div} onSubmit={handleSearch}>
              <i className="bi bi-search"></i>
              <input 
                name='search' 
                placeholder='სამუშაო' 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className={styles.linee}></div>
              <button type="submit">ძებნა</button>
            </form>
          </div>
        </div>
        <img src="/hero.svg" alt="hero" />
      </section>
      <div className={styles.popular_jobs}>
        <div className={styles.popular_header}>
          <h1>პოპულარული</h1>
          <a href="/pages/Hire">ნახე ყველა <i className="bi bi-arrow-right"></i></a>
        </div>
        <div className={styles.popular_cards_div}>
          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
              <i className="bi bi-brush"></i>
            </div>
            <div className={styles.popular_text}>
              <p>გრაფიკული დიზაინი</p>
              <span>1 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i className="bi bi-code-slash"></i>
            </div>
            <div className={styles.popular_text}>
              <p>დეველოპერი</p>
              <span>12 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i className="bi bi-megaphone"></i>
            </div>
            <div className={styles.popular_text}>
              <p>ციფრული მარკეტინგი</p>
              <span>10 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i className="bi bi-camera-reels"></i>
            </div>
            <div className={styles.popular_text}>
              <p>ვიდეომონტაჟი</p>
              <span>10 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i className="bi bi-music-note-beamed"></i>
            </div>
            <div className={styles.popular_text}>
              <p>მუსიკა</p>
              <span>100 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i className="bi bi-bar-chart-line"></i>
            </div>
            <div className={styles.popular_text}>
              <p>ფინანსები</p>
              <span>21 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i className="bi bi-heart-pulse"></i>
            </div>
            <div className={styles.popular_text}>
              <p>ჯანმრთელობა</p>
              <span>8 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i className="bi bi-database"></i>
            </div>
            <div className={styles.popular_text}>
              <p>მონაცემთა ანალიზი</p>
              <span>15 სამუშაო</span>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.pro_web}>
        <div className={styles.pro_text}>
          <h1>პროფესიული ქსელი</h1>
          <h2>დაამყარეთ კავშირები და განავითარეთ თქვენი პროფესიული პორტფოლიო.</h2>
          
          {/* ძებნის ფილდი პროფესიონალებისთვის */}
          <div className={styles.professional_search}>
            <div className={styles.search_input_container}>
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="მოძებნეთ მომხმარებელი სახელით, როლით ან სამუშაოთ..."
                value={professionalSearchTerm}
                onChange={handleProfessionalSearch}
                className={styles.professional_search_input}
              />
              {professionalSearchTerm && (
                <button 
                  type="button" 
                  onClick={clearProfessionalSearch}
                  className={styles.clear_search_btn}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
            {professionalSearchTerm && (
              <div className={styles.search_results_info}>
                ნაპოვნია {filteredProfessionals.length} შედეგი "{professionalSearchTerm}"-სთვის
              </div>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p>იტვირთება პროფესიონალები...</p>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          professionalSearchTerm ? (
            <div className={styles.no_results}>
              <i className="bi bi-search"></i>
              <p>ძებნისას არ მოიძებნა შედეგი "{professionalSearchTerm}"-სთვის</p>
              <button onClick={clearProfessionalSearch} className={styles.clear_search_btn_large}>
                ძებნის გასუფთავება
              </button>
            </div>
          ) : (
            <div className={styles.empty_state}>
              <i className="bi bi-people"></i>
              <p>ჯერ არ არის ხელმისაწვდომი პროფესიონალები</p>
              <Link href="/pages/SignUp" className={styles.join_btn}>
                შემოგვიერთდით
              </Link>
            </div>
          )
        ) : (
          <div className={styles.pro_list}>
            {filteredProfessionals.map((person, index) => (
              <div key={person.id || index} className={styles.pro_list_row}>
                <i className="bi bi-person-circle"></i>
                <div>
                  <h3>
                    <Link href={`/pages/profile/${person.name}`} className={styles.name_link}>
                      {person.name}
                    </Link>
                  </h3>
                  <p>როლი: {person.role ? person.role.toUpperCase() : 'არ არის მითითებული'}</p>
                  <p>სამუშაო: {person.job || 'არ არის მითითებული'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}