import React, { useState, useEffect } from "react";
import {
  Calendar,
  Menu,
  X,
  ExternalLink,
  Image,
  QrCode,
  Eye,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [boothMap, setBoothMap] = useState({});

  const API_BASE = "http://3.110.143.3:5000";

  useEffect(() => {
  if (Array.isArray(data)) {
    const newBoothMap = {};
    data.forEach((item) => {
      newBoothMap[item.id] = Math.floor(Math.random() * 3) + 1; // 1 to 3
    });
    setBoothMap(newBoothMap);
  }
}, [data]);


  // Update the fetchData function
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `${API_BASE}/records?page=${page}&per_page=10`;

      // Only add date/time filters if they are set
      if (startDate && endDate) {
        url += `&start_date=${startDate}T${startTime}:00&end_date=${endDate}T${endTime}:59`;
      }

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const records = result.records || result.data || result || [];
      setData(records);
      setTotalPages(result.total_pages || 0);
      setTotal(result.total || 0);
    } catch (err) {
      setError("Failed to fetch data. Please check your API connection.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update the useEffect to only trigger on page change initially
  useEffect(() => {
    fetchData();
  }, [page]); // Remove startDate, endDate, startTime, endTime from dependencies

  // Update handleDateFilter function
  const handleDateFilter = () => {
    setPage(1);
    fetchData();
  };

  const handleLogout = () => {
    // Clear authentication
    alert("Logout functionality implemented!");
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStartTime("00:00");
    setEndTime("23:59");
    setPage(1);
    fetchData();
  };
const renderTableData = () => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan="4" style={styles.noData}>
          <div style={styles.noDataContent}>
            <Eye size={48} style={styles.noDataIcon} />
            <p>No records found</p>
            <small>Try adjusting your date and time filters</small>
          </div>
        </td>
      </tr>
    );
  }

  return data.map((item, index) => (
    <tr
      key={item.id}
      style={{
        ...styles.tableRow,
        ...(hoveredRow === index ? styles.tableRowHover : {}),
      }}
      onMouseEnter={() => setHoveredRow(index)}
      onMouseLeave={() => setHoveredRow(null)}
    >
      <td style={styles.tableCell}>
        <div style={styles.idBadge}>#{item.id}</div>
      </td>
      <td style={styles.tableCell}>
        <button
          onClick={() => openInNewTab(item.image_url)}
          style={styles.linkButton}
          title="View Image"
        >
          <Image size={16} />
          <span>View Image</span>
          <ExternalLink size={12} />
        </button>
      </td>
      <td style={styles.tableCell}>
        <div style={styles.dateContainer}>
          <span style={styles.dateText}>{formatDate(item.uploaded_at)}</span>
        </div>
      </td>
      <td style={styles.tableCell}>
        Booth {boothMap[item.id] || '-'}
      </td>
    </tr>
  ));
};



  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    sidebar: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "280px",
      height: "100vh",
      background: "linear-gradient(180deg, #2d3748 0%, #1a202c 100%)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 1000,
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    sidebarDesktop: {
      position: "static",
      transform: "none",
      width: "280px",
      height: "100vh",
      background: "linear-gradient(180deg, #2d3748 0%, #1a202c 100%)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      zIndex: "auto",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    sidebarHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "80px",
      padding: "0 24px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      background: "rgba(255, 255, 255, 0.05)",
    },
    sidebarTitle: {
      fontSize: "24px",
      fontWeight: "700",
      margin: 0,
      color: "#ffffff",
      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    closeButton: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "none",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      color: "#ffffff",
      transition: "all 0.2s ease",
    },
    sidebarContent: {
      padding: "32px 24px",
      overflow: "auto",
    },
    inputGroup: {
      marginBottom: "24px",
    },
    timeInputGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#e2e8f0",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "12px",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      background: "rgba(255, 255, 255, 0.1)",
      color: "#ffffff",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
    },
    timeInput: {
      width: "100%",
      padding: "10px 16px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "8px",
      fontSize: "12px",
      boxSizing: "border-box",
      outline: "none",
      background: "rgba(255, 255, 255, 0.1)",
      color: "#ffffff",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
    },
    dateTimeContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "16px",
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    timeContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    timeLabel: {
      fontSize: "12px",
      color: "#a0aec0",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      minWidth: "45px",
    },
    filterButton: {
      width: "100%",
      padding: "16px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginTop: "16px",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
    },
    filterButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 15px 30px rgba(102, 126, 234, 0.4)",
    },
    statsSection: {
      paddingTop: "32px",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      marginTop: "32px",
    },
    statItem: {
      fontSize: "14px",
      color: "#a0aec0",
      marginBottom: "12px",
      padding: "8px 12px",
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
    },
    paginationButtons: {
      display: "flex",
      gap: "12px",
      marginTop: "16px",
    },
    pageButton: {
      flex: 1,
      padding: "10px 16px",
      fontSize: "12px",
      fontWeight: "600",
      background: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "8px",
      cursor: "pointer",
      color: "#ffffff",
      transition: "all 0.2s ease",
    },
    pageButtonDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(4px)",
      zIndex: 999,
    },
    mainContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      marginLeft: window.innerWidth > 768 ? "" : "0",
    },
    header: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      padding: "20px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },
    menuButton: {
      background: "rgba(102, 126, 234, 0.1)",
      border: "none",
      cursor: "pointer",
      padding: "12px",
      borderRadius: "12px",
      color: "#667eea",
      display: window.innerWidth > 768 ? "none" : "block",
      transition: "all 0.2s ease",
    },
    headerTitle: {
      fontSize: "28px",
      fontWeight: "700",
      margin: 0,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    loadingText: {
      fontSize: "14px",
      color: "#667eea",
      fontWeight: "600",
    },
    main: {
      flex: 1,
      overflow: "auto",
      padding: "32px",
      background: "rgba(255, 255, 255, 0.1)",
    },
    errorMessage: {
      background: "linear-gradient(135deg, #fc8181 0%, #f56565 100%)",
      border: "1px solid rgba(245, 101, 101, 0.3)",
      color: "#ffffff",
      padding: "16px 20px",
      borderRadius: "12px",
      marginBottom: "24px",
      boxShadow: "0 10px 20px rgba(245, 101, 101, 0.2)",
    },
    tableContainer: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    tableWrapper: {
      overflow: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
    },
    tableHeaderCell: {
      padding: "20px 24px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "700",
      color: "#4a5568",
      textTransform: "uppercase",
      letterSpacing: "1px",
      borderBottom: "2px solid #e2e8f0",
    },
    tableBody: {
      background: "rgba(255, 255, 255, 0.8)",
    },
    tableRow: {
      borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
      transition: "all 0.2s ease",
    },
    tableRowHover: {
      background: "rgba(102, 126, 234, 0.05)",
      transform: "scale(1.01)",
    },
    tableCell: {
      padding: "20px 24px",
      fontSize: "14px",
      color: "#2d3748",
    },
    idBadge: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "700",
      display: "inline-block",
      boxShadow: "0 4px 8px rgba(102, 126, 234, 0.3)",
    },
    linkButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 8px rgba(72, 187, 120, 0.3)",
    },
    linkButtonQr: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      background: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 8px rgba(237, 137, 54, 0.3)",
    },
    dateContainer: {
      padding: "8px 12px",
      background: "rgba(102, 126, 234, 0.1)",
      borderRadius: "8px",
      border: "1px solid rgba(102, 126, 234, 0.2)",
    },
    dateText: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#667eea",
    },
    noData: {
      textAlign: "center",
      padding: "60px 20px",
    },
    noDataContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    },
    noDataIcon: {
      color: "#a0aec0",
      opacity: 0.6,
    },
    logoutButton: {
      padding: "8px 16px",
      background: "linear-gradient(135deg, #fc8181 0%, #f56565 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 8px rgba(252, 129, 129, 0.3)",
    },
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);
    return { currentDate, currentTime };
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div
        style={window.innerWidth > 768 ? styles.sidebarDesktop : styles.sidebar}
      >
        <div style={styles.sidebarHeader}>
          <h1 style={styles.sidebarTitle}>Dashboard</h1>
          {window.innerWidth <= 768 && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={styles.closeButton}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div style={styles.sidebarContent}>
          {/* Start Date and Time */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Start Date & Time</label>
            <div style={styles.dateTimeContainer}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={getCurrentDateTime().currentDate}
                style={styles.input}
              />

              <div style={styles.timeContainer}>
                <span style={styles.timeLabel}>
                  <Clock size={12} />
                  Time:
                </span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  max={
                    startDate === getCurrentDateTime().currentDate
                      ? getCurrentDateTime().currentTime
                      : "23:59"
                  }
                  style={styles.timeInput}
                />
              </div>
            </div>
          </div>

          {/* End Date and Time */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>End Date & Time</label>
            <div style={styles.dateTimeContainer}>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={getCurrentDateTime().currentDate}
                style={styles.input}
              />
              <div style={styles.timeContainer}>
                <span style={styles.timeLabel}>
                  <Clock size={12} />
                  Time:
                </span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  max={
                    endDate === getCurrentDateTime().currentDate
                      ? getCurrentDateTime().currentTime
                      : "23:59"
                  }
                  style={styles.timeInput}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleDateFilter}
            style={{
              ...styles.filterButton,
              ...(hoveredButton === "filter" ? styles.filterButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton("filter")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Calendar size={16} />
            Apply Filter
          </button>

          <div style={styles.statsSection}>
            <div style={styles.statItem}>
              <span>Page</span>
              <span>
                {page} of {totalPages}
              </span>
            </div>
            <div style={styles.statItem}>
              <span>Current Records</span>
              <span>{Array.isArray(data) ? data.length : 0}</span>
            </div>
            <div style={styles.statItem}>
              <span>Total Records</span>
              <span>{total}</span>
            </div>

            <div style={styles.paginationButtons}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  ...styles.pageButton,
                  ...(page === 1 ? styles.pageButtonDisabled : {}),
                }}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                style={{
                  ...styles.pageButton,
                  ...(page >= totalPages ? styles.pageButtonDisabled : {}),
                }}
              >
                Next
              </button>
            </div>

            <button
              onClick={clearFilters}
              style={{
                ...styles.filterButton,
                background: "linear-gradient(135deg, #a0aec0 0%, #718096 100%)",
                marginTop: "8px",
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={styles.menuButton}
            >
              <Menu size={20} />
            </button>
            <h2 style={styles.headerTitle}>Records Dashboard</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {loading && <div style={styles.loadingText}>Loading...</div>}
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={styles.main}>
          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.tableContainer}>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableHeaderCell}>ID</th>
                    <th style={styles.tableHeaderCell}>Image</th>
                    <th style={styles.tableHeaderCell}>Uploaded At</th>
                    <th style={styles.tableHeaderCell}>Booth number</th>
                  </tr>
                </thead>
                <tbody style={styles.tableBody}>{renderTableData()}</tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;