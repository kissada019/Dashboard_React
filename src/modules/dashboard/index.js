import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  DollarSign,
  ShoppingBag,
  Users,
  AlertCircle,
  TrendingUp,
  Leaf,
  MoreVertical,
} from "lucide-react";
import { onGetDashboardSummary } from "../../redux/slices/dashboardSlice";

const dashboardStyles = `
  .plant-dash {
    background: #f8fafc;
    min-height: calc(100vh - 50px);
    padding: 20px;
    color: #1e293b;
    width: calc(100% + 30px);
    margin-left: -15px;
    margin-right: -15px;
    box-sizing: border-box;
  }
  .pd-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  }
  .pd-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 10px;
    flex-wrap: wrap;
  }
  .pd-title {
    font-size: 34px;
    font-weight: 800;
    margin: 0;
  }
  .pd-subtitle {
    color: #64748b;
    font-size: 15px;
    margin-top: 4px;
  }
  .pd-range {
    display: flex;
    gap: 8px;
    align-items: end;
    flex-wrap: wrap;
  }
  .pd-range input {
    height: 38px;
    border: 1px solid #dbe2ea;
    border-radius: 10px;
    padding: 0 10px;
  }
  .pd-btn {
    height: 38px;
    border: none;
    border-radius: 10px;
    padding: 0 14px;
    color: #fff;
    background: #059669;
    font-weight: 700;
  }
  .pd-kpi-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }
  .pd-kpi {
    border-radius: 18px;
    padding: 16px;
    color: #fff;
    min-height: 110px;
  }
  .pd-kpi-label {
    font-size: 14px;
    opacity: .95;
    margin-top: 8px;
  }
  .pd-kpi-value {
    font-size: 30px;
    font-weight: 800;
    margin-top: 6px;
    line-height: 1.2;
  }
  .pd-main-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
  }
  .pd-sales-grid {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .pd-chart-grid {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .pd-chart-card {
    padding: 18px;
  }
  .pd-chart-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .pd-chart-title {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }
  .pd-chart-sub {
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
  }
  .pd-chart-bars {
    height: 180px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 10px;
  }
  .pd-chart-bar-item {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .pd-chart-bar-wrap {
    width: 100%;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .pd-chart-bar {
    width: 100%;
    max-width: 28px;
    border-radius: 8px 8px 4px 4px;
    background: linear-gradient(180deg, #22c55e, #0ea5e9);
    transition: opacity .2s;
  }
  .pd-chart-bar-item:hover .pd-chart-bar {
    opacity: .8;
  }
  .pd-chart-x {
    font-size: 12px;
    color: #64748b;
    white-space: nowrap;
  }
  .pd-chart-amount {
    position: absolute;
    top: -22px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    color: #0f172a;
    font-weight: 700;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    padding: 1px 6px;
    line-height: 1.3;
    white-space: nowrap;
  }
  .pd-line-wrap {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 8px;
    background: #f8fafc;
  }
  .pd-line-svg {
    width: 100%;
    height: 160px;
    display: block;
  }
  .pd-line-grid {
    stroke: #e2e8f0;
    stroke-width: 1;
  }
  .pd-line-path {
    fill: none;
    stroke: #8b5cf6;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .pd-line-dot {
    fill: #7c3aed;
  }
  .pd-line-labels {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    gap: 6px;
  }
  .pd-line-labels span {
    font-size: 12px;
    color: #64748b;
    flex: 1;
    text-align: center;
  }
  .pd-section {
    padding: 18px;
  }
  .pd-section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    gap: 10px;
    flex-wrap: wrap;
  }
  .pd-section-title {
    font-size: 22px;
    font-weight: 800;
    margin: 0;
  }
  .pd-search {
    height: 34px;
    border: 1px solid #dbe2ea;
    border-radius: 10px;
    padding: 0 10px;
  }
  .pd-table {
    width: 100%;
    border-collapse: collapse;
  }
  .pd-table th {
    color: #94a3b8;
    font-weight: 600;
    font-size: 14px;
    text-align: left;
    border-bottom: 1px solid #edf2f7;
    padding: 10px 8px;
  }
  .pd-table td {
    border-bottom: 1px solid #f1f5f9;
    padding: 12px 8px;
    font-size: 16px;
  }
  .pd-right {
    display: grid;
    gap: 16px;
    align-content: start;
  }
  .pd-top-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
    gap: 10px;
  }
  .pd-tag {
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
  }
  .pd-pay-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 70px;
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 800;
    border: 1px solid transparent;
  }
  .pd-pay-transfer {
    background: #dbeafe;
    color: #1d4ed8;
    border-color: #bfdbfe;
  }
  .pd-pay-cash {
    background: #dcfce7;
    color: #166534;
    border-color: #bbf7d0;
  }
  .pd-pay-unknown {
    background: #f1f5f9;
    color: #475569;
    border-color: #e2e8f0;
  }
  .pd-tag-success { background: #dcfce7; color: #166534; }
  .pd-tag-warning { background: #fef3c7; color: #92400e; }
  .pd-alert {
    padding: 10px 12px;
    border-radius: 12px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
  }
  .pd-alert-orange { background: #fff7ed; }
  .pd-alert-red { background: #fef2f2; }
  @media (max-width: 1400px) {
    .pd-kpi-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
  @media (max-width: 992px) {
    .pd-main-grid { grid-template-columns: 1fr; }
    .pd-sales-grid { grid-template-columns: 1fr; }
    .pd-chart-grid { grid-template-columns: 1fr; }
    .pd-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 576px) {
    .plant-dash {
      padding: 12px;
      width: calc(100% + 30px);
      margin-left: -15px;
      margin-right: -15px;
    }
    .pd-title { font-size: 28px; }
    .pd-kpi-grid { grid-template-columns: 1fr; }
    .pd-kpi-value { font-size: 26px; }
    .pd-section-title { font-size: 20px; }
    .pd-chart-title { font-size: 17px; }
    .pd-table th { font-size: 13px; }
    .pd-table td { font-size: 15px; }
  }
`;

