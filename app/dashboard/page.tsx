"use client";
import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Zap,
  Users,
  RefreshCw,
} from "lucide-react";
import Footer from "@/app/components/Footer";
import { NavbarDemo } from "../components/Navbar";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // GraphQL query for CDP data
  const CDPS_QUERY = `
    {
      cdps {
        id
        owner
        collateral
        debt
        healthFactor
      }
    }
  `;

  const GRAPH_API_URL =
    "https://api.studio.thegraph.com/query/118849/cosmic-capital/v0.1.4";

  // Initialize with empty loans array and system stats
  const [loans, setLoans] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalLoans: 0,
    atRiskLoans: 0,
    liquidationLoans: 0,
    todayLiquidations: 3, // Mock
    gasSaved: 120.45, // Mock
    totalCollateral: 0,
    totalBorrowed: 0,
    weeklyLiquidations: 18, // Mock
  });

  // Fetch CDP data from The Graph
  const fetchCdpData = async () => {
    try {
      setLoading(true);
      const response = await fetch(GRAPH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: CDPS_QUERY }),
      });

      const json = await response.json();

      if (json.errors) {
        console.error("GraphQL errors:", json.errors);
        return;
      }

      if (json.data?.cdps) {
        const processedLoans = json.data.cdps.map((cdp) => {
          const normalizedHF = normalizeHealthFactor(cdp.healthFactor);
          return {
            id: cdp.id,
            borrower: formatAddress(cdp.owner),
            fullAddress: cdp.owner,
            collateral: {
              amount: parseFloat(cdp.collateral) / 1e18,
              type: "ETH",
            },
            borrowed: { amount: formatDebt(cdp.debt), type: "DAI" },
            healthFactor: normalizedHF,
            status: getStatusFromHealthFactor(normalizedHF),
            rawDebt: parseFloat(cdp.debt),
            rawCollateral: parseFloat(cdp.collateral),
          };
        });

        setLoans(processedLoans);
        updateSystemStats(processedLoans);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching CDP data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update system stats based on fetched data
  const updateSystemStats = (loansData) => {
    const totalLoans = loansData.length;
    const atRiskLoans = loansData.filter(
      (loan) => loan.healthFactor < 1.2 && loan.healthFactor > 0
    ).length;
    const liquidationLoans = loansData.filter(
      (loan) => loan.healthFactor < 1.0
    ).length;
    const totalDebt = loansData.reduce((sum, loan) => sum + loan.rawDebt, 0);
    const totalCollateralValue = loansData.reduce(
      (sum, loan) => sum + loan.collateral.amount * 2000,
      0
    );

    setSystemStats((prev) => ({
      ...prev,
      totalLoans,
      atRiskLoans,
      liquidationLoans,
      totalCollateral: totalCollateralValue,
      totalBorrowed: totalDebt / 1e18,
    }));
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchCdpData();
    const interval = setInterval(() => {
      fetchCdpData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchCdpData();
  };

  // Clock updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock cross-chain status
  const [crossChainStatus] = useState([
    {
      id: 1,
      message: "Liquidate 0xabc123",
      status: "confirmed",
      timestamp: "14:32",
    },
    {
      id: 2,
      message: "Liquidate 0xdef456",
      status: "confirmed",
      timestamp: "14:35",
    },
    {
      id: 3,
      message: "Liquidate 0xghi789",
      status: "pending",
      timestamp: "15:20",
    },
  ]);

  // Mock liquidation history
  const [liquidationHistory] = useState([
    {
      id: 1,
      borrower: "0xabc123...def456",
      amount: "500 USDC",
      collateralSeized: "0.25 ETH",
      timestamp: "14:32",
      savings: "$18.50",
      txHash: "0x1a2b3c...",
    },
    {
      id: 2,
      borrower: "0xdef456...abc789",
      amount: "800 USDC",
      collateralSeized: "0.40 ETH",
      timestamp: "14:35",
      savings: "$22.80",
      txHash: "0x4d5e6f...",
    },
    {
      id: 3,
      borrower: "0xghi789...def012",
      amount: "1200 USDC",
      collateralSeized: "0.60 ETH",
      timestamp: "15:18",
      savings: "$31.20",
      txHash: "0x7g8h9i...",
    },
  ]);

  // Helper functions
  const formatAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatDebt = (debt) => {
    const debtNum = parseFloat(debt);
    if (debtNum === 0) return "0";
    if (debtNum < 1000) return debtNum.toString();
    if (debtNum < 1000000) return (debtNum / 1000).toFixed(1) + "K";
    if (debtNum < 1000000000) return (debtNum / 1000000).toFixed(1) + "M";
    return (debtNum / 1000000000).toFixed(1) + "B";
  };

  const normalizeHealthFactor = (hf) => {
    const hfNum = parseFloat(hf);
    if (hfNum === 0) return 0;
    if (hfNum > 1e50) return 999.99; // Cap at 999.99
    return hfNum / 1e18;
  };

  const getStatusFromHealthFactor = (hf) => {
    if (hf === 0) return "closed";
    if (hf < 1.0) return "liquidation";
    if (hf < 1.2) return "at-risk";
    return "healthy";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "at-risk":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "liquidation":
        return "text-red-600 bg-red-50 border-red-200";
      case "closed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "at-risk":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "liquidation":
        return <Zap className="w-4 h-4 text-red-500" />;
      case "closed":
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
      default:
        return null;
    }
  };

  const getHealthFactorColor = (hf) => {
    if (hf < 1) return "text-red-600 font-bold";
    if (hf < 1.2) return "text-yellow-600 font-semibold";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <NavbarDemo></NavbarDemo>
        <div className="mb-8 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                DeFi Liquidation Bot
              </h1>
              <p className="text-gray-600">
                Cross-chain liquidation powered by Hedera + Hyperlane
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Update</div>
              <div className="font-mono text-sm">
                {lastUpdated.toLocaleTimeString()}
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Updating..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Active Loans
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStats.totalLoans}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  At-Risk Loans
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {systemStats.atRiskLoans}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Liquidation Risk
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {systemStats.liquidationLoans || 0}
                </p>
              </div>
              <Zap className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Gas Saved Today
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${systemStats.gasSaved}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Protocol Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Protocol Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Collateral</span>
                <span className="font-semibold">
                  ${systemStats.totalCollateral.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Borrowed</span>
                <span className="font-semibold">
                  ${systemStats.totalBorrowed.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Utilization Ratio</span>
                <span className="font-semibold text-blue-600">
                  {(
                    (systemStats.totalBorrowed / systemStats.totalCollateral) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Weekly Liquidations</span>
                <span className="font-semibold">
                  {systemStats.weeklyLiquidations}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cross-Chain Status
            </h3>
            <div className="space-y-3">
              {crossChainStatus.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {msg.message}
                    </div>
                    <div className="text-xs text-gray-500">{msg.timestamp}</div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      msg.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {msg.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Loan Monitoring */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Live Loan Monitoring
                </h3>
                <p className="text-gray-600">
                  Real-time tracking of all active positions
                </p>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading...
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            {loans.length === 0 && !loading ? (
              <div className="p-8 text-center text-gray-500">
                No CDP data available. Check your GraphQL endpoint connection.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Borrower
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Collateral
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Borrowed
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Health Factor
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="font-mono text-sm text-gray-900">
                          {loan.borrower}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">
                          {loan.collateral.amount.toFixed(4)}{" "}
                          {loan.collateral.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${(loan.collateral.amount * 2000).toLocaleString()}{" "}
                          USD
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">
                          {loan.borrowed.amount} {loan.borrowed.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          Debt: {(loan.rawDebt / 1e18).toFixed(2)} DAI
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className={`font-bold ${getHealthFactorColor(
                            loan.healthFactor
                          )}`}
                        >
                          {loan.healthFactor.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                            loan.status
                          )}`}
                        >
                          {getStatusIcon(loan.status)}
                          {loan.status === "healthy"
                            ? "Healthy"
                            : loan.status === "at-risk"
                            ? "At Risk"
                            : loan.status === "liquidation"
                            ? "Liquidation"
                            : "Closed"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Liquidation History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Liquidations
            </h3>
            <p className="text-gray-600">Timeline of executed liquidations</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {liquidationHistory.map((liquidation) => (
                <div
                  key={liquidation.id}
                  className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <Zap className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Liquidated {liquidation.amount} from{" "}
                        {liquidation.borrower}
                      </div>
                      <div className="text-sm text-gray-600">
                        Seized {liquidation.collateralSeized} • Saved{" "}
                        {liquidation.savings} in gas
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {liquidation.timestamp}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {liquidation.txHash}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
