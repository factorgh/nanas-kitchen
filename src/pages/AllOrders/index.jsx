import { useEffect, useMemo, useState } from "react";
import { Card, DatePicker, Table, Button, Row, Col, Statistic, message } from "antd";
import { getCompletedDeliveredOrders } from "../../services/order-service";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

function toArrayData(res) {
  if (Array.isArray(res)) return res;
  if (res?.data && Array.isArray(res.data)) return res.data;
  if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
}

function formatCurrency(amount, country) {
  const currency = country === "GH" ? "GHS" : "USD";
  const locale = country === "GH" ? "en-GH" : "en-US";
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount || 0);
  } catch {
    return amount;
  }
}

function computeRevenue(orders) {
  return orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
}

function monthKey(d) {
  return dayjs(d).format("YYYY-MM");
}

function computeMoMGrowth(orders) {
  // Group by month for Ghana completed orders
  const byMonth = orders.reduce((acc, o) => {
    const k = monthKey(o.createdAt);
    acc[k] = (acc[k] || 0) + (o.totalAmount || 0);
    return acc;
  }, {});
  const months = Object.keys(byMonth).sort();
  if (months.length < 2) return { current: byMonth[months[months.length - 1]] || 0, previous: 0, growth: null };
  const currentKey = months[months.length - 1];
  const prevKey = months[months.length - 2];
  const current = byMonth[currentKey] || 0;
  const previous = byMonth[prevKey] || 0;
  if (!previous) return { current, previous, growth: null };
  const growth = (current - previous) / previous;
  return { current, previous, growth };
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState(null); // no date filter by default (all-time)

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCompletedDeliveredOrders();
      const data = toArrayData(res);
      setOrders(data);
    } catch (e) {
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const [start, end] = range || [];
    return orders.filter((o) => {
      const created = dayjs(o.createdAt);
      const inRange = start && end
        ? created.valueOf() >= start.startOf("day").valueOf() && created.valueOf() <= end.endOf("day").valueOf()
        : true;
      return inRange; // status already filtered by backend
    });
  }, [orders, range]);

  const ghOrders = useMemo(() => filtered.filter((o) => o?.userDetails?.country === "GH"), [filtered]);
  const usOrders = useMemo(() => filtered.filter((o) => o?.userDetails?.country === "US"), [filtered]);

  const ghRevenue = useMemo(() => computeRevenue(ghOrders), [ghOrders]);
  const usRevenue = useMemo(() => computeRevenue(usOrders), [usOrders]);
  const ghMoM = useMemo(() => computeMoMGrowth(ghOrders), [ghOrders]);

  const columns = [
    { title: "Order ID", dataIndex: "_id", key: "id", render: (v) => `#${String(v).slice(-6)}` },
    { title: "Customer", key: "customer", render: (_, r) => r.userDetails ? `${r.userDetails.firstName} ${r.userDetails.lastName}` : "-" },
    { title: "Date", key: "date", render: (_, r) => dayjs(r.createdAt).format("YYYY-MM-DD HH:mm") },
    { title: "Total", key: "total", render: (_, r) => formatCurrency(r.totalAmount, r.userDetails?.country) },
  ];

  const statusCounts = useMemo(() => {
    const [start, end] = range || [];
    const inRangeOrders = orders.filter((o) => {
      if (!start || !end) return true;
      const created = dayjs(o.createdAt);
      return created.valueOf() >= start.startOf("day").valueOf() && created.valueOf() <= end.endOf("day").valueOf();
    });
    return inRangeOrders.reduce((acc, o) => {
      const key = String(o.status || "").toLowerCase().trim();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [orders, range]);

  const exportGhanaToCSV = () => {
    const headers = [
      "orderId","createdAt","status","firstName","lastName","email","phone","address","totalAmount","currency","items"
    ];
    const rows = ghOrders.map((o) => {
      const ud = o.userDetails || {};
      const items = Array.isArray(o.cartItems) ? o.cartItems.map((i) => `${i.title || i.name || "item"} x${i.quantity || 1}`).join(";") : "";
      return [
        o._id,
        o.createdAt,
        o.status,
        ud.firstName || "",
        ud.lastName || "",
        ud.email || "",
        ud.phone || "",
        ud.address || "",
        o.totalAmount || 0,
        "GHS",
        items,
      ];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ghana_orders_${dayjs().format("YYYYMMDD_HHmm")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="Ghana Revenue" value={ghRevenue} precision={2} prefix="₵" /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Ghana MoM Growth"
              value={ghMoM.growth == null ? 0 : ghMoM.growth * 100}
              precision={2}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="Ghana Orders" value={ghOrders.length} /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="USA Revenue" value={usRevenue} precision={2} prefix="$" /></Card>
        </Col>
      </Row>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3 items-center">
            <span>Date Range</span>
            <RangePicker
              value={range || undefined}
              onChange={(v) => setRange(v && v.length === 2 ? v : null)}
              allowClear
            />
          </div>
          <div className="flex gap-2">
            <Button type="primary" onClick={fetchData}>Refresh</Button>
            <Button onClick={exportGhanaToCSV}>Export Ghana Orders (CSV)</Button>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <span className="mr-2 font-semibold">Status summary (in date range):</span>
          {Object.keys(statusCounts).length === 0 ? (
            <span>All statuses (no date filter)</span>
          ) : (
            <span>
              {Object.entries(statusCounts)
                .map(([k, v]) => `${k || 'unknown'}: ${v}`)
                .join("  |  ")}
            </span>
          )}
        </div>
      </Card>

      <Card title="Ghana Orders">
        <Table rowKey="_id" loading={loading} dataSource={ghOrders} columns={columns} pagination={{ pageSize: 10 }} scroll={{ x: true }} />
      </Card>

      <Card title="USA Orders">
        <Table rowKey="_id" loading={loading} dataSource={usOrders} columns={columns} pagination={{ pageSize: 10 }} scroll={{ x: true }} />
      </Card>
    </div>
  );
}