function SalesBarChart({ data, maxBarWidth = 28 }) {
  const maxValue = Math.max(...data.map((d) => Number(d?.value || 0)), 1);
  const maxBarHeightPx = 130;
  const formatBarValue = (value) => {
    if (value >= 1000) {
      const compact = (value / 1000).toFixed(value >= 10000 ? 0 : 1);
      return `${compact}k`;
    }
    return String(value);
  };
  return (
    <div className="pd-chart-bars">
      {data.map((item) => {
        const value = Number(item?.value || 0);
        const ratio = Math.max(value / maxValue, 0.06);
        const barHeightPx = Math.max(Math.round(ratio * maxBarHeightPx), 10);
        return (
          <div className="pd-chart-bar-item" key={String(item?.label)}>
            <div
              className="pd-chart-bar-wrap"
              style={{ height: `${barHeightPx}px`, maxWidth: maxBarWidth }}
            >
              <div className="pd-chart-amount">฿{formatBarValue(value)}</div>
              <div
                className="pd-chart-bar"
                style={{ height: "100%", maxWidth: maxBarWidth }}
                title={`${item?.label}: ${value.toLocaleString()} บาท`}
              />
            </div>
            <div className="pd-chart-x">{item?.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function SalesLineChart({ data }) {
  const width = 520;
  const height = 160;
  const padding = 14;
  const maxValue = Math.max(...data.map((d) => Number(d?.value || 0)), 1);
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);
  const toY = (v) =>
    height - padding - ((height - padding * 2) * Number(v || 0)) / maxValue;
  const points = data
    .map((item, idx) => `${padding + idx * stepX},${toY(item?.value)}`)
    .join(" ");

  return (
    <>
      <div className="pd-line-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="pd-line-svg"
        >
          <line className="pd-line-grid" x1="0" y1="20" x2={width} y2="20" />
          <line className="pd-line-grid" x1="0" y1="80" x2={width} y2="80" />
          <line className="pd-line-grid" x1="0" y1="140" x2={width} y2="140" />
          <polyline className="pd-line-path" points={points} />
          {data.map((item, idx) => (
            <circle
              key={String(item?.label)}
              className="pd-line-dot"
              cx={padding + idx * stepX}
              cy={toY(item?.value)}
              r="4"
            />
          ))}
        </svg>
      </div>
      <div className="pd-line-labels">
        {data.map((item) => (
          <span key={String(item?.label)}>{item?.label}</span>
        ))}
      </div>
    </>
  );
}

const toYmd = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toUtcYmd = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getRangeByPreset = (
  preset,
  customFromDate,
  customToDate,
  selectedYear,
) => {
  const now = new Date();
  const today = toYmd(now);

  if (preset === "today") {
    return { from: today, to: today };
  }

  if (preset === "week") {
    const day = now.getDay(); // 0=Sun
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { from: toYmd(monday), to: toYmd(sunday) };
  }

  if (preset === "month") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: toYmd(first), to: toYmd(last) };
  }

  if (preset === "year") {
    const y = Number(selectedYear) || now.getFullYear();
    const first = new Date(y, 0, 1);
    const last = new Date(y, 11, 31);
    return { from: toYmd(first), to: toYmd(last) };
  }

  // custom_date
  const safeFrom = customFromDate || today;
  const safeTo = customToDate || safeFrom;
  return { from: safeFrom, to: safeTo };
};

function StatCard({ title, value, trend, trendUp, icon, bgColor, isAlert }) {
  return (
    <div className="pd-card" style={{ padding: 18 }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: bgColor,
          }}
        >
          {icon}
        </div>
        <div
          className="pd-tag"
          style={{
            background: isAlert ? "#fee2e2" : trendUp ? "#dcfce7" : "#ffe4e6",
            color: isAlert ? "#b91c1c" : trendUp ? "#166534" : "#be123c",
          }}
        >
          {trend}
        </div>
      </div>
      <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const { summary, loading } = useSelector(
    (state) => state.dashboardSlice || {},
  );
  const currentYear = new Date().getFullYear();
  const [datePreset, setDatePreset] = useState("month");
  const [customFromDate, setCustomFromDate] = useState(toYmd(new Date()));
  const [customToDate, setCustomToDate] = useState(toYmd(new Date()));
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [orderDateSearch, setOrderDateSearch] = useState("");
  const selectedRange = useMemo(
    () =>
      getRangeByPreset(datePreset, customFromDate, customToDate, selectedYear),
    [datePreset, customFromDate, customToDate, selectedYear],
  );

  useEffect(() => {
    dispatch(
      onGetDashboardSummary({
        from: selectedRange.from,
        to: selectedRange.to,
      }),
    );
  }, [dispatch, selectedRange]);

  const soldOrders = useMemo(
    () => (Array.isArray(summary?.sold_orders) ? summary.sold_orders : []),
    [summary],
  );

  const filteredSoldOrders = useMemo(() => {
    const sorted = [...soldOrders].sort(
      (a, b) =>
        new Date(b?.created_at || 0).getTime() -
        new Date(a?.created_at || 0).getTime(),
    );
    if (!orderDateSearch) return sorted.slice(0, 8);
    return sorted.filter((order) => {
      const d = new Date(order?.created_at || 0);
      if (Number.isNaN(d.getTime())) return false;
      // รองรับ timezone ต่างกัน (local/UTC) เพื่อให้ค้นหาได้ครบทุกวัน
      const localDate = toYmd(d);
      const utcDate = toUtcYmd(d);
      return localDate === orderDateSearch || utcDate === orderDateSearch;
    });
  }, [soldOrders, orderDateSearch]);

  const orderSalesDisplay = useMemo(() => {
    if (!orderDateSearch) {
      return Number(summary?.total_sales_from_orders ?? 0);
    }
    return filteredSoldOrders.reduce(
      (sum, order) =>
        sum + Number(order?.final_total ?? order?.total_price ?? 0),
      0,
    );
  }, [orderDateSearch, filteredSoldOrders, summary]);

  const soldOrderCountDisplay = useMemo(() => {
    if (!orderDateSearch) {
      return Number(summary?.sold_orders_count ?? 0);
    }
    return filteredSoldOrders.length;
  }, [orderDateSearch, filteredSoldOrders, summary]);

  const topPlants = useMemo(
    () =>
      (Array.isArray(summary?.top_selling_trees)
        ? summary.top_selling_trees
        : []
      )
        .map((item) => ({
          id: item?.tree_id,
          name: item?.tree_name || "ไม่ระบุชื่อ",
          species: item?.species || "-",
          sold: Number(item?.sold_quantity ?? 0),
          salesAmount: Number(item?.sales_amount ?? 0),
        }))
        .slice(0, 5),
    [summary],
  );

  const monthlyChartData = useMemo(
    () =>
      (Array.isArray(summary?.sales_monthly) ? summary.sales_monthly : []).map(
        (item, idx) => ({
          label: String(item?.label || item?.month || `${idx + 1}`),
          value: Number(item?.sales_amount ?? item?.value ?? 0),
        }),
      ),
    [summary],
  );

  const weeklyChartData = useMemo(
    () =>
      (Array.isArray(summary?.sales_weekly) ? summary.sales_weekly : []).map(
        (item, idx) => ({
          label: String(item?.label || item?.day || `${idx + 1}`),
          value: Number(item?.sales_amount ?? item?.value ?? 0),
        }),
      ),
    [summary],
  );

  const latestUpdateText = useMemo(() => {
    if (soldOrders.length === 0) return "-";
    const latest = [...soldOrders].sort(
      (a, b) =>
        new Date(b?.updated_at || b?.created_at || 0).getTime() -
        new Date(a?.updated_at || a?.created_at || 0).getTime(),
    )[0];
    const d = new Date(latest?.updated_at || latest?.created_at || 0);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("th-TH");
  }, [soldOrders]);

  return (
    <div className="plant-dash">
      <style>{dashboardStyles}</style>

      <div className="pd-topbar">
        <div>
          <h1 className="pd-title">ภาพรวมร้านค้า</h1>
          <div className="pd-subtitle">
            อัปเดตข้อมูลล่าสุด: {latestUpdateText} | ช่วงข้อมูล{" "}
            {selectedRange.from} ถึง {selectedRange.to}
          </div>
        </div>
        <div className="pd-range">
          <div>
            <div className="pd-subtitle">ช่วงเวลา</div>
            <select
              className="pd-search"
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value)}
              style={{ minWidth: 170 }}
            >
              <option value="today">วันปัจจุบัน</option>
              <option value="week">รายอาทิตย์</option>
              <option value="month">รายเดือน</option>
              <option value="year">รายปี</option>
              <option value="custom_date">ระบุวัน</option>
            </select>
          </div>
          {datePreset === "custom_date" && (
            <>
              <div>
                <div className="pd-subtitle">วันที่เริ่มต้น</div>
                <input
                  type="date"
                  value={customFromDate}
                  onChange={(e) => setCustomFromDate(e.target.value)}
                />
              </div>
              <div>
                <div className="pd-subtitle">วันที่สิ้นสุด</div>
                <input
                  type="date"
                  value={customToDate}
                  onChange={(e) => setCustomToDate(e.target.value)}
                />
              </div>
            </>
          )}
          {datePreset === "year" && (
            <div>
              <div className="pd-subtitle">เลือกปี</div>
              <input
                type="number"
                min={2000}
                max={2100}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="pd-kpi-grid">
        <div
          className="pd-kpi"
          style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}
        >
          <Leaf className="w-6 h-6" />
          <div className="pd-kpi-label">จำนวนชนิดต้นไม้</div>
          <div className="pd-kpi-value">
            {Number(summary?.total_tree_types ?? 0).toLocaleString()}
          </div>
        </div>
        <div
          className="pd-kpi"
          style={{ background: "linear-gradient(135deg,#f093fb,#f5576c)" }}
        >
          <Users className="w-6 h-6" />
          <div className="pd-kpi-label">จำนวนต้นไม้รวม</div>
          <div className="pd-kpi-value">
            {Number(summary?.total_trees ?? 0).toLocaleString()}
          </div>
        </div>
        <div
          className="pd-kpi"
          style={{ background: "linear-gradient(135deg,#4facfe,#00f2fe)" }}
        >
          <DollarSign className="w-6 h-6" />
          <div className="pd-kpi-label">มูลค่าสินค้าตามราคาขาย</div>
          <div className="pd-kpi-value">
            {Number(summary?.stock_value_sell_price ?? 0).toLocaleString()} ฿
          </div>
        </div>
        <div
          className="pd-kpi"
          style={{ background: "linear-gradient(135deg,#f6d365,#fda085)" }}
        >
          <DollarSign className="w-6 h-6" />
          <div className="pd-kpi-label">มูลค่าสินค้าตามราคาซื้อ</div>
          <div className="pd-kpi-value">
            {Number(summary?.stock_value_buy_price ?? 0).toLocaleString()} ฿
          </div>
        </div>
        <div
          className="pd-kpi"
          style={{ background: "linear-gradient(135deg,#43e97b,#38f9d7)" }}
        >
          <TrendingUp className="w-6 h-6" />
          <div className="pd-kpi-label">กำไรจากมูลค่าสต็อก</div>
          <div className="pd-kpi-value">
            {Number(summary?.stock_profit_value ?? 0).toLocaleString()} ฿
          </div>
        </div>
      </div>

      {loading && (
        <div className="pd-card" style={{ padding: 14, marginBottom: 12 }}>
          กำลังโหลดข้อมูล...
        </div>
      )}

      <div className="pd-sales-grid">
        <StatCard
          title="ยอดขายจากคำสั่งซื้อ"
          value={`฿${Number(orderSalesDisplay ?? 0).toLocaleString()}`}
          trend={`${Number(soldOrderCountDisplay ?? 0)} ออเดอร์`}
          trendUp
          icon={<ShoppingBag className="w-6 h-6" color="#2563eb" />}
          bgColor="#dbeafe"
        />
        <StatCard
          title="ออเดอร์ที่ขาย"
          value={`${Number(soldOrderCountDisplay ?? 0).toLocaleString()} รายการ`}
          trend={`${orderDateSearch ? "ตามวันที่เลือก" : "ทุกออเดอร์ในช่วง"}`}
          trendUp
          icon={<Users className="w-6 h-6" color="#7c3aed" />}
          bgColor="#ede9fe"
        />
      </div>

      <div className="pd-chart-grid">
        <div className="pd-card pd-chart-card">
          <div className="pd-chart-head">
            <h3 className="pd-chart-title">ยอดขายรายเดือน</h3>
            <span className="pd-chart-sub">
              {monthlyChartData.length || 0} เดือน
            </span>
          </div>
          {monthlyChartData.length > 0 ? (
            <SalesBarChart data={monthlyChartData} maxBarWidth={20} />
          ) : (
            <div className="pd-subtitle">ยังไม่มีข้อมูลยอดขายรายเดือน</div>
          )}
        </div>
        <div className="pd-card pd-chart-card">
          <div className="pd-chart-head">
            <h3 className="pd-chart-title">ยอดขายรายอาทิตย์</h3>
            <span className="pd-chart-sub">
              {weeklyChartData.length || 0} วันในสัปดาห์
            </span>
          </div>
          {weeklyChartData.length > 0 ? (
            <SalesLineChart data={weeklyChartData} />
          ) : (
            <div className="pd-subtitle">ยังไม่มีข้อมูลยอดขายรายอาทิตย์</div>
          )}
        </div>
      </div>

      <div className="pd-main-grid">
        <div className="pd-card pd-section">
          <div className="pd-section-head">
            <h2 className="pd-section-title">ออเดอร์ที่ขาย</h2>
            <div className="d-flex align-items-center" style={{ gap: 8 }}>
              <Search size={14} color="#94a3b8" />
              <input
                className="pd-search"
                type="date"
                value={orderDateSearch}
                onChange={(e) => setOrderDateSearch(e.target.value)}
              />
              <button
                className="pd-btn"
                style={{ height: 34, padding: "0 10px", background: "#475569" }}
                onClick={() => setOrderDateSearch("")}
              >
                ทั้งหมด
              </button>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="pd-table">
              <thead>
                <tr>
                  <th>รหัสสั่งซื้อ</th>
                  <th>วันที่</th>
                  <th>วิธีการชำระเงิน</th>
                  <th>สถานะ</th>
                  <th style={{ textAlign: "right" }}>ยอดสุทธิ</th>
                </tr>
              </thead>
              <tbody>
                {filteredSoldOrders.length > 0 ? (
                  filteredSoldOrders.map((order) => {
                    const dateText = order?.created_at
                      ? new Date(order.created_at).toLocaleDateString("th-TH")
                      : "-";
                    const status = String(
                      order?.status || "unknown",
                    ).toLowerCase();
                    const isCompleted = status === "completed";
                    const paymentMethod = String(
                      order?.payment_method || "",
                    ).toLowerCase();
                    const paymentText =
                      paymentMethod === "transfer"
                        ? "โอน"
                        : paymentMethod === "cash"
                          ? "เงินสด"
                          : "-";
                    const paymentClass =
                      paymentMethod === "transfer"
                        ? "pd-pay-transfer"
                        : paymentMethod === "cash"
                          ? "pd-pay-cash"
                          : "pd-pay-unknown";
                    return (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 700 }}>
                          {String(order.id || "").slice(0, 8)}...
                        </td>
                        <td>{dateText}</td>
                        <td>
                          <span className={`pd-pay-badge ${paymentClass}`}>
                            {paymentText}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`pd-tag ${isCompleted ? "pd-tag-success" : "pd-tag-warning"}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>
                          {Number(order?.final_total ?? 0).toLocaleString()} ฿
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        color: "#94a3b8",
                        padding: 20,
                      }}
                    >
                      {orderDateSearch
                        ? "ไม่พบออเดอร์ตามวันที่เลือก"
                        : "ยังไม่มีออเดอร์ที่ขาย"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pd-right">
          <div className="pd-card pd-section">
            <div className="pd-section-head" style={{ marginBottom: 10 }}>
              <h2 className="pd-section-title">ต้นไม้ขายดี</h2>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#94a3b8",
                }}
              >
                <MoreVertical size={18} />
              </button>
            </div>
            {topPlants.length > 0 ? (
              topPlants.map((plant, idx) => (
                <div
                  className="pd-top-item"
                  key={`${plant.id || plant.name}-${idx}`}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {plant.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {plant.species} • ขายแล้ว {plant.sold} ต้น
                    </div>
                  </div>
                  <div style={{ color: "#059669", fontWeight: 800 }}>
                    ฿{Number(plant.salesAmount || 0).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "#94a3b8", fontSize: 14 }}>
                ยังไม่มีข้อมูลต้นไม้ขายดี
              </div>
            )}
          </div>

          <div
            className="pd-card pd-section"
            style={{ borderTop: "4px solid #fb923c" }}
          >
            <div className="d-flex align-items-center mb-3">
              <AlertCircle
                size={18}
                color="#f97316"
                style={{ marginRight: 8 }}
              />
              <h2 className="pd-section-title" style={{ margin: 0 }}>
                แจ้งเตือนระบบ
              </h2>
            </div>
            <div className="pd-alert pd-alert-orange">
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                ออเดอร์ที่ขายในช่วงวันที่นี้
              </span>
              <span className="pd-tag pd-tag-warning">
                {Number(summary?.sold_orders_count ?? 0)} รายการ
              </span>
            </div>
            <div className="pd-alert pd-alert-red">
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                ตรวจสอบส่วนต่างกำไรสต็อก
              </span>
              <span
                className="pd-tag"
                style={{ background: "#fee2e2", color: "#b91c1c" }}
              >
                {Number(summary?.stock_profit_value ?? 0).toLocaleString()} ฿
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;
