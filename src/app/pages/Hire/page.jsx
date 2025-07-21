'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Modal from '../../components/Modal/Modal';
import styles from './Hire.module.css';
import SavedJobs from '../../components/SavedJobs/SavedJobs';

function JobApplicationForm({ jobId, onClose }) {
  const [formData, setFormData] = useState({
    cover_letter: '',
    resume_file: ''
  });
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.username) return;

        const response = await fetch(`https://5.83.153.81:25608/profile/${user.username}`);
        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
          // Set the resume file from user profile
          if (profileData.resume_file) {
            setFormData(prev => ({
              ...prev,
              resume_file: profileData.resume_file
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!formData.resume_file) {
      alert('თქვენ არ გაქვთ რეზიუმე ატვირთული. გთხოვთ ჯერ ატვირთოთ რეზიუმე თქვენს პროფილში.');
      return;
    }
    
    try {
      const response = await fetch(`https://5.83.153.81:25608/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('განცხადება წარმატებით გაიგზავნა!');
        onClose();
      } else {
        alert(data.message || 'დაფიქსირდა შეცდომა');
      }
    } catch (error) {
      alert('დაფიქსირდა შეცდომა');
    }
  };

  if (loading) {
    return (
      <div className={styles.applicationFormExpanded}>
        <div className={styles.applicationFormContent}>
          <div className={styles.loadingContainer}>
            <p>იტვირთება...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.applicationFormExpanded}>
      <div className={styles.applicationFormContent}>
        <div className={styles.applicationHeader}>
          <h3>განცხადების გაგზავნა</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>სამოტივაციო წერილი</label>
            <textarea
              value={formData.cover_letter}
              onChange={(e) => setFormData({...formData, cover_letter: e.target.value})}
              placeholder="დაწერეთ თქვენი მოტივაცია..."
              required
            />
          </div>
          
          <div className={styles.resumeInfo}>
            <div className={styles.resumeStatus}>
              {formData.resume_file ? (
                <div className={styles.resumeFound}>
                  <svg viewBox="0 0 24 24" fill="none" className={styles.resumeIcon}>
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p><strong>რეზიუმე მოიძებნა:</strong> {formData.resume_file}</p>
                    <p className={styles.autoSendNote}>
                      აპლიკაციის გაგზავნისას ავტომატურად თქვენი რეზიუმე იგზავნება
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.resumeNotFound}>
                  <svg viewBox="0 0 24 24" fill="none" className={styles.warningIcon}>
                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p><strong>რეზიუმე არ მოიძებნა</strong></p>
                    <p className={styles.uploadNote}>
                      გთხოვთ ჯერ ატვირთოთ რეზიუმე თქვენს პროფილში
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={!formData.resume_file}
            >
              გაგზავნა
            </button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>გაუქმება</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Create a separate component that uses useSearchParams
function HireContent() {
    const searchParams = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeApplicationId, setActiveApplicationId] = useState(null);
    const [savedJobs, setSavedJobs] = useState(new Set()); // Track saved jobs
    const [isSavedJobsOpen, setIsSavedJobsOpen] = useState(false); // Control SavedJobs component

    const fetchJobs = async () => {
        try {
            const response = await fetch('https://5.83.153.81:25608/api/jobs');
            const result = await response.json();
            if (response.ok) {
                console.log(result)
                setJobs(result.jobs);
                setFilteredJobs(result.jobs);
            } else {
                console.error('Failed to fetch jobs:', result.message);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check which jobs are saved by the current user
    const checkSavedJobs = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.token) return;

        const savedJobIds = new Set();
        
        // Check each job if it's saved
        for (const job of jobs) {
            try {
                const response = await fetch(`https://5.83.153.81:25608/check_saved/${job.id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.is_saved) {
                        savedJobIds.add(job.id);
                    }
                }
            } catch (error) {
                console.error('Error checking saved job:', error);
            }
        }
        
        setSavedJobs(savedJobIds);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (jobs.length > 0) {
            checkSavedJobs();
        }
    }, [jobs]);

    useEffect(() => {
        const urlSearchTerm = searchParams.get('search');
        if (urlSearchTerm) {
            setSearchTerm(urlSearchTerm);
            filterJobsBySearchTerm(urlSearchTerm);
        }
    }, [searchParams, jobs]);

    const filterJobsBySearchTerm = (term) => {
        if (!term.trim() || !jobs.length) return;
        
        const lowercasedSearchTerm = term.toLowerCase();
        const filtered = jobs.filter((job) =>
            job.keywords?.toLowerCase().includes(lowercasedSearchTerm) ||
            job.title?.toLowerCase().includes(lowercasedSearchTerm) ||
            job.description?.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredJobs(filtered);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleJobSubmit = async (jobData) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        if (!token) {
            alert('გთხოვთ გაიაროთ ავტორიზაცია.');
            return;
        }

        try {
            const response = await fetch('https://5.83.153.81:25608/jobs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(jobData),
            });

            const result = await response.json();
            if (response.ok) {
                alert('სამუშაო წარმატებით დაემატა!');
                handleCloseModal();
                fetchJobs();
            } else {
                alert(result.message || 'დაფიქსირდა შეცდომა');
            }
        } catch (error) {
            alert('დაფიქსირდა შეცდომა');
        }
    };

    const handleSearch = () => {
        filterJobsBySearchTerm(searchTerm);
    };

    const handleApplyClick = (jobId) => {
        setActiveApplicationId(activeApplicationId === jobId ? null : jobId);
    };

    // Handle save/unsave job
    const handleSaveJob = async (jobId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.token) {
            alert('გთხოვთ გაიაროთ ავტორიზაცია.');
            return;
        }

        const isSaved = savedJobs.has(jobId);
        
        try {
            if (isSaved) {
                // Find saved job ID and remove it
                // First get saved jobs to find the saved_job_id
                const savedJobsResponse = await fetch('https://5.83.153.81:25608/saved_jobs', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                
                if (savedJobsResponse.ok) {
                    const savedJobsData = await savedJobsResponse.json();
                    const savedJob = savedJobsData.saved_jobs.find(sj => sj.job_id === jobId);
                    
                    if (savedJob) {
                        const response = await fetch(`https://5.83.153.81:25608/saved_job/${savedJob.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${user.token}`,
                            },
                        });

                        if (response.ok) {
                            setSavedJobs(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(jobId);
                                return newSet;
                            });
                            alert('ვაკანსია წაიშალა შენახულებიდან');
                        } else {
                            const result = await response.json();
                            alert(result.message || 'შეცდომა');
                        }
                    }
                }
            } else {
                // Save job
                const response = await fetch(`https://5.83.153.81:25608/save_job/${jobId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                const result = await response.json();
                if (response.ok) {
                    setSavedJobs(prev => new Set([...prev, jobId]));
                    alert('ვაკანსია შეინახა!');
                } else {
                    alert(result.message || 'შეცდომა');
                }
            }
        } catch (error) {
            console.error('Error saving/unsaving job:', error);
            alert('დაფიქსირდა შეცდომა');
        }
    };

    const formatBudget = (min, max) => {
        return `₾${min?.toLocaleString()} - ₾${max?.toLocaleString()}`;
    };

    // Toggle SavedJobs component
    const toggleSavedJobs = () => {
        setIsSavedJobsOpen(!isSavedJobsOpen);
    };

    return (
        <main className={styles.container}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>იპოვეთ თქვენი სამუშაო</h1>
                    <p>ათასობით საინტერესო შესაძლებლობა გელით</p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className={styles.searchSection}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchBox}>
                        <div className={styles.searchInput}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none">
                                <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="ძიება (პოზიცია, საკვანძო სიტყვები)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button onClick={handleSearch} className={styles.searchBtn}>
                            ძებნა
                        </button>
                    </div>
                    <button onClick={handleOpenModal} className={styles.postJobBtn}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        ვაკანსიის განთავსება
                    </button>
                </div>
            </div>

            {/* Jobs List */}
            <div className={styles.jobsContainer}>
                <div className={styles.jobsHeader}>
                    <h2>რეკომენდირებული ვაკანსიები</h2>
                    <span className={styles.jobsCount}>
                        {filteredJobs.length} ვაკანსია
                    </span>
                </div>
                
                <div className={styles.jobsList}>
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.spinner}></div>
                            <p>იტვირთება...</p>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className={styles.emptyState}>
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <h3>ვაკანსია ვერ მოიძებნა</h3>
                            <p>სცადეთ სხვა საძიებო კრიტერიუმები</p>
                        </div>
                    ) : (
                        [...filteredJobs].reverse().map((job) => (
                            <div key={job.id} className={styles.jobCard}>
                                <div className={styles.jobHeader}>
                                    <div className={styles.jobTitle}>
                                        <h3>{job.title}</h3>
                                        {job.author && (
                                            <div className={styles.companyInfo}>
                                                <Link href={`/pages/profile/${job.author.name}`} className={styles.companyLink}>
                                                    {job.author.name}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.jobActions}>
                                        <button 
                                            className={`${styles.saveBtn} ${savedJobs.has(job.id) ? styles.saved : ''}`}
                                            onClick={() => handleSaveJob(job.id)}
                                            title={savedJobs.has(job.id) ? "შენახულიდან წაშლა" : "შენახვა"}
                                        >
                                            <svg viewBox="0 0 24 24" fill={savedJobs.has(job.id) ? "currentColor" : "none"}>
                                                <path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className={styles.jobContent}>
                                    <p className={styles.jobDescription}>{job.description}</p>
                                    
                                    <div className={styles.jobDetails}>
                                        <div className={styles.budgetInfo}>
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span>{formatBudget(job.min_budget, job.max_budget)}</span>
                                        </div>
                                    </div>
                                    
                                    {job.keywords && (
                                        <div className={styles.jobTags}>
                                            {job.keywords.split(',').map((keyword, index) => (
                                                <span key={index} className={styles.tag}>
                                                    {keyword.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <div className={styles.jobFooter}>
                                    <button
                                        className={`${styles.applyButton} ${activeApplicationId === job.id ? styles.active : ''}`}
                                        onClick={() => handleApplyClick(job.id)}
                                    >
                                        {activeApplicationId === job.id ? 'დახურვა' : 'განცხადების გაგზავნა'}
                                    </button>
                                </div>
                                
                                {activeApplicationId === job.id && (
                                    <JobApplicationForm 
                                        jobId={job.id}
                                        onClose={() => setActiveApplicationId(null)}
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Fixed SavedJobs Button */}
            <div className={styles.fixedSavedJobsContainer}>
                <button 
                    className={styles.savedJobsToggle}
                    onClick={toggleSavedJobs}
                    title="შენახული ვაკანსიები"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                
                {/* SavedJobs Component */}
                {isSavedJobsOpen && (
                    <div className={styles.savedJobsPanel}>
                        <SavedJobs onClose={() => setIsSavedJobsOpen(false)} />
                    </div>
                )}
            </div>
            
            <Modal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleJobSubmit}
            />
        </main>
    );
}

// Loading fallback component
function LoadingFallback() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>იტვირთება...</p>
        </div>
    );
}

// Main component with Suspense wrapper
export default function Hire() {
    return (
        <>
            <Header />
            <Suspense fallback={<LoadingFallback />}>
                <HireContent />
            </Suspense>
            <Footer />
        </>
    );
}
