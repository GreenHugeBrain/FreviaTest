'use client';
import React, { useState, useEffect } from 'react';
import './AdminPanel.css'
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  MessageCircle, 
  Bell, 
  FileText,
  GraduationCap,
  Building,
  Bookmark,
  Activity,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  // JWT token helper function
  const getJwtToken = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          return parsedUser.token || null;
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  const apiCall = async (endpoint, options = {}) => {
    const token = getJwtToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`http://5.83.153.81:25608${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'jobs') {
      fetchJobs();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    } else if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'notifications') {
      fetchNotifications();
    } else if (activeTab === 'applications') {
      fetchApplications();
    } else if (activeTab === 'education') {
      fetchEducation();
    } else if (activeTab === 'experience') {
      fetchExperience();
    } else if (activeTab === 'saved-jobs') {
      fetchSavedJobs();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/dashboard');
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/jobs');
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/transactions');
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/messages');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/applications');
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/education');
      setEducation(data);
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/experience');
      setExperience(data);
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/saved-jobs');
      setSavedJobs(data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiCall('/api/admin/users', {
          method: 'DELETE',
          body: JSON.stringify({ user_id: userId }),
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await apiCall(`/api/admin/jobs/${jobId}`, {
          method: 'DELETE',
        });
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const deleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await apiCall(`/api/admin/messages/${messageId}`, {
          method: 'DELETE',
        });
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-text">
          <p className="stat-card-label">{title}</p>
          <p className="stat-card-value">{value}</p>
        </div>
        <Icon className={`stat-card-icon stat-card-icon-${color}`} />
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="sidebar-nav">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'transactions', label: 'Transactions', icon: DollarSign },
            { id: 'messages', label: 'Messages', icon: MessageCircle },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'experience', label: 'Experience', icon: Building },
            { id: 'saved-jobs', label: 'Saved Jobs', icon: Bookmark },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`sidebar-nav-item ${activeTab === id ? 'sidebar-nav-item-active' : ''}`}
            >
              <Icon className="sidebar-nav-icon" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="content-section">
      <div className="section-header">
        <h1 className="section-title">Dashboard</h1>
        <button 
          onClick={fetchDashboardData}
          className="btn btn-primary"
        >
          <RefreshCw className="btn-icon" />
          <span>Refresh</span>
        </button>
      </div>
      
      <div className="stats-grid">
        <StatCard title="Total Users" value={stats.total_users || 0} icon={Users} />
        <StatCard title="Active Users" value={stats.active_users || 0} icon={Activity} color="green" />
        <StatCard title="Total Jobs" value={stats.total_jobs || 0} icon={Briefcase} color="purple" />
        <StatCard title="Applications" value={stats.total_applications || 0} icon={FileText} color="orange" />
        <StatCard title="Revenue" value={`$${stats.total_revenue || 0}`} icon={DollarSign} color="green" />
        <StatCard title="Transactions" value={stats.total_transactions || 0} icon={TrendingUp} color="blue" />
        <StatCard title="Messages" value={stats.total_messages || 0} icon={MessageCircle} color="purple" />
        <StatCard title="Notifications" value={stats.total_notifications || 0} icon={Bell} color="red" />
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="content-section">
      <div className="section-header">
        <h1 className="section-title">Users Management</h1>
        <div className="section-actions">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            onClick={fetchUsers}
            className="btn btn-primary"
          >
            <RefreshCw className="btn-icon" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">User</th>
              <th className="table-header-cell">Role</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Balance</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {users.filter(user => 
              user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((user) => (
              <tr key={user.id} className="table-row">
                <td className="table-cell">
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </td>
                <td className="table-cell">
                  <span className={`badge badge-${user.role === 'admin' ? 'red' : user.role === 'employer' ? 'blue' : 'green'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={`status-indicator ${user.is_confirmed ? 'status-success' : 'status-error'}`}>
                    {user.is_confirmed ? <CheckCircle className="status-icon" /> : <XCircle className="status-icon" />}
                    {user.is_confirmed ? 'Confirmed' : 'Pending'}
                  </span>
                </td>
                <td className="table-cell table-cell-mono">
                  ${user.total_money || 0}
                </td>
                <td className="table-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="action-btn action-btn-view"
                    >
                      <Eye className="action-icon" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="action-btn action-btn-delete"
                    >
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const JobsView = () => (
    <div className="content-section">
      <div className="section-header">
        <h1 className="section-title">Jobs Management</h1>
        <button 
          onClick={fetchJobs}
          className="btn btn-primary"
        >
          <RefreshCw className="btn-icon" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Job</th>
              <th className="table-header-cell">Author</th>
              <th className="table-header-cell">Budget</th>
              <th className="table-header-cell">Applications</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {jobs.map((job) => (
              <tr key={job.id} className="table-row">
                <td className="table-cell">
                  <div className="job-info">
                    <div className="job-title">{job.title}</div>
                    <div className="job-description">{job.description?.substring(0, 100)}...</div>
                  </div>
                </td>
                <td className="table-cell table-cell-mono">
                  {job.author}
                </td>
                <td className="table-cell table-cell-mono">
                  ${job.min_budget} - ${job.max_budget}
                </td>
                <td className="table-cell table-cell-mono">
                  {job.applications_count}
                </td>
                <td className="table-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowJobModal(true);
                      }}
                      className="action-btn action-btn-view"
                    >
                      <Eye className="action-icon" />
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="action-btn action-btn-delete"
                    >
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const TransactionsView = () => (
    <div className="content-section">
      <div className="section-header">
        <h1 className="section-title">Transactions</h1>
        <button 
          onClick={fetchTransactions}
          className="btn btn-primary"
        >
          <RefreshCw className="btn-icon" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Transaction ID</th>
              <th className="table-header-cell">Client</th>
              <th className="table-header-cell">Freelancer</th>
              <th className="table-header-cell">Amount</th>
              <th className="table-header-cell">Platform Fee</th>
              <th className="table-header-cell">Status</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="table-row">
                <td className="table-cell table-cell-mono">
                  #{transaction.id}
                </td>
                <td className="table-cell table-cell-mono">
                  {transaction.client_name}
                </td>
                <td className="table-cell table-cell-mono">
                  {transaction.freelancer_name}
                </td>
                <td className="table-cell table-cell-mono">
                  ${transaction.amount}
                </td>
                <td className="table-cell table-cell-mono">
                  ${transaction.platform_fee}
                </td>
                <td className="table-cell">
                  <span className={`badge badge-${
                    transaction.status === 'completed' ? 'green' : 
                    transaction.status === 'pending' ? 'yellow' : 
                    'red'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const MessagesView = () => (
    <div className="content-section">
      <div className="section-header">
        <h1 className="section-title">Messages</h1>
        <button 
          onClick={fetchMessages}
          className="btn btn-primary"
        >
          <RefreshCw className="btn-icon" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">From</th>
              <th className="table-header-cell">To</th>
              <th className="table-header-cell">Message</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {messages.map((message) => (
              <tr key={message.id} className="table-row">
                <td className="table-cell table-cell-mono">
                  {message.sender_name}
                </td>
                <td className="table-cell table-cell-mono">
                  {message.receiver_name}
                </td>
                <td className="table-cell">
                  {message.messages?.substring(0, 50)}...
                </td>
                <td className="table-cell">
                  <span className={`status-indicator ${message.is_read ? 'status-neutral' : 'status-primary'}`}>
                    {message.is_read ? <CheckCircle className="status-icon" /> : <Clock className="status-icon" />}
                    {message.is_read ? 'Read' : 'Unread'}
                  </span>
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="action-btn action-btn-delete"
                  >
                    <Trash2 className="action-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <RefreshCw className="loading-spinner" />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'users':
        return <UsersView />;
      case 'jobs':
        return <JobsView />;
      case 'transactions':
        return <TransactionsView />;
      case 'messages':
        return <MessagesView />;
      case 'notifications':
        return (
          <div className="content-section">
            <h1 className="section-title">Notifications</h1>
            <div className="placeholder-container">
              <p className="placeholder-text">Notifications management interface</p>
            </div>
          </div>
        );
      case 'applications':
        return (
          <div className="content-section">
            <h1 className="section-title">Applications</h1>
            <div className="placeholder-container">
              <p className="placeholder-text">Job applications management interface</p>
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="content-section">
            <h1 className="section-title">Education Records</h1>
            <div className="placeholder-container">
              <p className="placeholder-text">User education records management</p>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="content-section">
            <h1 className="section-title">Experience Records</h1>
            <div className="placeholder-container">
              <p className="placeholder-text">User experience records management</p>
            </div>
          </div>
        );
      case 'saved-jobs':
        return (
          <div className="content-section">
            <h1 className="section-title">Saved Jobs</h1>
            <div className="placeholder-container">
              <p className="placeholder-text">User saved jobs management</p>
            </div>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="admin-panel">
      <Sidebar />
      <div className="main-content">
        <div className="main-content-inner">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;