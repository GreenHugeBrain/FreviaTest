'use client';
import { useState } from 'react';
import styles from './Modal.module.css';

export default function Modal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    min_budget: '',
    max_budget: '',
    keywords: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      min_budget: '',
      max_budget: '',
      keywords: ''
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>ახალი სამუშაოს დამატება</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="title">სათაური</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="შეიყვანეთ სამუშაოს სათაური"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">აღწერა</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="დეტალურად აღწერეთ სამუშაო"
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${styles.formCol}`}>
                <label htmlFor="min_budget">მინიმალური ბიუჯეტი</label>
                <input
                  type="number"
                  id="min_budget"
                  name="min_budget"
                  value={formData.min_budget}
                  onChange={handleChange}
                  required
                  placeholder="₾"
                />
              </div>
              
              <div className={`${styles.formGroup} ${styles.formCol}`}>
                <label htmlFor="max_budget">მაქსიმალური ბიუჯეტი</label>
                <input
                  type="number"
                  id="max_budget"
                  name="max_budget"
                  value={formData.max_budget}
                  onChange={handleChange}
                  required
                  placeholder="₾"
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="keywords">საკვანძო სიტყვები</label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                required
                placeholder="შეიყვანეთ საკვანძო სიტყვები, გამოყოფილი მძიმით"
              />
            </div>
          </div>
          
          <div className={styles.formFooter}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onClose}
            >
              გაუქმება
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
            >
              დამატება
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}