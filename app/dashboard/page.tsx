"use client";
import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Zap,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { NavbarDemo } from "../components/Navbar";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real CDP data from The Graph
  const rawCdpData = {
    data: {
      cdps: [
        {
          id: "0x1648c14dbb6ccdd5846969ce23deec4c66a03335",
          owner: "0x1648c14dbb6ccdd5846969ce23deec4c66a03335",
          collateral: "0",
          debt: "60173274255398100463",
          healthFactor:
            "115792089237316195423570985008687900000000000000000000000000000000000000000000",
        },
        {
          id: "0x19c569184f60913daea2bd9409c12b031d06778f",
          owner: "0x19c569184f60913daea2bd9409c12b031d06778f",
          collateral: "0",
          debt: "25903",
          healthFactor: "1300003084051916265",
        },
        {
          id: "0x3a79e8539a19aaac21a0bda36f4613aae856a4f4",
          owner: "0x3a79e8539a19aaac21a0bda36f4613aae856a4f4",
          collateral: "0",
          debt: "2000",
          healthFactor: "27919746391913504004",
        },
        {
          id: "0x586a60f8dd53032425ada3b60d08d5ac28eb77db",
          owner: "0x586a60f8dd53032425ada3b60d08d5ac28eb77db",
          collateral: "0",
          debt: "2000000000000000",
          healthFactor: "5685279753434877938",
        },
        {
          id: "0x6c1549d623d891aeb2d99c049eff44680f9bdf83",
          owner: "0x6c1549d623d891aeb2d99c049eff44680f9bdf83",
          collateral: "0",
          debt: "110000",
          healthFactor: "521521542441346864271",
        },
        {
          id: "0x9c17eda79127cd6a370732d62f059adc87dc5d2d",
          owner: "0x9c17eda79127cd6a370732d62f059adc87dc5d2d",
          collateral: "0",
          debt: "10000000",
          healthFactor: "3537502400150968890",
        },
        {
          id: "0xa658e94bc3de686aaa5096414013ceec49b5900b",
          owner: "0xa658e94bc3de686aaa5096414013ceec49b5900b",
          collateral: "0",
          debt: "6000000000023675656",
          healthFactor: "1408540724460432427",
        },
        {
          id: "0xe72ca9163148c6a7d101b21c942584689ed83f05",
          owner: "0xe72ca9163148c6a7d101b21c942584689ed83f05",
          collateral: "0",
          debt: "117089995",
          healthFactor: "2596637348625969337",
        },
        {
          id: "0xe9fa4f143f073fd5017daa03b5863bb3966dcce4",
          owner: "0xe9fa4f143f073fd5017daa03b5863bb3966dcce4",
          collateral: "0",
          debt: "120000000",
          healthFactor: "1588453630228487397",
        },
      ],
    },
  };

  // Helper functions to process the raw data
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDebt = (debt) => {
    const debtNum = parseFloat(debt);
    if (debtNum < 1000) return debtNum.toString();
    if (debtNum < 1000000) return (debtNum / 1000).toFixed(1) + "K";
    if (debtNum < 1000000000) return (debtNum / 1000000).toFixed(1) + "M";
    return (debtNum / 1000000000).toFixed(1) + "B";
  };

  const normalizeHealthFactor = (hf) => {
    const hfNum = parseFloat(hf);
    // Handle extremely large numbers (likely representing infinity/max safe values)
    if (hfNum > 1e50) return 999.99; // Cap at 999.99 for display
    // Convert from wei-like format to decimal
    return hfNum / 1e18;
  };

  const getStatusFromHealthFactor = (hf) => {
    if (hf < 1.0) return "liquidation";
    if (hf < 1.2) return "at-risk";
    return "healthy";
  };

  // Process the raw CDP data
  const processedLoans = rawCdpData.data.cdps.map((cdp) => {
    const normalizedHF = normalizeHealthFactor(cdp.healthFactor);
    return {
      id: cdp.id,
      borrower: formatAddress(cdp.owner),
      collateral: { amount: parseFloat(cdp.collateral) / 1e18, type: "ETH" }, // Assuming ETH collateral
      borrowed: { amount: formatDebt(cdp.debt), type: "DAI" }, // Assuming DAI debt based on CDP structure
      healthFactor: normalizedHF,
      status: getStatusFromHealthFactor(normalizedHF),
      rawDebt: parseFloat(cdp.debt),
    };
  });

  const [loans, setLoans] = useState(processedLoans);

  // Calculate system stats from real data
  const totalLoans = loans.length;
  const atRiskLoans = loans.filter((loan) => loan.healthFactor < 1.2).length;
  const totalDebt = loans.reduce((sum, loan) => sum + loan.rawDebt, 0);
  const totalCollateralValue = loans.reduce(
    (sum, loan) => sum + loan.collateral.amount * 2000,
    0
  ); // Assuming ETH = $2000

  const [systemStats, setSystemStats] = useState({
    totalLoans,
    atRiskLoans,
    todayLiquidations: 3, // This would come from liquidation events
    gasSaved: 120.45, // This would be calculated from your Hedera vs Ethereum comparison
    totalCollateral: totalCollateralValue,
    totalBorrowed: totalDebt / 1e18, // Convert from wei
    weeklyLiquidations: 18, // This would come from historical data
  });

  const [liquidationHistory, setLiquidationHistory] = useState([
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

  const [crossChainStatus, setCrossChainStatus] = useState([
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "at-risk":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "liquidation":
        return <Zap className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "at-risk":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "liquidation":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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
        <div className="mb-8 mt-2">
          {" "}
          <NavbarDemo></NavbarDemo>
        </div>

        <div className="mb-8">
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
              <div className="font-mono text-lg">
                {currentTime.toLocaleTimeString()}
              </div>
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
                  Today's Liquidations
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {systemStats.todayLiquidations}
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
            <h3 className="text-lg font-semibold text-gray-900">
              Live Loan Monitoring
            </h3>
            <p className="text-gray-600">
              Real-time tracking of all active positions
            </p>
          </div>
          <div className="overflow-x-auto">
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
                        ${(loan.collateral.amount * 2000).toLocaleString()} USD
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
                          : "Liquidation"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
