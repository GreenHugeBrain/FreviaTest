'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Payment.module.css';

export default function Payment() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);
    const [freelancers, setFreelancers] = useState([]);
    const [amount, setAmount] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [clientId, setClientId] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(userData);
        fetchPayPalClientId();
        fetchFreelancers();
    }, []);

    const fetchPayPalClientId = async () => {
        try {
            const response = await fetch('https://5.83.153.81:25608/api/paypal/client-id');
            const data = await response.json();
            setClientId(data.client_id);
        } catch (error) {
            console.error('Error fetching PayPal client ID:', error);
        }
    };

    const fetchFreelancers = async () => {
        try {
            const response = await fetch('https://5.83.153.81:25608/api/users', {
                headers: {
                          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
                }
            });
            const data = await response.json();
            setFreelancers(data.users || []);
        } catch (error) {
            console.error('Error fetching freelancers:', error);
        }
    };

    const handleCreateOrder = async () => {
        if (!selectedFreelancer || !amount || !projectDescription) {
            setError('გთხოვთ შეავსოთ ყველა ველი');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://5.83.153.81:25608/api/paypal/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency: 'USD',
                    freelancer_id: selectedFreelancer.id,
                    project_description: projectDescription
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                return data.order_id;
            } else {
                throw new Error(data.message || 'გადახდის შექმნა ვერ მოხერხდა');
            }
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`https://5.83.153.81:25608/api/paypal/capture-order/${data.orderID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const result = await response.json();
            
            if (response.ok) {
                alert('გადახდა წარმატებით განხორციელდა!');
                router.push('/dashboard');
            } else {
                throw new Error(result.message || 'გადახდის დასრულება ვერ მოხერხდა');
            }
        } catch (error) {
            setError(error.message);
            alert('შეცდომა: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentClick = () => {
        if (!selectedFreelancer || !amount || !projectDescription) {
            setError('გთხოვთ შეავსოთ ყველა ველი');
            return;
        }
        setError('');
        setShowPayment(true);
    };

    if (!user) {
        return <div>იტვირთება...</div>;
    }

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <div className={styles.paymentContainer}>
                    <h1 className={styles.title}>გადახდა</h1>
                    
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>აირჩიეთ ფრილანსერი</h2>
                        <div className={styles.freelancerGrid}>
                            {freelancers.map(freelancer => (
                                <div 
                                    key={freelancer.id}
                                    className={`${styles.freelancerCard} ${selectedFreelancer?.id === freelancer.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedFreelancer(freelancer)}
                                >
                                    <div className={styles.freelancerInfo}>
                                        <h3>{freelancer.name}</h3>
                                        <p>{freelancer.email}</p>
                                        <p className={styles.skills}>{freelancer.skills || 'უნარები მითითებული არ არის'}</p>
                                    </div>
                                    {selectedFreelancer?.id === freelancer.id && (
                                        <div className={styles.checkmark}>✓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>გადახდის დეტალები</h2>
                        
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>თანხა (USD)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="შეიყვანეთ თანხა"
                                className={styles.input}
                                min="1"
                                step="0.01"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>პროექტის აღწერა</label>
                            <textarea
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                placeholder="შეიყვანეთ პროექტის აღწერა"
                                className={styles.textarea}
                                rows="4"
                            />
                        </div>

                        {amount && (
                            <div className={styles.feeBreakdown}>
                                <div className={styles.feeItem}>
                                    <span>პროექტის ღირებულება:</span>
                                    <span>${parseFloat(amount).toFixed(2)}</span>
                                </div>
                                <div className={styles.feeItem}>
                                    <span>პლატფორმის მომსახურების გადასახადი (5%):</span>
                                    <span>${(parseFloat(amount) * 0.05).toFixed(2)}</span>
                                </div>
                                <div className={styles.feeItem}>
                                    <span>ფრილანსერი მიიღებს:</span>
                                    <span>${(parseFloat(amount) * 0.95).toFixed(2)}</span>
                                </div>
                                <div className={styles.totalFee}>
                                    <span>სულ გადასახდელი:</span>
                                    <span>${parseFloat(amount).toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {!showPayment ? (
                        <button 
                            onClick={handlePaymentClick}
                            className={styles.paymentButton}
                            disabled={loading || !selectedFreelancer || !amount || !projectDescription}
                        >
                            {loading ? 'იტვირთება...' : 'გადახდის განხორციელება'}
                        </button>
                    ) : (
                        <div className={styles.paypalSection}>
                            <h2 className={styles.sectionTitle}>PayPal გადახდა</h2>
                            {clientId && (
                                <PayPalScriptProvider 
                                    options={{ 
                                        "client-id": clientId,
                                        currency: "USD"
                                    }}
                                >
                                    <PayPalButtons
                                        createOrder={handleCreateOrder}
                                        onApprove={handleApprove}
                                        onError={(err) => {
                                            console.error('PayPal Error:', err);
                                            setError('PayPal შეცდომა: ' + err.message);
                                        }}
                                        style={{
                                            layout: 'vertical',
                                            color: 'blue',
                                            shape: 'rect',
                                            label: 'pay'
                                        }}
                                    />
                                </PayPalScriptProvider>
                            )}
                        </div>
                    )}

                    <div className={styles.backButton}>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className={styles.backBtn}
                        >
                            უკან დაბრუნება
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}